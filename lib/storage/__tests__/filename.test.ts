import { describe, expect, it } from "vitest";

import { basenameOnly, validateProofFilename } from "@/lib/storage/filename";

describe("validateProofFilename", () => {
  it("strips directory segments", () => {
    expect(basenameOnly("..\\..\\evil.pdf")).toBe("evil.pdf");
  });

  it("rejects double-extension executables", () => {
    const result = validateProofFilename("report.pdf.exe", "application/pdf");
    expect(result.ok).toBe(false);
  });

  it("accepts valid pdf name", () => {
    const result = validateProofFilename("receipt.pdf", "application/pdf");
    expect(result.ok).toBe(true);
  });
});
