import {
  BusinessClaimMethod,
  BusinessClaimStatus,
  ClaimStatus,
  VerificationStatus,
} from "@prisma/client";

import { prisma } from "@/lib/db";

export function verificationStatusForClaimMethod(
  method: BusinessClaimMethod,
): VerificationStatus {
  switch (method) {
    case BusinessClaimMethod.DOCUMENT:
      return VerificationStatus.DOCUMENT_VERIFIED;
    case BusinessClaimMethod.SOCIAL:
      return VerificationStatus.SOCIAL_VERIFIED;
    case BusinessClaimMethod.PHONE:
    case BusinessClaimMethod.EMAIL:
    case BusinessClaimMethod.WEBSITE:
      return VerificationStatus.CONTACT_VERIFIED;
    default: {
      const _exhaustive: never = method;
      return _exhaustive;
    }
  }
}

export async function approveBusinessClaim(
  claimId: string,
  adminUserId: string,
  adminNote?: string | null,
): Promise<void> {
  const claim = await prisma.businessClaim.findUnique({
    where: { id: claimId },
    select: {
      id: true,
      businessId: true,
      userId: true,
      method: true,
      status: true,
    },
  });

  if (!claim || claim.status !== BusinessClaimStatus.PENDING) {
    throw new Error("Claim not found or not pending");
  }

  const verificationStatus = verificationStatusForClaimMethod(claim.method);

  await prisma.$transaction([
    prisma.businessClaim.update({
      where: { id: claim.id },
      data: {
        status: BusinessClaimStatus.APPROVED,
        adminNote: adminNote ?? null,
      },
    }),
    prisma.business.update({
      where: { id: claim.businessId },
      data: {
        claimStatus: ClaimStatus.CLAIMED,
        claimedByUserId: claim.userId,
        verificationStatus,
      },
    }),
    prisma.auditLog.create({
      data: {
        actorUserId: adminUserId,
        action: "CLAIM_APPROVED",
        entityType: "BusinessClaim",
        entityId: claim.id,
        metadata: {
          businessId: claim.businessId,
          userId: claim.userId,
          verificationStatus,
        },
      },
    }),
  ]);
}

export async function rejectBusinessClaim(
  claimId: string,
  adminUserId: string,
  adminNote?: string | null,
): Promise<void> {
  const claim = await prisma.businessClaim.findUnique({
    where: { id: claimId },
    select: { id: true, businessId: true, status: true },
  });

  if (!claim || claim.status !== BusinessClaimStatus.PENDING) {
    throw new Error("Claim not found or not pending");
  }

  await prisma.$transaction([
    prisma.businessClaim.update({
      where: { id: claim.id },
      data: {
        status: BusinessClaimStatus.REJECTED,
        adminNote: adminNote ?? null,
      },
    }),
    prisma.business.update({
      where: { id: claim.businessId },
      data: {
        claimStatus: ClaimStatus.UNCLAIMED,
        claimedByUserId: null,
      },
    }),
    prisma.auditLog.create({
      data: {
        actorUserId: adminUserId,
        action: "CLAIM_REJECTED",
        entityType: "BusinessClaim",
        entityId: claim.id,
        metadata: { businessId: claim.businessId },
      },
    }),
  ]);
}
