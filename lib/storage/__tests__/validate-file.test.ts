import { describe, expect, it } from "vitest";

import { PROOF_MAX_BYTES } from "@/lib/storage/constants";
import { validateProofFile } from "@/lib/storage/validate-file";

describe("validateProofFile", () => {
  it("accepts allowed MIME types within size limit", () => {
    const result = validateProofFile({
      name: "receipt.jpg",
      type: "image/jpeg",
      size: 1024,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.mimeType).toBe("image/jpeg");
    }
  });

  it("rejects empty files", () => {
    const result = validateProofFile({
      name: "empty.png",
      type: "image/png",
      size: 0,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects oversized files", () => {
    const result = validateProofFile({
      name: "large.pdf",
      type: "application/pdf",
      size: PROOF_MAX_BYTES + 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/5 MB/i);
    }
  });

  it("rejects disallowed MIME types", () => {
    const result = validateProofFile({
      name: "virus.exe",
      type: "application/x-msdownload",
      size: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/JPEG|PNG|WebP|PDF/i);
    }
  });
});
