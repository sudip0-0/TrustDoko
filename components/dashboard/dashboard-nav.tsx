"use client";

import { isAdmin } from "@/lib/permissions/admin";
import type { SessionUser } from "@/types/auth";

import { SubNav, type SubNavLink } from "@/components/ui/sub-nav";

type DashboardNavProps = {
  user: SessionUser;
};

const baseLinks: SubNavLink[] = [
  { href: "/dashboard/user", label: "Your activity" },
  { href: "/dashboard/business", label: "My businesses" },
  { href: "/dashboard/admin", label: "Admin" },
];

export function DashboardNav({ user }: DashboardNavProps) {
  const links = baseLinks.filter(
    (link) => link.href !== "/dashboard/admin" || isAdmin(user),
  );

  return (
    <SubNav
      links={links}
      ariaLabel="Dashboard areas"
      className="mb-8 gap-2 sm:gap-3"
    />
  );
}
