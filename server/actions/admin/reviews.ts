"use server";

import { ReviewStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { recordAuditLog } from "@/lib/moderation/audit-log";
import { canTransitionReviewStatus } from "@/lib/moderation/review-transitions";
import { isAdmin } from "@/lib/permissions/admin";
import { prisma } from "@/lib/db";
import { recalculateBusinessReviewAggregates } from "@/lib/reviews/aggregates";
import { recalculateTrustScore } from "@/lib/trust-score/recalculate";
import { moderateReviewSchema } from "@/lib/validations/admin";

export type AdminReviewActionState = {
  success?: boolean;
  error?: string;
  message?: string;
};

const ACTION_TO_STATUS: Record<
  string,
  ReviewStatus | "DELETE"
> = {
  approve: ReviewStatus.APPROVED,
  reject: ReviewStatus.REJECTED,
  flag: ReviewStatus.FLAGGED,
  under_review: ReviewStatus.UNDER_REVIEW,
  delete: "DELETE",
};

function auditActionForModeration(
  action: "approve" | "reject" | "flag" | "under_review" | "delete",
): string {
  switch (action) {
    case "approve":
      return "REVIEW_APPROVED";
    case "reject":
      return "REVIEW_REJECTED";
    case "flag":
      return "REVIEW_FLAGGED";
    case "under_review":
      return "REVIEW_UNDER_REVIEW";
    case "delete":
      return "REVIEW_DELETED";
  }
}

export async function moderateReviewAction(
  _prevState: AdminReviewActionState,
  formData: FormData,
): Promise<AdminReviewActionState> {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    return { error: "Admin access required." };
  }

  const parsed = moderateReviewSchema.safeParse({
    reviewId: formData.get("reviewId"),
    action: formData.get("action"),
  });

  if (!parsed.success) {
    return { error: "Invalid moderation request." };
  }

  const review = await prisma.review.findUnique({
    where: { id: parsed.data.reviewId },
    select: {
      id: true,
      status: true,
      businessId: true,
      business: { select: { slug: true } },
    },
  });

  if (!review) {
    return { error: "Review not found." };
  }

  const target = ACTION_TO_STATUS[parsed.data.action];
  if (!target) {
    return { error: "Unknown action." };
  }

  if (target === "DELETE") {
    await prisma.review.delete({ where: { id: review.id } });
    await recalculateBusinessReviewAggregates(review.businessId);
    await recalculateTrustScore(review.businessId);
    await recordAuditLog({
      actorUserId: user.id,
      action: auditActionForModeration("delete"),
      entityType: "Review",
      entityId: review.id,
      metadata: { previousStatus: review.status, businessId: review.businessId },
    });
  } else {
    if (!canTransitionReviewStatus(review.status, target)) {
      return { error: "That status change is not allowed." };
    }

    const wasApproved = review.status === ReviewStatus.APPROVED;
    const willBeApproved = target === ReviewStatus.APPROVED;

    await prisma.review.update({
      where: { id: review.id },
      data: { status: target },
    });

    if (wasApproved || willBeApproved) {
      await recalculateBusinessReviewAggregates(review.businessId);
    }
    await recalculateTrustScore(review.businessId);

    await recordAuditLog({
      actorUserId: user.id,
      action: auditActionForModeration(parsed.data.action),
      entityType: "Review",
      entityId: review.id,
      metadata: {
        from: review.status,
        to: target,
        businessId: review.businessId,
      },
    });
  }

  revalidatePath(`/businesses/${review.business.slug}`);
  revalidatePath("/businesses");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/reviews");

  return {
    success: true,
    message:
      target === "DELETE"
        ? "Review deleted."
        : `Review marked as ${target.replace("_", " ").toLowerCase()}.`,
  };
}
