import { BusinessClaimStatus } from "@prisma/client";

import { claimMethodLabels } from "@/lib/claims/method-labels";
import { prisma } from "@/lib/db";
import { requireAdminQuery } from "@/server/queries/admin/guard";

export type PendingClaimRow = {
  id: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string | null;
  method: string;
  methodLabel: string;
  message: string;
  createdAt: Date;
  businessId: string;
  businessName: string;
  businessSlug: string;
  businessTrustScore: number;
  businessClaimStatus: string;
  businessTrustScoreReasons: unknown;
  userId: string;
  documentFileId: string | null;
};

export type UserClaimRow = {
  id: string;
  status: string;
  methodLabel: string;
  createdAt: Date;
  businessName: string;
  businessSlug: string;
};

export async function getPendingClaimsForAdmin(): Promise<PendingClaimRow[]> {
  await requireAdminQuery();

  const claims = await prisma.businessClaim.findMany({
    where: { status: BusinessClaimStatus.PENDING },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      ownerName: true,
      ownerEmail: true,
      ownerPhone: true,
      method: true,
      message: true,
      documentFileId: true,
      createdAt: true,
      businessId: true,
      userId: true,
      business: {
        select: {
          name: true,
          slug: true,
          trustScore: true,
          claimStatus: true,
          trustScoreReasons: true,
        },
      },
    },
  });

  return claims.map((c) => ({
    id: c.id,
    ownerName: c.ownerName,
    ownerEmail: c.ownerEmail,
    ownerPhone: c.ownerPhone,
    method: c.method,
    methodLabel: claimMethodLabels[c.method],
    message: c.message,
    createdAt: c.createdAt,
    businessId: c.businessId,
    businessName: c.business.name,
    businessSlug: c.business.slug,
    businessTrustScore: c.business.trustScore,
    businessClaimStatus: c.business.claimStatus,
    businessTrustScoreReasons: c.business.trustScoreReasons,
    userId: c.userId,
    documentFileId: c.documentFileId,
  }));
}

export async function getUserClaimRequests(
  userId: string,
): Promise<UserClaimRow[]> {
  const claims = await prisma.businessClaim.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      method: true,
      createdAt: true,
      business: { select: { name: true, slug: true } },
    },
  });

  return claims.map((c) => ({
    id: c.id,
    status: c.status,
    methodLabel: claimMethodLabels[c.method],
    createdAt: c.createdAt,
    businessName: c.business.name,
    businessSlug: c.business.slug,
  }));
}
