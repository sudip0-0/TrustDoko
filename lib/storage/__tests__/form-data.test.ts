import { describe, expect, it } from "vitest";

import { getProofFileFromFormData } from "@/lib/storage/form-data";

describe("getProofFileFromFormData", () => {
  it("returns null when no file", () => {
    const formData = new FormData();
    const result = getProofFileFromFormData(formData);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.file).toBeNull();
    }
  });

  it("rejects multiple files", () => {
    const formData = new FormData();
    formData.append("proof", new File(["a"], "a.jpg", { type: "image/jpeg" }));
    formData.append("proof", new File(["b"], "b.jpg", { type: "image/jpeg" }));
    const result = getProofFileFromFormData(formData);
    expect(result.ok).toBe(false);
  });
});
