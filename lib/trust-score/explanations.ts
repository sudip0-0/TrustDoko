import type { TrustScoreFactor } from "./types";

/** Public-facing neutral copy derived from factor breakdown. */
export function buildTrustScoreReasons(factors: TrustScoreFactor[]): string[] {
  const reasons: string[] = [];

  for (const factor of factors) {
    if (factor.key === "BASE") {
      continue;
    }
    if (Math.abs(factor.impact) < 0.01) {
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
