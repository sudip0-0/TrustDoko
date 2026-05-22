import { ClaimStatus, VerificationStatus } from "@prisma/client";

import {
  ACCOUNT_AGE_BONUS_DAYS,
  ACCOUNT_AGE_MAX_POINTS,
  COMPLAINT_MAX_PENALTY,
  NEGATIVE_TREND_MAX_PENALTY,
  PROFILE_COMPLETENESS_MAX_POINTS,
  RATING_MAX_POINTS,
  RESPONSE_RATE_MAX_POINTS,
  REVIEW_VOLUME_MAX_POINTS,
  TRUST_SCORE_BASE,
  VERIFICATION_MAX_POINTS,
} from "./constants";
import { buildTrustScoreReasons } from "./explanations";
import {
  getTrustLabelFromResult,
  UNDER_REVIEW_LABEL,
} from "./labels";
import type { TrustScoreFactor, TrustScoreInput, TrustScoreResult } from "./types";

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function clampUnit(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(1, value));
}

function verificationBonus(status: VerificationStatus): number {
  switch (status) {
    case VerificationStatus.CONTACT_VERIFIED:
      return 5;
    case VerificationStatus.DOCUMENT_VERIFIED:
      return 8;
    case VerificationStatus.SOCIAL_VERIFIED:
      return 10;
    case VerificationStatus.TRUSTED_SELLER:
      return VERIFICATION_MAX_POINTS;
    default:
      return 0;
  }
}

function verificationDescription(status: VerificationStatus): string {
  switch (status) {
    case VerificationStatus.CONTACT_VERIFIED:
      return "Contact details were verified by TrustDoko (helps score).";
    case VerificationStatus.DOCUMENT_VERIFIED:
      return "Business documents were verified by TrustDoko (helps score).";
    case VerificationStatus.SOCIAL_VERIFIED:
      return "Social presence was verified by TrustDoko (helps score).";
    case VerificationStatus.TRUSTED_SELLER:
      return "This business reached the Trusted Seller verification tier (helps score).";
    default:
      return "No verification tier is recorded yet.";
  }
}

function resolveUnderReview(input: TrustScoreInput): boolean {
  if (input.claimStatus === ClaimStatus.PENDING) {
    return true;
  }
  if (input.pendingReviewCount > 0) {
    return true;
  }
  if (
    input.unresolvedComplaintCount > 0 &&
    input.complaintsUnderModerationCount > 0
  ) {
    return true;
  }
  return false;
}

