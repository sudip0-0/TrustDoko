import type { FilePurpose } from "@prisma/client";

/** Maximum proof file size in bytes (5 MB). */
export const PROOF_MAX_BYTES = 5 * 1024 * 1024;

export const PROOF_MAX_FILENAME_LENGTH = 200;

/** Max FileAsset rows created per user per hour (abuse prevention). */
export const PROOF_MAX_UPLOADS_PER_WINDOW = 15;
export const PROOF_UPLOAD_WINDOW_MS = 60 * 60 * 1000;

export const DANGEROUS_PROOF_EXTENSIONS = [
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".msi",
  ".sh",
  ".bash",
  ".php",
  ".phtml",
  ".js",
  ".mjs",
  ".html",
  ".htm",
  ".svg",
  ".zip",
  ".rar",
  ".7z",
  ".gz",
] as const;

export const ALLOWED_PROOF_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".pdf",
] as const;

export const PROOF_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export type ProofMimeType = (typeof PROOF_ALLOWED_MIME_TYPES)[number];

export const PROOF_ACCEPT_ATTRIBUTE =
  "image/jpeg,image/png,image/webp,application/pdf";

/** TTL for admin signed proof URLs (seconds). */
export const PROOF_SIGNED_URL_TTL_SECONDS = 10 * 60;

const PURPOSE_FOLDER: Record<FilePurpose, string> = {
  REVIEW_PROOF: "review",
  COMPLAINT_PROOF: "complaint",
  BUSINESS_DOCUMENT: "business-document",
  BUSINESS_IMAGE: "business-image",
};

export function proofFolderForPurpose(purpose: FilePurpose): string {
  return `trustdoko/proof/${PURPOSE_FOLDER[purpose]}`;
}
