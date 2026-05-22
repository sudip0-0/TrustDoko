export type TrustLabelKey =
  | "HIGHLY_TRUSTED"
  | "TRUSTED"
  | "MIXED"
  | "RISKY"
  | "HIGH_RISK"
  | "UNDER_REVIEW";

export type TrustLabelDisplay = {
  key: TrustLabelKey;
  label: string;
  tone: "positive" | "neutral" | "caution" | "negative";
};

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

export const UNDER_REVIEW_LABEL: TrustLabelDisplay = {
  key: "UNDER_REVIEW",
  label: "Under Review",
  tone: "neutral",
};

export function getTrustLabelFromResult(
  trustScore: number,
  flags: { underReview: boolean },
): TrustLabelDisplay {
  if (flags.underReview) {
    return UNDER_REVIEW_LABEL;
  }
  return getTrustLabelFromScore(trustScore);
}
