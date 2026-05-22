import { FilePurpose, FileVisibility } from "@prisma/client";

import { copy } from "@/lib/copy/messages";
import { prisma } from "@/lib/db";
import { getCloudinary } from "@/lib/storage/cloudinary";
import { isStorageConfigured } from "@/lib/storage/config";
import { proofFolderForPurpose } from "@/lib/storage/constants";
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

export async function uploadProofFile(
  input: UploadProofFileInput,
): Promise<UploadProofFileResult> {
  if (!isStorageConfigured()) {
    return { ok: false, error: copy.forms.proofStorageUnavailable };
  }

  const validation = validateProofFile({
    name: input.file.name,
    type: input.file.type,
    size: input.file.size,
  });

  if (!validation.ok) {
    return { ok: false, error: validation.error };
  }

  const buffer = Buffer.from(await input.file.arrayBuffer());
  const cloudinary = getCloudinary();
  const folder = proofFolderForPurpose(input.purpose);

  try {
    const result = await new Promise<{
      public_id: string;
      secure_url: string;
      bytes: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          type: "private",
          resource_type: "auto",
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Upload failed"));
            return;
          }
          resolve({
            public_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
            bytes: uploadResult.bytes,
          });
        },
      );
      uploadStream.end(buffer);
    });

    const fileAsset = await prisma.fileAsset.create({
      data: {
        ownerUserId: input.ownerUserId,
        businessId: input.businessId ?? null,
        url: result.secure_url,
        storageKey: result.public_id,
        mimeType: validation.mimeType,
        size: result.bytes,
        visibility: FileVisibility.PRIVATE,
        purpose: input.purpose,
      },
      select: { id: true },
    });

    return { ok: true, fileAssetId: fileAsset.id };
  } catch {
    return { ok: false, error: copy.forms.proofUploadFailed };
  }
}
