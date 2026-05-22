import { FilePurpose, FileVisibility } from "@prisma/client";

import { copy } from "@/lib/copy/messages";
import { prisma } from "@/lib/db";
import { getCloudinary } from "@/lib/storage/cloudinary";
import { isStorageConfigured } from "@/lib/storage/config";
import { proofFolderForPurpose, type ProofMimeType } from "@/lib/storage/constants";
import { deleteFileAsset } from "@/lib/storage/delete-asset";
import { validateProofFile } from "@/lib/storage/validate-file";

export type UploadProofFileInput = {
  file: File;
  ownerUserId: string;
  purpose: FilePurpose;
  businessId?: string;
};

export type UploadProofFileResult =
  | { ok: true; fileAssetId: string }
  | { ok: false; error: string };

function resourceTypeForMime(mimeType: ProofMimeType): "image" | "raw" {
  return mimeType === "application/pdf" ? "raw" : "image";
}

function privateAssetUrl(storageKey: string): string {
  return `private://${storageKey}`;
}

async function destroyCloudinaryAsset(
  publicId: string,
  mimeType: ProofMimeType,
): Promise<void> {
  try {
    const cloudinary = getCloudinary();
    await cloudinary.uploader.destroy(publicId, {
      type: "private",
      resource_type: resourceTypeForMime(mimeType),
    });
  } catch {
    /* best effort */
  }
}

export async function uploadProofFile(
  input: UploadProofFileInput,
): Promise<UploadProofFileResult> {
  if (!isStorageConfigured()) {
    return { ok: false, error: copy.forms.proofStorageUnavailable };
  }

  const buffer = Buffer.from(await input.file.arrayBuffer());

  const validation = validateProofFile({
    name: input.file.name,
    type: input.file.type,
    size: input.file.size,
    buffer,
  });

  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }

  const cloudinary = getCloudinary();
  const folder = proofFolderForPurpose(input.purpose);
  const resourceType = resourceTypeForMime(validation.mimeType);

  let uploadedPublicId: string | null = null;
  let fileAssetId: string | null = null;

  try {
    const result = await new Promise<{
      public_id: string;
      bytes: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          type: "private",
          resource_type: resourceType,
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Upload failed"));
            return;
          }
          resolve({
            public_id: uploadResult.public_id,
            bytes: uploadResult.bytes,
          });
        },
      );
      uploadStream.end(buffer);
    });

    uploadedPublicId = result.public_id;

    const fileAsset = await prisma.fileAsset.create({
      data: {
        ownerUserId: input.ownerUserId,
        businessId: input.businessId ?? null,
        url: privateAssetUrl(result.public_id),
        storageKey: result.public_id,
        mimeType: validation.mimeType,
        size: result.bytes,
        visibility: FileVisibility.PRIVATE,
        purpose: input.purpose,
      },
      select: { id: true },
    });

    fileAssetId = fileAsset.id;
    return { ok: true, fileAssetId: fileAsset.id };
  } catch {
    if (fileAssetId) {
      await deleteFileAsset(fileAssetId);
    } else if (uploadedPublicId) {
      await destroyCloudinaryAsset(uploadedPublicId, validation.mimeType);
    }
    return { ok: false, error: copy.forms.proofUploadFailed };
  }
}
