import { ComplaintStatus, ReviewStatus } from "@prisma/client";
import { cache } from "react";

import { prisma } from "@/lib/db";

export type BusinessProfileData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  businessType: string;
  address: string | null;
  city: string | null;
  province: string | null;
  phone: string | null;
  email: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  claimStatus: string;
  verificationStatus: string;
  trustScore: number;
  averageRating: number;
  reviewCount: number;
  complaintCount: number;
  category: { name: string; slug: string } | null;
  complaintSummary: {
    total: number;
    unresolved: number;
    resolved: number;
  };
};

async function fetchBusinessProfile(
  slug: string,
): Promise<BusinessProfileData | null> {
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      category: { select: { name: true, slug: true } },
    },
  });

  if (!business) {
    return null;
  }

  const complaintCounts = await prisma.complaint.groupBy({
    by: ["status"],
    where: { businessId: business.id },
    _count: { _all: true },
  });

  const unresolvedStatuses = new Set<ComplaintStatus>([
    ComplaintStatus.SUBMITTED,
    ComplaintStatus.UNDER_REVIEW,
    ComplaintStatus.BUSINESS_RESPONDED,
    ComplaintStatus.UNRESOLVED,
  ]);

  let unresolved = 0;
  let resolved = 0;
  for (const row of complaintCounts) {
    const count = row._count._all;
    if (row.status === ComplaintStatus.RESOLVED) {
      resolved = count;
    } else if (unresolvedStatuses.has(row.status)) {
      unresolved += count;
    }
  }

  return {
    id: business.id,
    name: business.name,
    slug: business.slug,
    description: business.description,
    businessType: business.businessType,
    address: business.address,
    city: business.city,
    province: business.province,
    phone: business.phone,
    email: business.email,
    websiteUrl: business.websiteUrl,
    facebookUrl: business.facebookUrl,
    instagramUrl: business.instagramUrl,
    tiktokUrl: business.tiktokUrl,
    claimStatus: business.claimStatus,
    verificationStatus: business.verificationStatus,
    trustScore: business.trustScore,
    averageRating: business.averageRating,
    reviewCount: business.reviewCount,
    complaintCount: business.complaintCount,
    category: business.category,
    complaintSummary: {
      total: business.complaintCount,
      unresolved,
      resolved,
    },
  };
}

/** Dedupes metadata + page fetches within the same request. */
export const getBusinessProfile = cache(fetchBusinessProfile);
