import { prisma } from "@/lib/db";
import {
  PROOF_MAX_UPLOADS_PER_WINDOW,
  PROOF_UPLOAD_WINDOW_MS,
} from "@/lib/storage/constants";

export async function isProofUploadRateLimited(userId: string): Promise<boolean> {
  const since = new Date(Date.now() - PROOF_UPLOAD_WINDOW_MS);

  const count = await prisma.fileAsset.count({
    where: {
      ownerUserId: userId,
      createdAt: { gte: since },
    },
  });

  return count >= PROOF_MAX_UPLOADS_PER_WINDOW;
}
