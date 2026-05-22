import { describe, expect, it } from "vitest";

import { detectMimeFromBuffer } from "@/lib/storage/file-sniff";

describe("detectMimeFromBuffer", () => {
  it("detects JPEG", () => {
    const buf = Buffer.from([0xff, 0xd8, 0xff, 0x00]);
    expect(detectMimeFromBuffer(buf)).toBe("image/jpeg");
  });

  it("detects PDF", () => {
    expect(detectMimeFromBuffer(Buffer.from("%PDF-1.0"))).toBe("application/pdf");
  });

  it("returns null for unknown content", () => {
    expect(detectMimeFromBuffer(Buffer.from("not a file"))).toBeNull();
  });
});
