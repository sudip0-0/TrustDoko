import { ClaimStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { isBusinessOwner } from "../business";
import { canReplyToComplaint, canViewBusinessComplaints } from "../complaint";
import { canReplyToReview } from "../review";
import type { SessionUser } from "@/types/auth";

const owner: SessionUser = {
  id: "owner-1",
  email: "owner@trustdoko.local",
  name: "Owner",
  role: "BUSINESS",
};

const otherOwner: SessionUser = {
  id: "owner-2",
  email: "other@trustdoko.local",
  name: "Other",
  role: "BUSINESS",
};

const normalUser: SessionUser = {
  id: "user-1",
  email: "user@trustdoko.local",
  name: "User",
  role: "USER",
};

const admin: SessionUser = {
  id: "admin-1",
  email: "admin@trustdoko.local",
  name: "Admin",
  role: "ADMIN",
};

const claimedBusiness = {
  claimedByUserId: "owner-1",
  claimStatus: ClaimStatus.CLAIMED,
};

const otherClaimedBusiness = {
  claimedByUserId: "owner-2",
  claimStatus: ClaimStatus.CLAIMED,
};

const unclaimedBusiness = {
  claimedByUserId: null,
  claimStatus: ClaimStatus.UNCLAIMED,
};

describe("dashboard access QA", () => {
  it("allows only the claimed owner to manage a business", () => {
    expect(isBusinessOwner(owner, claimedBusiness)).toBe(true);
    expect(isBusinessOwner(otherOwner, claimedBusiness)).toBe(false);
    expect(isBusinessOwner(normalUser, claimedBusiness)).toBe(false);
    expect(isBusinessOwner(admin, claimedBusiness)).toBe(false);
  });

  it("rejects unclaimed and pending profiles for owner tools", () => {
    expect(isBusinessOwner(owner, unclaimedBusiness)).toBe(false);
    expect(
      isBusinessOwner(owner, {
        claimedByUserId: "owner-1",
        claimStatus: ClaimStatus.PENDING,
      }),
    ).toBe(false);
  });

  it("allows owners to reply to reviews and complaints on their business only", () => {
    expect(canReplyToReview(owner, claimedBusiness)).toBe(true);
    expect(canReplyToReview(otherOwner, claimedBusiness)).toBe(false);
    expect(canReplyToComplaint(owner, claimedBusiness)).toBe(true);
    expect(canReplyToComplaint(otherOwner, claimedBusiness)).toBe(false);
    expect(canReplyToComplaint(admin, claimedBusiness)).toBe(false);
  });

  it("lets admins view owner complaint panels but not post owner replies", () => {
    expect(canViewBusinessComplaints(admin, claimedBusiness)).toBe(true);
    expect(canViewBusinessComplaints(normalUser, claimedBusiness)).toBe(false);
    expect(canViewBusinessComplaints(otherOwner, otherClaimedBusiness)).toBe(
      true,
    );
    expect(canViewBusinessComplaints(otherOwner, claimedBusiness)).toBe(false);
  });
});
