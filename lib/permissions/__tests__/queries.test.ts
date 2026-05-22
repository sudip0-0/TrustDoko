import { beforeEach, describe, expect, it, vi } from "vitest";

const { reviewFindUnique, businessFindUnique } = vi.hoisted(() => ({
  reviewFindUnique: vi.fn(),
  businessFindUnique: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    review: { findUnique: reviewFindUnique },
    business: { findUnique: businessFindUnique },
    complaint: { findUnique: vi.fn() },
  },
}));

import {
  canEditReviewById,
  canManageBusinessById,
} from "@/lib/permissions/queries";
import type { SessionUser } from "@/types/auth";

const owner: SessionUser = {
  id: "user-1",
  email: "owner@test.com",
  name: "Owner",
  role: "USER",
};

const other: SessionUser = {
  id: "user-2",
  email: "other@test.com",
  name: "Other",
  role: "USER",
};

describe("canEditReviewById", () => {
  beforeEach(() => {
    reviewFindUnique.mockReset();
  });

  it("returns false when review does not exist", async () => {
    reviewFindUnique.mockResolvedValue(null);
    await expect(canEditReviewById(owner, "missing")).resolves.toBe(false);
  });

  it("returns true for the review author", async () => {
    reviewFindUnique.mockResolvedValue({ userId: "user-1" });
    await expect(canEditReviewById(owner, "review-1")).resolves.toBe(true);
  });

  it("returns false for a different user", async () => {
    reviewFindUnique.mockResolvedValue({ userId: "user-1" });
    await expect(canEditReviewById(other, "review-1")).resolves.toBe(false);
  });
});

describe("canManageBusinessById", () => {
  beforeEach(() => {
    businessFindUnique.mockReset();
  });

  it("returns true for claimed owner", async () => {
    businessFindUnique.mockResolvedValue({
      claimedByUserId: "user-1",
      claimStatus: "CLAIMED",
    });
    await expect(canManageBusinessById(owner, "biz-1")).resolves.toBe(true);
  });

  it("returns false for non-owner", async () => {
    businessFindUnique.mockResolvedValue({
      claimedByUserId: "user-1",
      claimStatus: "CLAIMED",
    });
    await expect(canManageBusinessById(other, "biz-1")).resolves.toBe(false);
  });
});
