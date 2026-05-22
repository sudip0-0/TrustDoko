import type { SessionUser } from "@/types/auth";

import { isAdmin } from "./admin";
import {
  canManageBusiness,
  isBusinessOwner,
  type BusinessOwnershipFields,
} from "./business";

export function isComplaintSubmitter(
  user: SessionUser | null | undefined,
  complaintUserId: string,
): boolean {
  if (!user) {
    return false;
  }
  return user.id === complaintUserId;
}

export function canViewComplaint(
  user: SessionUser | null | undefined,
  complaint: { userId: string; businessId: string },
  business: BusinessOwnershipFields,
): boolean {
  if (!user) {
    return false;
  }
  if (isAdmin(user)) {
    return true;
  }
  if (isComplaintSubmitter(user, complaint.userId)) {
    return true;
  }
  return canManageBusiness(user, business);
}

/** View complaint details on the owner/admin panel (not public). */
export function canViewBusinessComplaints(
  user: SessionUser | null | undefined,
  business: BusinessOwnershipFields,
): boolean {
  return canManageBusiness(user, business);
}

/**
 * Post a BusinessResponse on a complaint — claimed owner only.
 * Admins change status via moderation actions, not owner replies.
 */
export function canReplyToComplaint(
  user: SessionUser | null | undefined,
  business: BusinessOwnershipFields,
): boolean {
  if (!user) {
    return false;
  }
  return isBusinessOwner(user, business);
}

