import { beforeEach, describe, expect, it, vi } from "vitest";

const { count } = vi.hoisted(() => ({
  count: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    businessClaim: {
      count,
    },
  },
}));

import { isClaimRateLimited } from "@/lib/claims/rate-limit";

describe("isClaimRateLimited", () => {
  beforeEach(() => {
    count.mockReset();
  });

  it("returns true at daily limit", async () => {
    count.mockResolvedValue(3);
    await expect(isClaimRateLimited("user-1")).resolves.toBe(true);
  });

  it("returns false under limit", async () => {
    count.mockResolvedValue(1);
    await expect(isClaimRateLimited("user-1")).resolves.toBe(false);
  });
});
