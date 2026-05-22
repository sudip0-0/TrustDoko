import type { FilePurpose } from "@prisma/client";

import { copy } from "@/lib/copy/messages";
import { isStorageConfigured } from "@/lib/storage/config";
import { getProofFileFromFormData } from "@/lib/storage/form-data";
import { isProofUploadRateLimited } from "@/lib/storage/upload-rate-limit";
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
  const fileResult = getProofFileFromFormData(options.formData);
  if (!fileResult.ok) {
    return { ok: false, fieldErrors: { proof: [fileResult.error] } };
  }

  if (!fileResult.file) {
    return { ok: true, proofFileId: undefined };
  }

  if (!isStorageConfigured()) {
    return { ok: true, proofFileId: undefined };
  }

  if (await isProofUploadRateLimited(options.ownerUserId)) {
    return {
      ok: false,
      fieldErrors: { proof: [copy.forms.proofRateLimited] },
    };
  }

  const upload = await uploadProofFile({
    file: fileResult.file,
    ownerUserId: options.ownerUserId,
    purpose: options.purpose,
    businessId: options.businessId,
  });

  if (!upload.ok) {
    return { ok: false, fieldErrors: { proof: [upload.error] } };
  }

  return { ok: true, proofFileId: upload.fileAssetId };
}
