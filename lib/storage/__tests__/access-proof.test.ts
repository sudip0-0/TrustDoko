import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUnique } = vi.hoisted(() => ({
  findUnique: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    fileAsset: { findUnique },
  },
}));

import { canAccessProofAssetById } from "@/lib/storage/access-proof";
import type { SessionUser } from "@/types/auth";

const owner: SessionUser = {
  id: "user-1",
  email: "owner@test.com",
  name: "Owner",
  role: "USER",
};

const stranger: SessionUser = {
  id: "user-2",
  email: "other@test.com",
  name: "Other",
  role: "USER",
};

const admin: SessionUser = {
  id: "admin-1",
  email: "admin@test.com",
  name: "Admin",
  role: "ADMIN",
};

describe("canAccessProofAssetById", () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it("denies anonymous access", async () => {
    await expect(canAccessProofAssetById(null, "file-1")).resolves.toBe(false);
  });

  it("allows admin for private complaint proof", async () => {
    findUnique.mockResolvedValue({
      ownerUserId: "user-1",
      visibility: "PRIVATE",
      purpose: "COMPLAINT_PROOF",
      reviewProof: null,
      complaintProof: { userId: "user-1" },
    });
    await expect(canAccessProofAssetById(admin, "file-1")).resolves.toBe(true);
  });

  it("allows owner when linked to their complaint", async () => {
    findUnique.mockResolvedValue({
      ownerUserId: "user-1",
      visibility: "PRIVATE",
      purpose: "COMPLAINT_PROOF",
      reviewProof: null,
      complaintProof: { userId: "user-1" },
    });
    await expect(canAccessProofAssetById(owner, "file-1")).resolves.toBe(true);
  });

  it("denies stranger even if they guess file id", async () => {
    findUnique.mockResolvedValue({
      ownerUserId: "user-1",
      visibility: "PRIVATE",
      purpose: "REVIEW_PROOF",
      reviewProof: { userId: "user-1" },
      complaintProof: null,
    });
    await expect(canAccessProofAssetById(stranger, "file-1")).resolves.toBe(false);
  });

  it("denies owner without entity link (orphan asset)", async () => {
    findUnique.mockResolvedValue({
      ownerUserId: "user-1",
      visibility: "PRIVATE",
      purpose: "REVIEW_PROOF",
      reviewProof: null,
      complaintProof: null,
    });
    await expect(canAccessProofAssetById(owner, "file-1")).resolves.toBe(false);
  });
});
