import type { FilePurpose } from "@prisma/client";

import { isStorageConfigured } from "@/lib/storage/config";
import { getProofFileFromFormData } from "@/lib/storage/form-data";
import { uploadProofFile } from "@/lib/storage/upload-proof";

type ProcessProofOptions = {
  formData: FormData;
  ownerUserId: string;
  purpose: FilePurpose;
  businessId?: string;
};

export type ProcessProofResult =
  | { ok: true; proofFileId?: string }
  | { ok: false; fieldErrors: { proof: string[] } }
  | { ok: false; error: string };

/** Upload optional proof from FormData; returns field error on failure. */
export async function processProofUploadFromFormData(
  options: ProcessProofOptions,
): Promise<ProcessProofResult> {
  const file = getProofFileFromFormData(options.formData);
  if (!file) {
    return { ok: true, proofFileId: undefined };
  }

  if (!isStorageConfigured()) {
    return { ok: true, proofFileId: undefined };
  }

  const upload = await uploadProofFile({
    file,
    ownerUserId: options.ownerUserId,
    purpose: options.purpose,
    businessId: options.businessId,
  });

  if (!upload.ok) {
    return { ok: false, fieldErrors: { proof: [upload.error] } };
  }

  return { ok: true, proofFileId: upload.fileAssetId };
}
