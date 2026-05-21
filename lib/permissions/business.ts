import { ClaimStatus } from "@prisma/client";

import type { SessionUser } from "@/types/auth";

import { isAdmin } from "./admin";

export type BusinessOwnershipFields = {
  claimedByUserId: string | null;
  claimStatus: ClaimStatus;
};

export function isBusinessOwner(
  user: SessionUser | null | undefined,
  business: BusinessOwnershipFields,
): boolean {
  if (!user) {
    return false;
  }
  return (
    business.claimStatus === ClaimStatus.CLAIMED &&
    business.claimedByUserId === user.id
  );
}

/**
 * Manage profile, respond to reviews/complaints — claimed and approved businesses only.
 */
export function canManageBusiness(
  user: SessionUser | null | undefined,
  business: BusinessOwnershipFields,
): boolean {
  if (!user) {
    return false;
  }
  if (isAdmin(user)) {
    return true;
  }
  return isBusinessOwner(user, business);
}
