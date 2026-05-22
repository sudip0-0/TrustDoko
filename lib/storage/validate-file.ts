import { copy } from "@/lib/copy/messages";
import {
  PROOF_ALLOWED_MIME_TYPES,
  PROOF_MAX_BYTES,
  type ProofMimeType,
} from "@/lib/storage/constants";

export type ProofFileInput = {
  name: string;
  type: string;
  size: number;
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

  const mimeType = file.type as ProofMimeType;
  if (!PROOF_ALLOWED_MIME_TYPES.includes(mimeType)) {
    return { ok: false, error: copy.forms.proofInvalidType };
  }

  return { ok: true, mimeType };
}
