import type { FileAsset } from "@prisma/client";

import { isAdmin } from "@/lib/permissions/admin";
import type { SessionUser } from "@/types/auth";

type ProofFileAccess = Pick<FileAsset, "ownerUserId" | "visibility">;

export function canAccessProofFile(
  user: SessionUser | null,
  file: ProofFileAccess,
): boolean {
  if (!user) {
    return false;
  }
  if (isAdmin(user)) {
    return true;
  }
  return file.ownerUserId === user.id;
}
