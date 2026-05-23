import { ComplaintStatus, ReviewStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import type { BusinessListItem } from "@/server/queries/businesses";

const featuredSelect = {
  id: true,
  name: true,
  slug: true,
  city: true,
  province: true,
  averageRating: true,
  reviewCount: true,
  complaintCount: true,
  trustScore: true,
  verificationStatus: true,
  claimStatus: true,
  businessType: true,
  category: {
    select: { name: true, slug: true },
  },
} as const;

export type HomeCategoryChip = {
  name: string;
  slug: string;
};

export type HomeTrustMetrics = {
  businessCount: number;
  verifiedBusinessCount: number;
  averageTrustScore: number;
  openComplaintCount: number;
};

export type HomeComplaintSnapshot = {
  underReview: number;
  unresolved: number;
  resolved: number;
  submitted: number;
};

export type HomePageData = {
  featured: BusinessListItem[];
  categories: HomeCategoryChip[];
  metrics: HomeTrustMetrics;
  complaintSnapshot: HomeComplaintSnapshot;
};

const OPEN_COMPLAINT_STATUSES: ComplaintStatus[] = [
  ComplaintStatus.SUBMITTED,
  ComplaintStatus.UNDER_REVIEW,
  ComplaintStatus.BUSINESS_RESPONDED,
  ComplaintStatus.UNRESOLVED,
];

export async function getHomePageData(): Promise<HomePageData> {
  const [
    featuredRows,
    categories,
    businessCount,
    verifiedBusinessCount,
    trustAggregate,
    openComplaintCount,
    complaintGroups,
  ] = await Promise.all([
    prisma.business.findMany({
      take: 6,
      orderBy: [{ trustScore: "desc" }, { reviewCount: "desc" }],
      select: featuredSelect,
    }),
    prisma.category.findMany({
      take: 8,
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
    prisma.business.count(),
    prisma.business.count({
      where: {
        verificationStatus: {
          not: "UNVERIFIED",
        },
      },
    }),
    prisma.business.aggregate({
      _avg: { trustScore: true },
    }),
    prisma.complaint.count({
      where: { status: { in: OPEN_COMPLAINT_STATUSES } },
    }),
    prisma.complaint.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const complaintSnapshot: HomeComplaintSnapshot = {
    underReview: 0,
    unresolved: 0,
    resolved: 0,
    submitted: 0,
  };

  for (const row of complaintGroups) {
    const count = row._count._all;
    switch (row.status) {
      case ComplaintStatus.UNDER_REVIEW:
        complaintSnapshot.underReview += count;
        break;
      case ComplaintStatus.UNRESOLVED:
        complaintSnapshot.unresolved += count;
        break;
      case ComplaintStatus.RESOLVED:
        complaintSnapshot.resolved += count;
        break;
      case ComplaintStatus.SUBMITTED:
        complaintSnapshot.submitted += count;
        break;
      default:
        break;
    }
  }

  const featured: BusinessListItem[] = featuredRows.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    city: b.city,
    province: b.province,
    averageRating: b.averageRating,
    reviewCount: b.reviewCount,
    complaintCount: b.complaintCount,
    trustScore: b.trustScore,
    verificationStatus: b.verificationStatus,
    claimStatus: b.claimStatus,
    businessType: b.businessType,
    category: b.category,
  }));

  return {
    featured,
    categories,
    metrics: {
      businessCount,
      verifiedBusinessCount,
      averageTrustScore: Math.round(trustAggregate._avg.trustScore ?? 0),
      openComplaintCount,
    },
    complaintSnapshot,
  };
}

/** Rating histogram for approved reviews on a business profile. */
export async function getRatingDistributionForBusiness(
  businessId: string,
): Promise<Record<1 | 2 | 3 | 4 | 5, number>> {
  const rows = await prisma.review.groupBy({
    by: ["rating"],
    where: { businessId, status: ReviewStatus.APPROVED },
    _count: { _all: true },
  });

  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  for (const row of rows) {
    const rating = row.rating;
    if (rating >= 1 && rating <= 5) {
      distribution[rating as 1 | 2 | 3 | 4 | 5] = row._count._all;
    }
  }

  return distribution;
}
