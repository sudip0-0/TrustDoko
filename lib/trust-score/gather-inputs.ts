import { ComplaintSeverity, ComplaintStatus, ReviewStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

import { computeProfileCompleteness } from "./profile-completeness";
import { hasRecentNegativeTrend } from "./recent-trend";
import type { TrustScoreInput } from "./types";

const OPEN_COMPLAINT_STATUSES: ComplaintStatus[] = [
  ComplaintStatus.SUBMITTED,
  ComplaintStatus.UNDER_REVIEW,
  ComplaintStatus.UNRESOLVED,
  ComplaintStatus.BUSINESS_RESPONDED,
];

function daysSince(date: Date): number {
  const ms = Date.now() - date.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export async function gatherTrustScoreInputs(
  businessId: string,
): Promise<TrustScoreInput | null> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      averageRating: true,
      reviewCount: true,
      complaintCount: true,
      verificationStatus: true,
      claimStatus: true,
      createdAt: true,
      description: true,
      phone: true,
      email: true,
      websiteUrl: true,
      facebookUrl: true,
      instagramUrl: true,
      tiktokUrl: true,
      address: true,
      city: true,
      province: true,
    },
  });

  if (!business) {
    return null;
  }

  const recentCutoff = new Date();
  recentCutoff.setDate(recentCutoff.getDate() - 90);

  const [
    unresolvedComplaintCount,
    complaintsUnderModerationCount,
    highSeverityOpenCount,
    pendingReviewCount,
    recentReviewStats,
    olderReviewStats,
    eligibleComplaints,
    reviewsWithResponse,
    complaintsWithResponse,
  ] = await Promise.all([
    prisma.complaint.count({
      where: {
        businessId,
        status: { in: OPEN_COMPLAINT_STATUSES },
      },
    }),
    prisma.complaint.count({
      where: { businessId, status: ComplaintStatus.UNDER_REVIEW },
    }),
    prisma.complaint.count({
      where: {
        businessId,
        status: { in: OPEN_COMPLAINT_STATUSES },
        severity: ComplaintSeverity.HIGH,
      },
    }),
    prisma.review.count({
      where: { businessId, status: ReviewStatus.PENDING },
    }),
    prisma.review.aggregate({
      where: {
        businessId,
        status: ReviewStatus.APPROVED,
        createdAt: { gte: recentCutoff },
      },
      _count: { _all: true },
      _avg: { rating: true },
    }),
    prisma.review.aggregate({
      where: {
        businessId,
        status: ReviewStatus.APPROVED,
        createdAt: { lt: recentCutoff },
      },
      _count: { _all: true },
      _avg: { rating: true },
    }),
    prisma.complaint.count({
      where: {
        businessId,
        status: { not: ComplaintStatus.REJECTED },
      },
    }),
    prisma.review.count({
      where: {
        businessId,
        status: ReviewStatus.APPROVED,
        businessResponse: { isNot: null },
      },
    }),
    prisma.complaint.count({
      where: {
        businessId,
        status: { not: ComplaintStatus.REJECTED },
        businessResponse: { isNot: null },
      },
    }),
  ]);

  const eligibleReviews = recentReviewStats._count._all + olderReviewStats._count._all;
  const eligibleTotal = eligibleReviews + eligibleComplaints;
  const respondedTotal = reviewsWithResponse + complaintsWithResponse;
  const responseRate = Math.min(
    1,
    Math.max(0, eligibleTotal > 0 ? respondedTotal / eligibleTotal : 0),
  );

  const recentNegativeTrend = hasRecentNegativeTrend(
    {
      count: recentReviewStats._count._all,
      averageRating: recentReviewStats._avg.rating ?? 0,
    },
    {
      count: olderReviewStats._count._all,
      averageRating: olderReviewStats._avg.rating ?? 0,
    },
  );

  return {
    averageRating: business.averageRating,
    reviewCount: business.reviewCount,
    complaintCount: business.complaintCount,
    unresolvedComplaintCount,
    complaintsUnderModerationCount,
    highSeverityOpenCount,
    verificationStatus: business.verificationStatus,
    claimStatus: business.claimStatus,
    responseRate,
    profileCompleteness: computeProfileCompleteness(business),
    recentNegativeTrend,
    pendingReviewCount,
    accountAgeDays: daysSince(business.createdAt),
  };
}
