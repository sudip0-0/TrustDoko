import { requireAdminPage } from "@/lib/auth/require-admin-page";
import type { SessionUser } from "@/types/auth";

/** Ensures admin queries cannot be used outside an admin session. */
export async function requireAdminQuery(): Promise<SessionUser> {
  return requireAdminPage();
}
