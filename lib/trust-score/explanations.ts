import type { TrustScoreFactor, TrustScoreFactorKey } from "./types";

/** Always show these factors so explanations stay understandable. */
const EDUCATIONAL_FACTOR_KEYS = new Set<TrustScoreFactorKey>([
  "RATING",
  "COMPLAINTS",
  "VERIFICATION",
  "RESPONSE_RATE",
]);

/** Public-facing neutral copy derived from factor breakdown. */
export function buildTrustScoreReasons(factors: TrustScoreFactor[]): string[] {
  const reasons: string[] = [];

  for (const factor of factors) {
    if (factor.key === "BASE") {
      continue;
    }
    const isEducational = EDUCATIONAL_FACTOR_KEYS.has(factor.key);
    if (Math.abs(factor.impact) < 0.01 && !isEducational) {
      continue;
    }
    reasons.push(factor.description);
  }

  if (reasons.length === 0) {
    reasons.push(
      "This score is based on limited community signals so far. More reviews and verified business details can refine it over time.",
    );
  }

  return reasons;
}
