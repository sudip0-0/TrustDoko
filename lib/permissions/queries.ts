import { prisma } from "@/lib/db";
import type { SessionUser } from "@/types/auth";

import { canManageBusiness } from "./business";
import { canViewComplaint } from "./complaint";
import { canEditReview, isReviewOwner } from "./review";

export async function canEditReviewById(
  user: SessionUser | null | undefined,
  reviewId: string,
): Promise<boolean> {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { userId: true },
  });

  if (!review) {
    return false;
  }

  return canEditReview(user, review.userId);
}

export async function isReviewOwnerById(
  user: SessionUser | null | undefined,
  reviewId: string,
): Promise<boolean> {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { userId: true },
  });

  if (!review) {
    return false;
  }

  return isReviewOwner(user, review.userId);
}

export async function canManageBusinessById(
  user: SessionUser | null | undefined,
  businessId: string,
): Promise<boolean> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { claimedByUserId: true, claimStatus: true },
  });

  if (!business) {
    return false;
  }

  return canManageBusiness(user, business);
}

export async function canViewComplaintById(
  user: SessionUser | null | undefined,
  complaintId: string,
): Promise<boolean> {
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
    select: { userId: true, businessId: true },
  });

  if (!complaint) {
    return false;
  }

  const business = await prisma.business.findUnique({
    where: { id: complaint.businessId },
    select: { claimedByUserId: true, claimStatus: true },
  });

  if (!business) {
    return false;
  }

  return canViewComplaint(user, complaint, business);
}
