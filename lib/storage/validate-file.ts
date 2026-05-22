import { copy } from "@/lib/copy/messages";
import { detectMimeFromBuffer } from "@/lib/storage/file-sniff";
import { validateProofFilename } from "@/lib/storage/filename";
import {
  PROOF_ALLOWED_MIME_TYPES,
  PROOF_MAX_BYTES,
  type ProofMimeType,
} from "@/lib/storage/constants";

export type ProofFileInput = {
  name: string;
  type: string;
  size: number;
  buffer: Buffer;
};

export type ValidateProofFileResult =
  | { ok: true; mimeType: ProofMimeType }
  | { ok: false; error: string };

export function validateProofFile(file: ProofFileInput): ValidateProofFileResult {
  if (file.size <= 0) {
    return { ok: false, error: copy.forms.proofEmpty };
  }

  if (file.size > PROOF_MAX_BYTES) {
    return { ok: false, error: copy.forms.proofTooLarge };
  }

  const detectedMime = detectMimeFromBuffer(file.buffer);
  if (!detectedMime) {
    return { ok: false, error: copy.forms.proofInvalidType };
  }

  if (!PROOF_ALLOWED_MIME_TYPES.includes(detectedMime)) {
    return { ok: false, error: copy.forms.proofInvalidType };
  }

  const declaredMime = file.type as ProofMimeType;
  if (
    declaredMime &&
    PROOF_ALLOWED_MIME_TYPES.includes(declaredMime) &&
    declaredMime !== detectedMime
  ) {
    return { ok: false, error: copy.forms.proofMimeMismatch };
  }

  const filenameCheck = validateProofFilename(file.name, detectedMime);
  if (!filenameCheck.ok) {
    return { ok: false, error: filenameCheck.error };
  }

  return { ok: true, mimeType: detectedMime };
}
