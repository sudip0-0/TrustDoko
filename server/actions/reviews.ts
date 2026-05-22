"use server";

import { Prisma, ReviewStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { determineReviewStatus } from "@/lib/moderation/review-status";
import { isBusinessOwner } from "@/lib/permissions/business";
import { isAdmin } from "@/lib/permissions/admin";
import { canDeleteReview, canEditReview, canReplyToReview } from "@/lib/permissions/review";
import { recalculateBusinessReviewAggregates } from "@/lib/reviews/aggregates";
import { recalculateTrustScore } from "@/lib/trust-score/recalculate";
import { isReviewRateLimited } from "@/lib/reviews/rate-limit";
import { prisma } from "@/lib/db";
import {
  parseReviewFormData,
  respondToReviewSchema,
  submitReviewSchema,
  updateReviewSchema,
} from "@/lib/validations/review";

export type ReviewActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  message?: string;
};

function formatZodErrors(
  errors: Record<string, string[] | undefined>,
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(errors).filter((entry): entry is [string, string[]] => {
      return entry[1] !== undefined && entry[1].length > 0;
    }),
  );
}

function parseExperienceDate(value: string | undefined): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildReviewData(parsed: {
  rating: number;
  title?: string;
  body: string;
  experienceType?: string;
  experienceDate?: string;
  wouldRecommend?: boolean;
  tags?: string[];
}) {
  const status = determineReviewStatus(parsed.title, parsed.body);
  return {
    rating: parsed.rating,
    title: parsed.title || null,
    body: parsed.body,
    experienceType: parsed.experienceType ?? null,
    experienceDate: parseExperienceDate(parsed.experienceDate),
    wouldRecommend: parsed.wouldRecommend ?? true,
    tags: parsed.tags ?? [],
    status,
  };
}

