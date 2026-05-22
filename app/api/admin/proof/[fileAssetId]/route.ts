import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/permissions/admin";
import { canAccessProofFile } from "@/lib/storage/permissions";
import { getPrivateProofUrl } from "@/lib/storage/signed-url";
import { isStorageConfigured } from "@/lib/storage/config";
import { prisma } from "@/lib/db";

type RouteContext = {
  params: Promise<{ fileAssetId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const { fileAssetId } = await context.params;

  const fileAsset = await prisma.fileAsset.findUnique({
    where: { id: fileAssetId },
    select: {
      id: true,
      ownerUserId: true,
      visibility: true,
      storageKey: true,
      mimeType: true,
    },
  });

  if (!fileAsset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!canAccessProofFile(user, fileAsset)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const signedUrl = getPrivateProofUrl(fileAsset.storageKey, fileAsset.mimeType);
  return NextResponse.redirect(signedUrl, 302);
}
