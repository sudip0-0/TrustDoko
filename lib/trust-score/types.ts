import type { ClaimStatus, VerificationStatus } from "@prisma/client";

import type { TrustLabelDisplay } from "./labels";

export type TrustScoreFactorKey =
  | "BASE"
  | "RATING"
  | "REVIEW_VOLUME"
  | "COMPLAINTS"
  | "VERIFICATION"
  | "RESPONSE_RATE"
  | "PROFILE_COMPLETENESS"
  | "NEGATIVE_TREND"
  | "ACCOUNT_AGE";

export type TrustScoreFactor = {
  key: TrustScoreFactorKey;
  impact: number;
  description: string;
};

export type TrustScoreInput = {
  averageRating: number;
  reviewCount: number;
  complaintCount: number;
  unresolvedComplaintCount: number;
  complaintsUnderModerationCount: number;
  highSeverityOpenCount: number;
  verificationStatus: VerificationStatus;
  claimStatus: ClaimStatus;
  responseRate: number;
  profileCompleteness: number;
  recentNegativeTrend: boolean;
  pendingReviewCount: number;
  accountAgeDays: number;
};

export type TrustScoreFlags = {
  underReview: boolean;
};

export type TrustScoreResult = {
  score: number;
  label: TrustLabelDisplay;
  reasons: string[];
  factors: TrustScoreFactor[];
  flags: TrustScoreFlags;
};
