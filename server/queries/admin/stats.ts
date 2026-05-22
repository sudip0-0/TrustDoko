import {
  BusinessClaimStatus,
  ComplaintStatus,
  ReviewStatus,
} from "@prisma/client";

import { prisma } from "@/lib/db";

import { requireAdminQuery } from "./guard";

export type AdminDashboardStats = {
  pendingReviews: number;
  pendingComplaints: number;
  pendingClaims: number;
  flaggedReviews: number;
  flaggedUsers: number;
  totalBusinesses: number;
  totalUsers: number;
};

const OPEN_COMPLAINT_STATUSES: ComplaintStatus[] = [
  ComplaintStatus.SUBMITTED,
  ComplaintStatus.UNDER_REVIEW,
  ComplaintStatus.BUSINESS_RESPONDED,
  ComplaintStatus.UNRESOLVED,
];

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  await requireAdminQuery();

  const [
    pendingReviews,
    pendingComplaints,
    pendingClaims,
    flaggedReviews,
    flaggedUsers,
    totalBusinesses,
    totalUsers,
  ] = await Promise.all([
    prisma.review.count({
      where: {
        status: {
          in: [ReviewStatus.PENDING, ReviewStatus.UNDER_REVIEW],
        },
      },
    }),
    prisma.complaint.count({
      where: {
        status: { in: OPEN_COMPLAINT_STATUSES },
      },
    }),
    prisma.businessClaim.count({
      where: { status: BusinessClaimStatus.PENDING },
    }),
    prisma.review.count({ where: { status: ReviewStatus.FLAGGED } }),
    prisma.user.count({ where: { trustLevel: "FLAGGED" } }),
    prisma.business.count(),
    prisma.user.count(),
  ]);

  return {
    pendingReviews,
    pendingComplaints,
    pendingClaims,
    flaggedReviews,
    flaggedUsers,
    totalBusinesses,
    totalUsers,
  };
}
