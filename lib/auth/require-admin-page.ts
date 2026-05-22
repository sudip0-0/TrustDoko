import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/permissions/admin";
import type { SessionUser } from "@/types/auth";

/** Server-side guard for admin dashboard pages. */
export async function requireAdminPage(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login?callbackUrl=/dashboard/admin");
  }
  if (!isAdmin(user)) {
    redirect("/dashboard/user");
  }
  return user;
}