export async function submitReviewAction(
  _prevState: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const user = await getSessionUser();
  if (!user) {
    return {
      error: "You must sign in to submit a review.",
    };
  }

  const parsed = submitReviewSchema.safeParse({
    ...parseReviewFormData(formData),
    businessSlug: formData.get("businessSlug"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const business = await prisma.business.findUnique({
    where: { slug: parsed.data.businessSlug },
    select: { id: true, slug: true },
  });

  if (!business) {
    return { error: "Business not found." };
  }

  const existing = await prisma.review.findUnique({
    where: {
      businessId_userId: { businessId: business.id, userId: user.id },
    },
    select: { id: true },
  });

  if (existing) {
    formData.set("reviewId", existing.id);
    return updateReviewAction(_prevState, formData);
  }

  if (await isReviewRateLimited(user.id)) {
    return {
      error: "Please wait a few minutes before submitting another review.",
    };
  }

  const reviewData = buildReviewData(parsed.data);

  try {
    await prisma.review.create({
      data: {
        businessId: business.id,
        userId: user.id,
        ...reviewData,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        error:
          "You already reviewed this business. Edit your existing review below.",
      };
    }
    throw error;
  }

  if (reviewData.status === ReviewStatus.APPROVED) {
    await recalculateBusinessReviewAggregates(business.id);
  }
  await recalculateTrustScore(business.id);

  revalidatePath(`/businesses/${business.slug}`);

  return {
    success: true,
    message:
      reviewData.status === ReviewStatus.PENDING
        ? "Your review was submitted and is pending moderation."
        : "Your review was published.",
  };
}

export async function updateReviewAction(
  _prevState: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must sign in to edit a review." };
  }

  const parsed = updateReviewSchema.safeParse({
    ...parseReviewFormData(formData),
    reviewId: formData.get("reviewId"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const review = await prisma.review.findUnique({
    where: { id: parsed.data.reviewId },
    select: {
      id: true,
      userId: true,
      businessId: true,
      business: { select: { slug: true } },
    },
  });

  if (!review) {
    return { error: "Review not found." };
  }

  if (!canEditReview(user, review.userId)) {
    return { error: "You can only edit your own reviews." };
  }

  const reviewData = buildReviewData(parsed.data);

  await prisma.review.update({
    where: { id: review.id },
    data: reviewData,
  });

  await recalculateBusinessReviewAggregates(review.businessId);
  await recalculateTrustScore(review.businessId);

  revalidatePath(`/businesses/${review.business.slug}`);

  return {
    success: true,
    message:
      reviewData.status === ReviewStatus.PENDING
        ? "Your review was updated and is pending moderation."
        : "Your review was updated.",
  };
}

export async function deleteReviewAction(
  _prevState: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must sign in to delete a review." };
  }

  const reviewId = formData.get("reviewId");
  if (typeof reviewId !== "string" || !reviewId) {
    return { error: "Review is required." };
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      userId: true,
      businessId: true,
      status: true,
      business: { select: { slug: true } },
    },
  });

  if (!review) {
    return { error: "Review not found." };
  }

  if (!canDeleteReview(user, review.userId)) {
    return { error: "You can only delete your own reviews." };
  }

  await prisma.review.delete({ where: { id: review.id } });

  if (review.status === ReviewStatus.APPROVED) {
    await recalculateBusinessReviewAggregates(review.businessId);
  } else {
    const approvedCount = await prisma.review.count({
      where: { businessId: review.businessId, status: ReviewStatus.APPROVED },
    });
    if (approvedCount > 0) {
      await recalculateBusinessReviewAggregates(review.businessId);
    } else {
      await prisma.business.update({
        where: { id: review.businessId },
        data: { reviewCount: 0, averageRating: 0 },
      });
    }
  }
  await recalculateTrustScore(review.businessId);

  revalidatePath(`/businesses/${review.business.slug}`);

  return { success: true, message: "Your review was deleted." };
}

export async function voteReviewHelpfulAction(
  reviewId: string,
): Promise<ReviewActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Sign in to mark reviews as helpful." };
  }

  if (!reviewId) {
    return { error: "Review is required." };
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId, status: ReviewStatus.APPROVED },
    select: {
      id: true,
      userId: true,
      business: { select: { slug: true } },
      votes: { where: { userId: user.id }, select: { id: true } },
    },
  });

  if (!review) {
    return { error: "Review not found." };
  }

  if (review.userId === user.id) {
    return { error: "You cannot mark your own review as helpful." };
  }

  if (review.votes.length > 0) {
    return { success: true, message: "You already marked this review helpful." };
  }

  await prisma.$transaction([
    prisma.reviewVote.create({
      data: { reviewId: review.id, userId: user.id },
    }),
    prisma.review.update({
      where: { id: review.id },
      data: { helpfulCount: { increment: 1 } },
    }),
  ]);

  revalidatePath(`/businesses/${review.business.slug}`);

  return { success: true, message: "Marked as helpful." };
}

export async function respondToReviewAction(
  _prevState: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must sign in to respond." };
  }

  const parsed = respondToReviewSchema.safeParse({
    reviewId: formData.get("reviewId"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const review = await prisma.review.findUnique({
    where: { id: parsed.data.reviewId, status: ReviewStatus.APPROVED },
    select: {
      id: true,
      businessId: true,
      business: {
        select: {
          slug: true,
          claimedByUserId: true,
          claimStatus: true,
        },
      },
      businessResponse: { select: { id: true } },
    },
  });

  if (!review) {
    return { error: "Review not found." };
  }

  if (isAdmin(user)) {
    if (!canReplyToReview(user, review.business)) {
      return { error: "You cannot respond to reviews for this business." };
    }
  } else if (!isBusinessOwner(user, review.business)) {
    return {
      error: "Only the claimed business owner can respond to this review.",
    };
  }

  if (review.businessResponse) {
    return { error: "A response has already been posted for this review." };
  }

  await prisma.$transaction([
    prisma.businessResponse.create({
      data: {
        businessId: review.businessId,
        authorUserId: user.id,
        reviewId: review.id,
        body: parsed.data.body,
      },
    }),
    prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "REVIEW_BUSINESS_RESPONDED",
        entityType: "Review",
        entityId: review.id,
      },
    }),
  ]);

  await recalculateTrustScore(review.businessId);

  revalidatePath(`/businesses/${review.business.slug}`);
  revalidatePath(`/dashboard/business/${review.businessId}`);

  return { success: true, message: "Your response was posted." };
}
