import { beforeEach, describe, expect, it, vi } from "vitest";

const { count } = vi.hoisted(() => ({
  count: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    complaint: {
      count,
    },
  },
}));

import { isComplaintRateLimited } from "@/lib/complaints/rate-limit";

describe("isComplaintRateLimited", () => {
  beforeEach(() => {
    count.mockReset();
  });

  it("returns true when user reached daily limit", async () => {
    count.mockResolvedValue(3);
    await expect(isComplaintRateLimited("user-1")).resolves.toBe(true);
  });

  it("returns false when under daily limit", async () => {
    count.mockResolvedValue(2);
    await expect(isComplaintRateLimited("user-1")).resolves.toBe(false);
  });

  it("counts complaints in the last 24 hours for the user", async () => {
    count.mockResolvedValue(0);
    await isComplaintRateLimited("user-1");
    expect(count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: "user-1",
          createdAt: expect.objectContaining({ gte: expect.any(Date) }),
        }),
      }),
    );
  });
});
