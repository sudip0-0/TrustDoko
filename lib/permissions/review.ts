import type { SessionUser } from "@/types/auth";

import { isAdmin } from "./admin";

export function isReviewOwner(
  user: SessionUser | null | undefined,
  reviewUserId: string,
): boolean {
  if (!user) {
    return false;
  }
  return user.id === reviewUserId;
}

/**
 * Users may edit only their own reviews. Admins moderate via status, not by editing review body.
 */
export function canEditReview(
  user: SessionUser | null | undefined,
  reviewUserId: string,
): boolean {
  return isReviewOwner(user, reviewUserId);
}

export function canDeleteReview(
  user: SessionUser | null | undefined,
  reviewUserId: string,
): boolean {
  if (isAdmin(user)) {
    return false;
  }
  return isReviewOwner(user, reviewUserId);
}

export function canReplyToReview(
  user: SessionUser | null | undefined,
  business: {
    claimedByUserId: string | null;
    claimStatus: string;
  },
): boolean {
  if (!user) {
    return false;
  }
  if (isAdmin(user)) {
    return true;
  }
  return (
    business.claimStatus === "CLAIMED" &&
    business.claimedByUserId === user.id
  );
}
