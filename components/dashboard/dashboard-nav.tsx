"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isAdmin } from "@/lib/permissions/admin";
import type { SessionUser } from "@/types/auth";

type DashboardNavProps = {
  user: SessionUser;
};

const links = [
  { href: "/dashboard/user", label: "Your activity", prefix: "/dashboard/user" },
  {
    href: "/dashboard/business",
    label: "My businesses",
    prefix: "/dashboard/business",
  },
  { href: "/dashboard/admin", label: "Admin", prefix: "/dashboard/admin" },
] as const;

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="mb-8 flex flex-wrap gap-4 border-b border-border pb-4 text-sm"
      aria-label="Dashboard areas"
    >
      {links.map((link) => {
        if (link.prefix === "/dashboard/admin" && !isAdmin(user)) {
          return null;
        }
        const active = pathname.startsWith(link.prefix);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "text-foreground font-semibold no-underline"
                : "text-muted font-medium no-underline hover:text-primary"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
