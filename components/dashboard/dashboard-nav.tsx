import Link from "next/link";

import { isAdmin } from "@/lib/permissions/admin";
import type { SessionUser } from "@/types/auth";

type DashboardNavProps = {
  user: SessionUser;
};

export function DashboardNav({ user }: DashboardNavProps) {
  return (
    <nav className="mb-8 flex flex-wrap gap-4 border-b border-border pb-4 text-sm">
      <Link href="/dashboard/user" className="text-foreground font-medium no-underline hover:text-primary">
        Your activity
      </Link>
      <Link
        href="/dashboard/business"
        className="text-muted font-medium no-underline hover:text-primary"
      >
        My businesses
      </Link>
      {isAdmin(user) ? (
        <Link
          href="/dashboard/admin"
          className="text-muted font-medium no-underline hover:text-primary"
        >
          Admin
        </Link>
      ) : null}
    </nav>
  );
}
