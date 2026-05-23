import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { copy } from "@/lib/copy/messages";

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
    <Card
      id="trust-score"
      className="scroll-mt-24"
      aria-labelledby="trust-score-heading"
    >
      <CardContent className="py-6">
        <h2 id="trust-score-heading" className="type-h3">
          How this trust score is calculated
        </h2>
        <CardDescription className="mt-2">
          Trust score:{" "}
          <span className="text-foreground font-semibold tabular-nums">
            {trustScore}/100
          </span>
          . {copy.trust.disclaimer}
        </CardDescription>
        <ul className="text-muted mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
          {items.map((reason, index) => (
            <li key={`${index}-${reason.slice(0, 32)}`}>{reason}</li>
          ))}
        </ul>
        <p className="text-muted mt-4 text-xs leading-relaxed">
          Scores update when new reviews, complaints, owner responses, or
          verification changes are recorded. Use this alongside your own research
          before paying — especially for prepayment or bank transfer.
        </p>
      </CardContent>
    </Card>
  );
}
