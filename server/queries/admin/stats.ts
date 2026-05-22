import {
  BusinessClaimStatus,
  ComplaintStatus,
  ReviewStatus,
} from "@prisma/client";

import { prisma } from "@/lib/db";

export type AdminDashboardStats = {
  pendingReviews: number;
  pendingComplaints: number;
  pendingClaims: number;
  flaggedReviews: number;
  flaggedUsers: number;
  totalBusinesses: number;
  totalUsers: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
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
          in: [
            ReviewStatus.PENDING,
            ReviewStatus.UNDER_REVIEW,
            ReviewStatus.FLAGGED,
          ],
        },
      },
    }),
    prisma.complaint.count({
      where: {
        status: {
          in: [ComplaintStatus.SUBMITTED, ComplaintStatus.UNDER_REVIEW],
        },
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
