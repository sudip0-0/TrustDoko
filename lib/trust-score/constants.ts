/** Neutral starting point before signals are applied. */
export const TRUST_SCORE_BASE = 50;

export const RATING_MAX_POINTS = 25;
export const REVIEW_VOLUME_MAX_POINTS = 10;
export const COMPLAINT_MAX_PENALTY = 25;
export const VERIFICATION_MAX_POINTS = 12;
export const RESPONSE_RATE_MAX_POINTS = 10;
export const PROFILE_COMPLETENESS_MAX_POINTS = 5;
export const NEGATIVE_TREND_MAX_PENALTY = 10;
export const ACCOUNT_AGE_MAX_POINTS = 3;

export const ACCOUNT_AGE_BONUS_DAYS = 90;

export const UNRESOLVED_COMPLAINT_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "UNRESOLVED",
  "BUSINESS_RESPONDED",
] as const;
