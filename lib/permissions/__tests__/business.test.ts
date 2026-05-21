import { ClaimStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { canManageBusiness, isBusinessOwner } from "../business";
import type { SessionUser } from "@/types/auth";

const owner: SessionUser = {
  id: "biz-owner",
  email: "biz@test.com",
  name: "Biz Owner",
  role: "BUSINESS",
};

const other: SessionUser = {
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

const claimed = {
  claimedByUserId: "biz-owner",
  claimStatus: ClaimStatus.CLAIMED,
};

const pending = {
  claimedByUserId: "biz-owner",
  claimStatus: ClaimStatus.PENDING,
};

const unclaimed = {
  claimedByUserId: null,
  claimStatus: ClaimStatus.UNCLAIMED,
};

describe("isBusinessOwner", () => {
  it("returns true when user owns a CLAIMED business", () => {
    expect(isBusinessOwner(owner, claimed)).toBe(true);
  });

  it("returns false when claim is pending", () => {
    expect(isBusinessOwner(owner, pending)).toBe(false);
  });

  it("returns false for unclaimed business", () => {
    expect(isBusinessOwner(owner, unclaimed)).toBe(false);
  });

  it("returns false for wrong user", () => {
    expect(isBusinessOwner(other, claimed)).toBe(false);
  });
});

describe("canManageBusiness", () => {
  it("allows owner of claimed business", () => {
    expect(canManageBusiness(owner, claimed)).toBe(true);
  });

  it("denies owner when claim not approved", () => {
    expect(canManageBusiness(owner, pending)).toBe(false);
  });

  it("allows admin for any business state", () => {
    expect(canManageBusiness(admin, unclaimed)).toBe(true);
    expect(canManageBusiness(admin, pending)).toBe(true);
  });

  it("denies unauthenticated users", () => {
    expect(canManageBusiness(null, claimed)).toBe(false);
  });
});
