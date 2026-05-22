import { describe, expect, it } from "vitest";

import { canAccessProofFile } from "@/lib/storage/permissions";
import type { SessionUser } from "@/types/auth";

const owner: SessionUser = {
  id: "owner-1",
  email: "owner@test.com",
  name: "Owner",
  role: "USER",
};

const stranger: SessionUser = {
  id: "stranger-1",
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

const file = { ownerUserId: "owner-1", visibility: "PRIVATE" as const };

describe("canAccessProofFile", () => {
  it("denies anonymous users", () => {
    expect(canAccessProofFile(null, file)).toBe(false);
  });

  it("allows the file owner", () => {
    expect(canAccessProofFile(owner, file)).toBe(true);
  });

  it("denies non-owner non-admin users", () => {
    expect(canAccessProofFile(stranger, file)).toBe(false);
  });

  it("allows admins regardless of ownership", () => {
    expect(canAccessProofFile(admin, file)).toBe(true);
  });
});
