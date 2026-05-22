import { prisma } from "@/lib/db";
import { getCloudinary } from "@/lib/storage/cloudinary";
import { isStorageConfigured } from "@/lib/storage/config";

function resourceTypeForMime(mimeType: string): "image" | "raw" | "video" {
  if (mimeType === "application/pdf") {
    return "raw";
  }
  return "image";
}

/** Removes a file from Cloudinary (best effort) and deletes the FileAsset row. */
export async function deleteFileAsset(fileAssetId: string): Promise<void> {
  const asset = await prisma.fileAsset.findUnique({
    where: { id: fileAssetId },
    select: { id: true, storageKey: true, mimeType: true },
  });

  if (!asset) {
    return;
  }

  if (isStorageConfigured()) {
    try {
      const cloudinary = getCloudinary();
      await cloudinary.uploader.destroy(asset.storageKey, {
        type: "private",
        resource_type: resourceTypeForMime(asset.mimeType),
      });
    } catch {
      // Best-effort cleanup; DB row is still removed.
    }
  }

  await prisma.fileAsset.delete({ where: { id: asset.id } }).catch(() => {
    /* already deleted */
  });
}
