import { describe, expect, it } from "vitest";

import { PermissionError } from "../errors";
import { isAdmin, requireAdmin } from "../admin";
import type { SessionUser } from "@/types/auth";

const admin: SessionUser = {
  id: "admin-1",
  email: "admin@trustdoko.local",
  name: "Admin",
  role: "ADMIN",
};

const normalUser: SessionUser = {
  id: "user-1",
  email: "user@trustdoko.local",
  name: "User",
  role: "USER",
};

const businessOwner: SessionUser = {
  id: "owner-1",
  email: "owner@trustdoko.local",
  name: "Owner",
  role: "BUSINESS",
};

describe("admin access QA", () => {
  it("allows only ADMIN role", () => {
    expect(isAdmin(admin)).toBe(true);
    expect(isAdmin(normalUser)).toBe(false);
    expect(isAdmin(businessOwner)).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });

  it("requireAdmin rejects normal users", () => {
    expect(() => requireAdmin(normalUser)).toThrow(PermissionError);
    expect(() => requireAdmin(normalUser)).toThrow(/Admin access required/);
  });

  it("requireAdmin rejects business owners", () => {
    expect(() => requireAdmin(businessOwner)).toThrow(PermissionError);
  });

  it("requireAdmin accepts admins", () => {
    expect(requireAdmin(admin)).toEqual(admin);
  });
});
