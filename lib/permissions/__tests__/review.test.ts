import { describe, expect, it } from "vitest";

import {
  canDeleteReview,
  canEditReview,
  canReplyToReview,
  isReviewOwner,
} from "../review";
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

const admin: SessionUser = {
  id: "admin-1",
  email: "admin@test.com",
  name: "Admin",
  role: "ADMIN",
};

const businessOwner: SessionUser = {
  id: "biz-owner",
  email: "biz@test.com",
  name: "Biz Owner",
  role: "BUSINESS",
};

describe("isReviewOwner", () => {
  it("returns true when user id matches review author", () => {
    expect(isReviewOwner(owner, "user-1")).toBe(true);
  });

  it("returns false for different user", () => {
    expect(isReviewOwner(other, "user-1")).toBe(false);
  });
});

describe("canEditReview", () => {
  it("allows review author to edit", () => {
    expect(canEditReview(owner, "user-1")).toBe(true);
  });

  it("denies other users including admin", () => {
    expect(canEditReview(other, "user-1")).toBe(false);
    expect(canEditReview(admin, "user-1")).toBe(false);
  });
});

describe("canDeleteReview", () => {
  it("allows author to delete own review", () => {
    expect(canDeleteReview(owner, "user-1")).toBe(true);
  });

  it("denies admin from deleting reviews", () => {
    expect(canDeleteReview(admin, "user-1")).toBe(false);
  });
});

describe("canReplyToReview", () => {
  const claimedBusiness = {
    claimedByUserId: "biz-owner",
    claimStatus: "CLAIMED",
  };

  const unclaimedBusiness = {
    claimedByUserId: null,
    claimStatus: "UNCLAIMED",
  };

  it("allows claimed business owner to reply", () => {
    expect(canReplyToReview(businessOwner, claimedBusiness)).toBe(true);
  });

  it("denies non-owner on claimed business", () => {
    expect(canReplyToReview(other, claimedBusiness)).toBe(false);
  });

  it("denies owner when business is not claimed", () => {
    expect(canReplyToReview(businessOwner, unclaimedBusiness)).toBe(false);
  });

  it("allows admin to reply", () => {
    expect(canReplyToReview(admin, unclaimedBusiness)).toBe(true);
  });
});
