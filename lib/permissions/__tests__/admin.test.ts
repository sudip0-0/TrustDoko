import { describe, expect, it } from "vitest";

import { isAdmin, isAuthenticated, requireAdmin, requireAuth } from "../admin";
import { PermissionError } from "../errors";
import type { SessionUser } from "@/types/auth";

const user: SessionUser = {
  id: "user-1",
  email: "user@test.com",
  name: "Test User",
  role: "USER",
};

const admin: SessionUser = {
  id: "admin-1",
  email: "admin@test.com",
  name: "Admin",
  role: "ADMIN",
};

describe("isAdmin", () => {
  it("returns true for ADMIN role", () => {
    expect(isAdmin(admin)).toBe(true);
  });

  it("returns false for USER role", () => {
    expect(isAdmin(user)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isAdmin(null)).toBe(false);
  });
});

describe("isAuthenticated", () => {
  it("narrows type when user exists", () => {
    expect(isAuthenticated(user)).toBe(true);
  });

  it("returns false for null", () => {
    expect(isAuthenticated(null)).toBe(false);
  });
});

describe("requireAuth", () => {
  it("returns user when authenticated", () => {
    expect(requireAuth(user)).toEqual(user);
  });

  it("throws when not authenticated", () => {
    expect(() => requireAuth(null)).toThrow(PermissionError);
  });
});

describe("requireAdmin", () => {
  it("returns admin user", () => {
    expect(requireAdmin(admin)).toEqual(admin);
  });

  it("throws for non-admin", () => {
    expect(() => requireAdmin(user)).toThrow(PermissionError);
  });

  it("throws when not authenticated", () => {
    expect(() => requireAdmin(null)).toThrow(PermissionError);
  });
});
