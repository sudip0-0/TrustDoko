import { auth } from "@/lib/auth/auth.config";
import type { SessionUser, UserRole } from "@/types/auth";

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name ?? null,
    role: session.user.role as UserRole,
  };
}
