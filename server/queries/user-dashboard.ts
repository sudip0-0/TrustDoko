import {
  BusinessClaimStatus,
  ComplaintStatus,
  ReviewStatus,
} from "@prisma/client";

import { prisma } from "@/lib/db";

export type UserProfileSummary = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  trustLevel: string;
  reviewCount: number;
  complaintCount: number;
  savedCount: number;
  claimCount: number;
  memberSince: Date;
};

export type DashboardNotification = {
  id: string;
  type:
    | "review_approved"
    | "business_replied"
    | "complaint_status"
    | "claim_decision";
  title: string;
  body: string;
  createdAt: Date;
  href: string | null;
};

export async function getUserProfileSummary(
  userId: string,
  requesterId: string,
): Promise<UserProfileSummary | null> {
  if (userId !== requesterId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      trustLevel: true,
      createdAt: true,
      _count: {
        select: {
          reviews: true,
          complaints: true,
          savedBusinesses: true,
          businessClaims: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    trustLevel: user.trustLevel,
    reviewCount: user._count.reviews,
    complaintCount: user._count.complaints,
    savedCount: user._count.savedBusinesses,
    claimCount: user._count.businessClaims,
    memberSince: user.createdAt,
  };
}

export async function getUserNotifications(
  userId: string,
  requesterId: string,
): Promise<DashboardNotification[]> {
  if (userId !== requesterId) {
    return [];
  }

  const [approvedReviews, reviewsWithResponse, recentComplaints, claims] =
    await Promise.all([
      prisma.review.findMany({
        where: { userId, status: ReviewStatus.APPROVED },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          updatedAt: true,
          business: { select: { name: true, slug: true } },
        },
      }),
      prisma.review.findMany({
        where: {
          userId,
          businessResponse: { isNot: null },
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          updatedAt: true,
          business: { select: { name: true, slug: true } },
          businessResponse: { select: { createdAt: true } },
        },
      }),
      prisma.complaint.findMany({
        where: {
          userId,
          status: {
            notIn: [ComplaintStatus.SUBMITTED, ComplaintStatus.REJECTED],
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          status: true,
          summary: true,
          updatedAt: true,
          business: { select: { slug: true } },
        },
      }),
      prisma.businessClaim.findMany({
        where: {
          userId,
          status: {
            in: [BusinessClaimStatus.APPROVED, BusinessClaimStatus.REJECTED],
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          status: true,
          updatedAt: true,
          business: { select: { name: true, slug: true } },
        },
      }),
    ]);

  const items: DashboardNotification[] = [];

  for (const review of approvedReviews) {
    items.push({
      id: `review-approved-${review.id}`,
      type: "review_approved",
      title: `Review published for ${review.business.name}`,
      body: review.title
        ? `"${review.title}" is now visible on the public profile.`
        : "Your review is now visible on the public profile.",
      createdAt: review.updatedAt,
      href: `/businesses/${review.business.slug}#reviews`,
    });
  }

  for (const review of reviewsWithResponse) {
    items.push({
      id: `review-response-${review.id}`,
      type: "business_replied",
      title: `${review.business.name} replied to your review`,
      body: "The business posted a public response you can read on their profile.",
      createdAt: review.businessResponse?.createdAt ?? review.updatedAt,
      href: `/businesses/${review.business.slug}#reviews`,
    });
  }

  for (const complaint of recentComplaints) {
    items.push({
      id: `complaint-${complaint.id}`,
      type: "complaint_status",
      title: `Complaint status: ${complaint.status.replace(/_/g, " ").toLowerCase()}`,
      body: complaint.summary,
      createdAt: complaint.updatedAt,
      href: `/businesses/${complaint.business.slug}#report-issue`,
    });
  }

  for (const claim of claims) {
    items.push({
      id: `claim-${claim.id}`,
      type: "claim_decision",
      title:
        claim.status === BusinessClaimStatus.APPROVED
          ? `Claim approved for ${claim.business.name}`
          : `Claim not approved for ${claim.business.name}`,
      body:
        claim.status === BusinessClaimStatus.APPROVED
          ? "You can manage this business from your business dashboard."
          : "You may submit a new claim with additional details if needed.",
      createdAt: claim.updatedAt,
      href:
        claim.status === BusinessClaimStatus.APPROVED
          ? "/dashboard/business"
          : `/businesses/${claim.business.slug}`,
    });
  }

  return items
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 12);
}
