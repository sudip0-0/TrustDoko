type TrustScoreExplanationProps = {
  trustScore: number;
  reasons: string[] | null;
};

export function TrustScoreExplanation({
  trustScore,
  reasons,
}: TrustScoreExplanationProps) {
  const items =
    Array.isArray(reasons) && reasons.length > 0
      ? reasons.filter((r): r is string => typeof r === "string")
      : [
          "This score is based on community reviews, complaint reports, verification status, owner responses, and profile completeness.",
        ];

  return (
    <section
      className="rounded-xl border border-border bg-card p-6"
      aria-labelledby="trust-score-heading"
    >
      <h2 id="trust-score-heading" className="text-lg font-semibold">
        How this trust score is calculated
      </h2>
      <p className="text-muted mt-2 text-sm leading-relaxed">
        Trust score:{" "}
        <span className="text-foreground font-semibold tabular-nums">
          {trustScore}/100
        </span>
        . The number reflects community-reported signals on TrustDoko, not a
        legal finding or guarantee of safety.
      </p>
      <ul className="text-muted mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
        {items.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
      <p className="text-muted mt-4 text-xs leading-relaxed">
        Scores update when new reviews, complaints, owner responses, or
        verification changes are recorded. Use this as one input alongside your
        own research before purchasing.
      </p>
    </section>
  );
}
