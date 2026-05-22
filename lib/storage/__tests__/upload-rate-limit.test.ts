import { beforeEach, describe, expect, it, vi } from "vitest";

const { count } = vi.hoisted(() => ({
  count: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    fileAsset: { count },
  },
}));

import { isProofUploadRateLimited } from "@/lib/storage/upload-rate-limit";

describe("isProofUploadRateLimited", () => {
  beforeEach(() => {
    count.mockReset();
  });

  it("returns true at window limit", async () => {
    count.mockResolvedValue(15);
    await expect(isProofUploadRateLimited("user-1")).resolves.toBe(true);
  });

  it("returns false under limit", async () => {
    count.mockResolvedValue(2);
    await expect(isProofUploadRateLimited("user-1")).resolves.toBe(false);
  });
});