export function calculateTrustScore(input: TrustScoreInput): TrustScoreResult {
  const responseRate = clampUnit(input.responseRate);
  const profileCompleteness = clampUnit(input.profileCompleteness);
  const averageRating = Math.min(5, Math.max(0, input.averageRating));
  const reviewCount = Math.max(0, Math.floor(input.reviewCount));
  const complaintCount = Math.max(0, Math.floor(input.complaintCount));
  const unresolvedComplaintCount = Math.max(
    0,
    Math.floor(input.unresolvedComplaintCount),
  );

  const factors: TrustScoreFactor[] = [];
  let score = TRUST_SCORE_BASE;

  factors.push({
    key: "BASE",
    impact: TRUST_SCORE_BASE,
    description: `Starting from a neutral baseline of ${TRUST_SCORE_BASE} points.`,
  });

  if (reviewCount >= 1) {
    const ratingImpact = (averageRating / 5) * RATING_MAX_POINTS;
    score += ratingImpact;
    factors.push({
      key: "RATING",
      impact: ratingImpact,
      description: `Average community rating is ${averageRating.toFixed(1)} out of 5 across ${reviewCount} approved review${reviewCount === 1 ? "" : "s"} (${ratingImpact >= 0 ? "helps" : "lowers"} score).`,
    });
  } else {
    factors.push({
      key: "RATING",
      impact: 0,
      description:
        "Not enough approved reviews yet to factor rating into the score.",
    });
  }

  const volumeImpact = Math.min(REVIEW_VOLUME_MAX_POINTS, reviewCount * 2);
  if (volumeImpact > 0) {
    score += volumeImpact;
    factors.push({
      key: "REVIEW_VOLUME",
      impact: volumeImpact,
      description: `${reviewCount} approved review${reviewCount === 1 ? "" : "s"} add context from the community (helps score).`,
    });
  }

  let complaintPenalty = 0;
  if (complaintCount > 0) {
    complaintPenalty += Math.min(12, complaintCount * 3);
  }
  if (unresolvedComplaintCount > 0) {
    complaintPenalty += Math.min(10, unresolvedComplaintCount * 4);
  }
  if (input.highSeverityOpenCount > 0) {
    complaintPenalty += Math.min(8, input.highSeverityOpenCount * 4);
  }
  complaintPenalty = Math.min(COMPLAINT_MAX_PENALTY, complaintPenalty);
  if (complaintPenalty > 0) {
    score -= complaintPenalty;
    factors.push({
      key: "COMPLAINTS",
      impact: -complaintPenalty,
      description: `${complaintCount} community report${complaintCount === 1 ? "" : "s"} on file, including ${unresolvedComplaintCount} still open (lowers score).`,
    });
  } else if (complaintCount === 0) {
    factors.push({
      key: "COMPLAINTS",
      impact: 0,
      description: "No community complaints are on file for this business.",
    });
  }

  const verificationImpact = verificationBonus(input.verificationStatus);
  if (verificationImpact > 0) {
    score += verificationImpact;
  }
  factors.push({
    key: "VERIFICATION",
    impact: verificationImpact,
    description: verificationDescription(input.verificationStatus),
  });

  const responseImpact = responseRate * RESPONSE_RATE_MAX_POINTS;
  if (responseImpact > 0) {
    score += responseImpact;
    factors.push({
      key: "RESPONSE_RATE",
      impact: responseImpact,
      description: `The business responded to ${Math.round(responseRate * 100)}% of eligible reviews and complaints (helps score).`,
    });
  } else {
    factors.push({
      key: "RESPONSE_RATE",
      impact: 0,
      description:
        "No owner responses to reviews or complaints are recorded yet.",
    });
  }

  const completenessImpact =
    profileCompleteness * PROFILE_COMPLETENESS_MAX_POINTS;
  if (completenessImpact > 0) {
    score += completenessImpact;
    factors.push({
      key: "PROFILE_COMPLETENESS",
      impact: completenessImpact,
      description: `Public profile details are ${Math.round(profileCompleteness * 100)}% complete (helps score).`,
    });
  } else {
    factors.push({
      key: "PROFILE_COMPLETENESS",
      impact: 0,
      description: "Profile contact and description fields are mostly empty.",
    });
  }

  if (input.recentNegativeTrend) {
    score -= NEGATIVE_TREND_MAX_PENALTY;
    factors.push({
      key: "NEGATIVE_TREND",
      impact: -NEGATIVE_TREND_MAX_PENALTY,
      description:
        "Recent approved reviews are notably lower than earlier ones (lowers score).",
    });
  }

  if (input.accountAgeDays >= ACCOUNT_AGE_BONUS_DAYS) {
    score += ACCOUNT_AGE_MAX_POINTS;
    factors.push({
      key: "ACCOUNT_AGE",
      impact: ACCOUNT_AGE_MAX_POINTS,
      description: `Listed on TrustDoko for ${input.accountAgeDays} days (slight positive signal).`,
    });
  }

  const finalScore = clampScore(score);
  const underReview = resolveUnderReview(input);
  const flags = { underReview };
  const label = getTrustLabelFromResult(finalScore, flags);
  const reasons = buildTrustScoreReasons(factors);

  if (underReview) {
    reasons.unshift(
      `${UNDER_REVIEW_LABEL.label}: community data or moderation is still in progress, so the label may change when reviews or reports are finalized.`,
    );
  }

  return {
    score: finalScore,
    label,
    reasons,
    factors,
    flags,
  };
}
