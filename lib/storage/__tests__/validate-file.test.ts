import { describe, expect, it } from "vitest";

import { PROOF_MAX_BYTES } from "@/lib/storage/constants";
import { validateProofFile } from "@/lib/storage/validate-file";

const JPEG_BUFFER = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
const PNG_BUFFER = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00,
]);
const PDF_BUFFER = Buffer.from("%PDF-1.4\n");

describe("validateProofFile", () => {
  it("accepts JPEG with matching extension", () => {
    const result = validateProofFile({
      name: "receipt.jpg",
      type: "image/jpeg",
      size: JPEG_BUFFER.length,
      buffer: JPEG_BUFFER,
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
      buffer: Buffer.alloc(0),
    });
    expect(result.ok).toBe(false);
  });

  it("rejects oversized files", () => {
    const result = validateProofFile({
      name: "large.pdf",
      type: "application/pdf",
      size: PROOF_MAX_BYTES + 1,
      buffer: PDF_BUFFER,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects dangerous extensions even with image MIME", () => {
    const result = validateProofFile({
      name: "virus.exe",
      type: "image/jpeg",
      size: JPEG_BUFFER.length,
      buffer: JPEG_BUFFER,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects path traversal filenames", () => {
    const result = validateProofFile({
      name: "../../etc/passwd.pdf",
      type: "application/pdf",
      size: PDF_BUFFER.length,
      buffer: PDF_BUFFER,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects MIME spoofing (HTML declared as JPEG)", () => {
    const html = Buffer.from("<html><script>alert(1)</script></html>");
    const result = validateProofFile({
      name: "fake.jpg",
      type: "image/jpeg",
      size: html.length,
      buffer: html,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects declared MIME that does not match file content", () => {
    const result = validateProofFile({
      name: "doc.pdf",
      type: "image/png",
      size: PDF_BUFFER.length,
      buffer: PDF_BUFFER,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/does not match/i);
    }
  });

  it("accepts PDF without misleading extension", () => {
    const result = validateProofFile({
      name: "order-proof.pdf",
      type: "application/pdf",
      size: PDF_BUFFER.length,
      buffer: PDF_BUFFER,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.mimeType).toBe("application/pdf");
    }
  });

  it("rejects PNG buffer with .jpg extension", () => {
    const result = validateProofFile({
      name: "wrong.jpg",
      type: "image/png",
      size: PNG_BUFFER.length,
      buffer: PNG_BUFFER,
    });
    expect(result.ok).toBe(false);
  });
});
