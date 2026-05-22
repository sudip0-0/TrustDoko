import { beforeEach, describe, expect, it, vi } from "vitest";

const { findFirst } = vi.hoisted(() => ({
  findFirst: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    review: {
      findFirst,
    },
  },
}));

import { isReviewRateLimited } from "@/lib/reviews/rate-limit";

describe("isReviewRateLimited", () => {
  beforeEach(() => {
    findFirst.mockReset();
  });

  it("returns true when user has a recent review", async () => {
    findFirst.mockResolvedValue({ id: "review-1" });
    await expect(isReviewRateLimited("user-1")).resolves.toBe(true);
  });

  it("returns false when user has no recent review", async () => {
    findFirst.mockResolvedValue(null);
    await expect(isReviewRateLimited("user-1")).resolves.toBe(false);
  });

  it("excludes the current review when editing", async () => {
    findFirst.mockResolvedValue(null);
    await isReviewRateLimited("user-1", "review-edit");
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: "user-1",
          id: { not: "review-edit" },
        }),
      }),
    );
  });
});
