import type { SessionUser } from "@/types/auth";

import { PermissionError } from "./errors";

export function isAdmin(user: SessionUser | null | undefined): boolean {
  return user?.role === "ADMIN";
}

export function isAuthenticated(
  user: SessionUser | null | undefined,
): user is SessionUser {
  return user != null;
}

export function requireAuth(
  user: SessionUser | null | undefined,
): SessionUser {
  if (!user) {
    throw new PermissionError("Authentication required.");
  }
  return user;
}

export function requireAdmin(
  user: SessionUser | null | undefined,
): SessionUser {
  const authed = requireAuth(user);
  if (!isAdmin(authed)) {
    throw new PermissionError("Admin access required.");
  }
  return authed;
}
