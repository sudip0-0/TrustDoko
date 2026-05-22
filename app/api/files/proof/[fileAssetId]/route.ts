import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { canAccessProofAssetById } from "@/lib/storage/access-proof";
import { isStorageConfigured } from "@/lib/storage/config";
import { prisma } from "@/lib/db";
import { getPrivateProofUrl } from "@/lib/storage/signed-url";

type RouteContext = {
  params: Promise<{ fileAssetId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const { fileAssetId } = await context.params;

  const allowed = await canAccessProofAssetById(user, fileAssetId);
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const fileAsset = await prisma.fileAsset.findUnique({
    where: { id: fileAssetId },
    select: { storageKey: true, mimeType: true },
  });

  if (!fileAsset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const signedUrl = getPrivateProofUrl(fileAsset.storageKey, fileAsset.mimeType);
  return NextResponse.redirect(signedUrl, 302);
}
