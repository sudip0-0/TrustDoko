/**
 * Pure rule for the trust-score "recent negative trend" signal.
 * Kept isolated from Prisma so it stays deterministic and testable.
 */
export type RatingTrendBucket = {
  count: number;
  averageRating: number;
};

/**
 * A business shows a recent negative trend when there are at least two recent
 * approved reviews, at least one older baseline review, and the recent average
 * dropped by half a star or more versus the older average.
 */
export function hasRecentNegativeTrend(
  recent: RatingTrendBucket,
  older: RatingTrendBucket,
): boolean {
  if (recent.count < 2 || older.count < 1) {
    return false;
  }
  return recent.averageRating <= older.averageRating - 0.5;
}
