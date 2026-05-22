import { ClaimStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { isBusinessOwner } from "@/lib/permissions/business";
import type { SessionUser } from "@/types/auth";

export type OwnedBusinessListItem = {
  id: string;
  name: string;
  slug: string;
  claimStatus: string;
  verificationStatus: string;
  trustScore: number;
  reviewCount: number;
  complaintCount: number;
};

export type BusinessForOwnerEdit = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  businessType: string;
  claimStatus: string;
  verificationStatus: string;
  claimedByUserId: string | null;
};

export async function getOwnedBusinesses(
  userId: string,
): Promise<OwnedBusinessListItem[]> {
  const businesses = await prisma.business.findMany({
    where: {
      claimStatus: ClaimStatus.CLAIMED,
      claimedByUserId: userId,
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      claimStatus: true,
      verificationStatus: true,
      trustScore: true,
      reviewCount: true,
      complaintCount: true,
    },
  });

  return businesses;
}

export async function getBusinessForOwnerEdit(
  businessId: string,
  viewer: SessionUser,
): Promise<BusinessForOwnerEdit | null> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      id: true,
      name: true,
      slug: true,
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
      businessType: true,
      claimStatus: true,
      verificationStatus: true,
      claimedByUserId: true,
    },
  });

  if (!business || !isBusinessOwner(viewer, business)) {
    return null;
  }

  return business;
}
