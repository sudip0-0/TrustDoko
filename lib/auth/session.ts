import type { SessionUser } from "@/types/auth";

/**
 * Returns the current session user on the server.
 * Replace with Auth.js `auth()` when TD-0103 is implemented.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  return null;
}
