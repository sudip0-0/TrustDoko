export type TrustLabelKey =
  | "HIGHLY_TRUSTED"
  | "TRUSTED"
  | "MIXED"
  | "RISKY"
  | "HIGH_RISK";

export type TrustLabelDisplay = {
  key: TrustLabelKey;
  label: string;
  tone: "positive" | "neutral" | "caution" | "negative";
};

/**
 * Maps stored trust score (0–100) to a public label for listings.
 * Full formula lives in TD-0501; this is a simple MVP display mapping.
 */
export function getTrustLabelFromScore(trustScore: number): TrustLabelDisplay {
  if (trustScore >= 80) {
    return {
      key: "HIGHLY_TRUSTED",
      label: "Highly Trusted",
      tone: "positive",
    };
  }
  if (trustScore >= 65) {
    return { key: "TRUSTED", label: "Trusted", tone: "positive" };
  }
  if (trustScore >= 45) {
    return { key: "MIXED", label: "Mixed Reputation", tone: "neutral" };
  }
  if (trustScore >= 25) {
    return { key: "RISKY", label: "Risky", tone: "caution" };
  }
  return { key: "HIGH_RISK", label: "High Risk", tone: "negative" };
}
