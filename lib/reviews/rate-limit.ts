import { prisma } from "@/lib/db";

const RATE_LIMIT_MINUTES = 10;

export async function isReviewRateLimited(
  userId: string,
  excludeReviewId?: string,
): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT_MINUTES * 60 * 1000);

  const recent = await prisma.review.findFirst({
    where: {
      userId,
      createdAt: { gte: since },
      ...(excludeReviewId ? { id: { not: excludeReviewId } } : {}),
    },
    select: { id: true },
  });

  return recent !== null;
}
