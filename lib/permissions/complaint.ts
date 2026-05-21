import type { SessionUser } from "@/types/auth";

import { isAdmin } from "./admin";
import { canManageBusiness, type BusinessOwnershipFields } from "./business";

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
