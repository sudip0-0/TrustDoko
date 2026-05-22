import { cache } from "react";

import { buildComplaintSummaryFromCounts } from "@/lib/complaints/summary";
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
  claimedByUserId: string | null;
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
    underReview: number;
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

  const complaintSummary = buildComplaintSummaryFromCounts(
    complaintCounts.map((row) => ({
      status: row.status,
      count: row._count._all,
    })),
  );

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
    claimedByUserId: business.claimedByUserId,
    verificationStatus: business.verificationStatus,
    trustScore: business.trustScore,
    averageRating: business.averageRating,
    reviewCount: business.reviewCount,
    complaintCount: complaintSummary.total,
    category: business.category,
    complaintSummary,
  };
}

/** Dedupes metadata + page fetches within the same request. */
export const getBusinessProfile = cache(fetchBusinessProfile);
