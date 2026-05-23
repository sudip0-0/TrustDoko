"use client";

import { SubNav } from "@/components/ui/sub-nav";

const links = [
  { href: "/dashboard/admin", label: "Overview", exact: true },
  { href: "/dashboard/admin/reviews", label: "Reviews" },
  { href: "/dashboard/admin/complaints", label: "Complaints" },
  { href: "/dashboard/admin/claims", label: "Claims" },
  { href: "/dashboard/admin/businesses", label: "Businesses" },
  { href: "/dashboard/admin/users", label: "Users" },
] as const;

export function AdminNav() {
  return <SubNav links={links} ariaLabel="Admin" />;
}
