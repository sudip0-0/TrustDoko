import type { ProofMimeType } from "@/lib/storage/constants";

/** Detect MIME from file magic bytes (do not trust client Content-Type). */
export function detectMimeFromBuffer(buffer: Buffer): ProofMimeType | null {
  if (buffer.length < 4) {
    return null;
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  if (buffer.toString("ascii", 0, 4) === "%PDF") {
    return "application/pdf";
  }

  return null;
}
