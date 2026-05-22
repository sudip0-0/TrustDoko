import { ClaimStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  canReplyToComplaint,
  canViewBusinessComplaints,
  canViewComplaint,
  isComplaintSubmitter,
} from "../complaint";
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

const complaint = { userId: "user-2", businessId: "biz-1" };

describe("isComplaintSubmitter", () => {
  it("identifies the submitter", () => {
    expect(isComplaintSubmitter(other, "user-2")).toBe(true);
    expect(isComplaintSubmitter(owner, "user-2")).toBe(false);
  });
});

describe("canViewComplaint", () => {
  it("allows submitter, owner, and admin", () => {
    expect(canViewComplaint(other, complaint, claimedBusiness)).toBe(true);
    expect(canViewComplaint(owner, complaint, claimedBusiness)).toBe(true);
    expect(canViewComplaint(admin, complaint, claimedBusiness)).toBe(true);
  });

  it("denies unrelated users", () => {
    const stranger: SessionUser = {
      id: "stranger",
      email: "s@test.com",
      name: "S",
      role: "USER",
    };
    expect(canViewComplaint(stranger, complaint, claimedBusiness)).toBe(false);
  });
});

describe("canViewBusinessComplaints", () => {
  it("allows claimed owner and admin", () => {
    expect(canViewBusinessComplaints(owner, claimedBusiness)).toBe(true);
    expect(canViewBusinessComplaints(admin, claimedBusiness)).toBe(true);
  });

  it("denies unrelated user", () => {
    expect(canViewBusinessComplaints(other, claimedBusiness)).toBe(false);
  });
});

describe("canReplyToComplaint", () => {
  it("allows only claimed business owner", () => {
    expect(canReplyToComplaint(owner, claimedBusiness)).toBe(true);
  });

  it("denies admin from posting owner responses", () => {
    expect(canReplyToComplaint(admin, claimedBusiness)).toBe(false);
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
