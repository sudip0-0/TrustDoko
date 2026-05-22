import type { FilePurpose } from "@prisma/client";

import { isAdmin } from "@/lib/permissions/admin";
import { prisma } from "@/lib/db";
import type { SessionUser } from "@/types/auth";

const PROOF_PURPOSES: FilePurpose[] = [
  "REVIEW_PROOF",
  "COMPLAINT_PROOF",
  "BUSINESS_DOCUMENT",
];

export async function canAccessProofAssetById(
  user: SessionUser | null,
  fileAssetId: string,
): Promise<boolean> {
  if (!user) {
    return false;
  }

  const asset = await prisma.fileAsset.findUnique({
    where: { id: fileAssetId },
    select: {
      ownerUserId: true,
      visibility: true,
      purpose: true,
      reviewProof: { select: { userId: true } },
      complaintProof: { select: { userId: true } },
    },
  });

  if (!asset || asset.visibility !== "PRIVATE") {
    return false;
  }

  if (!PROOF_PURPOSES.includes(asset.purpose)) {
    return false;
  }

  if (isAdmin(user)) {
    return true;
  }

  if (asset.ownerUserId !== user.id) {
    return false;
  }

  if (asset.reviewProof?.userId === user.id) {
    return true;
  }

  if (asset.complaintProof?.userId === user.id) {
    return true;
  }

  return false;
}
