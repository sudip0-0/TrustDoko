import { copy } from "@/lib/copy/messages";
import {
  ALLOWED_PROOF_EXTENSIONS,
  DANGEROUS_PROOF_EXTENSIONS,
  PROOF_MAX_FILENAME_LENGTH,
  type ProofMimeType,
} from "@/lib/storage/constants";

const MIME_TO_EXTENSIONS: Record<ProofMimeType, readonly string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

export function basenameOnly(filename: string): string {
  const normalized = filename.replace(/\\/g, "/");
  const parts = normalized.split("/").filter(Boolean);
  return parts.at(-1) ?? filename;
}

export type ValidateFilenameResult =
  | { ok: true; safeName: string }
  | { ok: false; error: string };

export function validateProofFilename(
  filename: string,
  mimeType: ProofMimeType,
): ValidateFilenameResult {
  const normalized = filename.replace(/\\/g, "/");

  if (normalized.includes("..") || normalized.includes("\0")) {
    return { ok: false, error: copy.forms.proofInvalidFilename };
  }

  const safeName = basenameOnly(filename).trim();

  if (!safeName || safeName.length > PROOF_MAX_FILENAME_LENGTH) {
    return { ok: false, error: copy.forms.proofInvalidFilename };
  }

  const lower = safeName.toLowerCase();
  const ext = lower.includes(".") ? lower.slice(lower.lastIndexOf(".")) : "";

  if (!ext || !ALLOWED_PROOF_EXTENSIONS.includes(ext as (typeof ALLOWED_PROOF_EXTENSIONS)[number])) {
    return { ok: false, error: copy.forms.proofInvalidType };
  }

  if (DANGEROUS_PROOF_EXTENSIONS.some((dangerous) => lower.endsWith(dangerous))) {
    return { ok: false, error: copy.forms.proofInvalidType };
  }

  const allowedForMime = MIME_TO_EXTENSIONS[mimeType];
  if (!allowedForMime.includes(ext as (typeof allowedForMime)[number])) {
    return { ok: false, error: copy.forms.proofMimeMismatch };
  }

  return { ok: true, safeName };
}
