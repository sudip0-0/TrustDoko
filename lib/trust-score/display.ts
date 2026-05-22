import { ClaimStatus } from "@prisma/client";

import {
  getTrustLabelFromResult,
  getTrustLabelFromScore,
  UNDER_REVIEW_LABEL,
  type TrustLabelDisplay,
} from "./labels";

export function isUnderReviewFromReasons(
  reasons: unknown,
): boolean {
  if (!Array.isArray(reasons)) {
    return false;
  }
  return reasons.some(
    (reason) =>
      typeof reason === "string" &&
      reason.startsWith(`${UNDER_REVIEW_LABEL.label}:`),
  );
}

export function resolveTrustLabelForBusiness(business: {
  trustScore: number;
  claimStatus: ClaimStatus;
  trustScoreReasons?: unknown;
}): TrustLabelDisplay {
  const underReview =
    business.claimStatus === ClaimStatus.PENDING ||
    isUnderReviewFromReasons(business.trustScoreReasons);

  return getTrustLabelFromResult(business.trustScore, { underReview });
}

/** Listing cards may not load reasons; claim pending still shows Under Review. */
export function resolveTrustLabelForListing(business: {
  trustScore: number;
  claimStatus: ClaimStatus;
}): TrustLabelDisplay {
  if (business.claimStatus === ClaimStatus.PENDING) {
    return UNDER_REVIEW_LABEL;
  }
  return getTrustLabelFromScore(business.trustScore);
}
