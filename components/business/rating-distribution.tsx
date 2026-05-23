type RatingDistributionProps = {
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  averageRating: number;
  reviewCount: number;
};

export function RatingDistribution({
  distribution,
  averageRating,
  reviewCount,
}: RatingDistributionProps) {
  const max = Math.max(1, ...Object.values(distribution));

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="type-body-strong">Rating summary</p>
      <p className="type-metric text-foreground mt-2 text-2xl">
        {reviewCount > 0 ? averageRating.toFixed(1) : "—"}
        <span className="type-body font-normal"> / 5</span>
      </p>
      <p className="type-caption mt-1">
        {reviewCount} approved review{reviewCount === 1 ? "" : "s"}
      </p>

      {reviewCount === 0 ? (
        <p className="text-muted mt-4 text-sm">No ratings to display yet.</p>
      ) : (
        <ul className="mt-4 list-none space-y-2 p-0" aria-label="Star rating distribution">
          {([5, 4, 3, 2, 1] as const).map((star) => {
            const count = distribution[star];
            const width = `${Math.round((count / max) * 100)}%`;
            return (
              <li key={star} className="flex items-center gap-3 text-sm">
                <span className="text-muted w-8 shrink-0 tabular-nums">{star} ★</span>
                <div
                  className="h-2 flex-1 overflow-hidden rounded-full bg-muted/40"
                  aria-hidden="true"
                >
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width }}
                  />
                </div>
                <span className="text-muted w-8 shrink-0 text-right text-xs tabular-nums">
                  {count}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
