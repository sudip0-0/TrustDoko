import { ReviewStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

export function computeAverageRating(ratings: number[]): number {
  if (ratings.length === 0) {
    return 0;
  }
  const sum = ratings.reduce((total, rating) => total + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

export async function recalculateBusinessReviewAggregates(
  businessId: string,
): Promise<{ reviewCount: number; averageRating: number }> {
  const approved = await prisma.review.findMany({
    where: { businessId, status: ReviewStatus.APPROVED },
    select: { rating: true },
  });

  const reviewCount = approved.length;
  const averageRating = computeAverageRating(
    approved.map((review) => review.rating),
  );

  await prisma.business.update({
    where: { id: businessId },
    data: { reviewCount, averageRating },
  });

  return { reviewCount, averageRating };
}
