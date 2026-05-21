import type { TrustLabelKey } from "./labels";

export type TrustScoreRange = {
  min: number;
  max: number;
};

export function getTrustScoreRangeForLabel(
  key: TrustLabelKey,
): TrustScoreRange {
  switch (key) {
    case "HIGHLY_TRUSTED":
      return { min: 80, max: 100 };
    case "TRUSTED":
      return { min: 65, max: 79 };
    case "MIXED":
      return { min: 45, max: 64 };
    case "RISKY":
      return { min: 25, max: 44 };
    case "HIGH_RISK":
      return { min: 0, max: 24 };
  }
}
