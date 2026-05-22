import { ReviewStatus } from "@prisma/client";

const ADMIN_REVIEW_TRANSITIONS: Record<ReviewStatus, ReviewStatus[]> = {
  [ReviewStatus.PENDING]: [
    ReviewStatus.APPROVED,
    ReviewStatus.REJECTED,
    ReviewStatus.FLAGGED,
    ReviewStatus.UNDER_REVIEW,
  ],
  [ReviewStatus.UNDER_REVIEW]: [
    ReviewStatus.APPROVED,
    ReviewStatus.REJECTED,
    ReviewStatus.FLAGGED,
  ],
  [ReviewStatus.FLAGGED]: [
    ReviewStatus.APPROVED,
    ReviewStatus.REJECTED,
    ReviewStatus.UNDER_REVIEW,
  ],
  [ReviewStatus.APPROVED]: [
    ReviewStatus.REJECTED,
    ReviewStatus.FLAGGED,
    ReviewStatus.UNDER_REVIEW,
  ],
  [ReviewStatus.REJECTED]: [
    ReviewStatus.APPROVED,
    ReviewStatus.UNDER_REVIEW,
  ],
};

export function canTransitionReviewStatus(
  from: ReviewStatus,
  to: ReviewStatus,
): boolean {
  if (from === to) {
    return true;
  }
  return ADMIN_REVIEW_TRANSITIONS[from].includes(to);
}

export const MODERATION_QUEUE_STATUSES: ReviewStatus[] = [
  ReviewStatus.PENDING,
  ReviewStatus.UNDER_REVIEW,
  ReviewStatus.FLAGGED,
];
