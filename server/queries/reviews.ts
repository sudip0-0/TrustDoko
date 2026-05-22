import { ReviewStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

export const REVIEW_PAGE_SIZE = 10;

export type ReviewListItem = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  experienceType: string | null;
  experienceDate: Date | null;
  wouldRecommend: boolean;
  tags: string[];
  helpfulCount: number;
  createdAt: Date;
  authorName: string | null;
  userId: string;
  viewerHasVoted: boolean;
};

export type ViewerReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  experienceType: string | null;
  experienceDate: Date | null;
  wouldRecommend: boolean;
  tags: string[];
  status: ReviewStatus;
  createdAt: Date;
};

export async function getApprovedReviewsForBusiness(
  businessId: string,
  page: number,
  viewerUserId?: string | null,
): Promise<{ reviews: ReviewListItem[]; total: number; totalPages: number }> {
  const where = { businessId, status: ReviewStatus.APPROVED };
  const total = await prisma.review.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / REVIEW_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const skip = (safePage - 1) * REVIEW_PAGE_SIZE;

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: REVIEW_PAGE_SIZE,
    select: {
      id: true,
      rating: true,
      title: true,
      body: true,
      experienceType: true,
      experienceDate: true,
      wouldRecommend: true,
      tags: true,
      helpfulCount: true,
      createdAt: true,
      userId: true,
      user: { select: { name: true } },
      votes: viewerUserId
        ? { where: { userId: viewerUserId }, select: { id: true } }
        : false,
    },
  });

  return {
    reviews: reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      body: review.body,
      experienceType: review.experienceType,
      experienceDate: review.experienceDate,
      wouldRecommend: review.wouldRecommend,
      tags: review.tags,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt,
      authorName: review.user.name,
      userId: review.userId,
      viewerHasVoted: viewerUserId
        ? Array.isArray(review.votes) && review.votes.length > 0
        : false,
    })),
    total,
    totalPages,
  };
}

export async function getViewerReviewForBusiness(
  businessId: string,
  userId: string,
): Promise<ViewerReview | null> {
  const review = await prisma.review.findUnique({
    where: { businessId_userId: { businessId, userId } },
    select: {
      id: true,
      rating: true,
      title: true,
      body: true,
      experienceType: true,
      experienceDate: true,
      wouldRecommend: true,
      tags: true,
      status: true,
      createdAt: true,
    },
  });

  return review;
}

export async function getUserReviews(userId: string) {
  return prisma.review.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      rating: true,
      title: true,
      status: true,
      updatedAt: true,
      business: { select: { name: true, slug: true } },
    },
  });
}
