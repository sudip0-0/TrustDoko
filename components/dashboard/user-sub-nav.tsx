"use client";

import { SubNav } from "@/components/ui/sub-nav";

const links = [
  { href: "/dashboard/user", label: "Overview", exact: true },
  { href: "/dashboard/user/reviews", label: "My reviews" },
  { href: "/dashboard/user/complaints", label: "My complaints" },
  { href: "/dashboard/user/saved", label: "Saved" },
  { href: "/dashboard/user/settings", label: "Settings" },
] as const;

export function UserSubNav() {
  return <SubNav links={links} ariaLabel="Your dashboard" />;
}
