import { ClaimStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { canReplyToComplaint } from "../complaint";
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

const claimedBusiness = {
  claimedByUserId: "biz-owner",
  claimStatus: ClaimStatus.CLAIMED,
};

describe("canReplyToComplaint", () => {
  it("allows claimed business owner", () => {
    expect(canReplyToComplaint(owner, claimedBusiness)).toBe(true);
  });

  it("allows admin", () => {
    expect(canReplyToComplaint(admin, claimedBusiness)).toBe(true);
  });

  it("denies non-owner user", () => {
    expect(canReplyToComplaint(other, claimedBusiness)).toBe(false);
  });

  it("denies owner when business is unclaimed", () => {
    expect(
      canReplyToComplaint(owner, {
        claimedByUserId: "biz-owner",
        claimStatus: ClaimStatus.UNCLAIMED,
      }),
    ).toBe(false);
  });
});
