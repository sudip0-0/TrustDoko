"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/reviews", label: "Reviews" },
  { href: "/dashboard/admin/complaints", label: "Complaints" },
  { href: "/dashboard/admin/claims", label: "Claims" },
  { href: "/dashboard/admin/businesses", label: "Businesses" },
  { href: "/dashboard/admin/users", label: "Users" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4"
      aria-label="Admin"
    >
      {links.map((link) => {
        const active =
          link.href === "/dashboard/admin"
            ? pathname === link.href
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? "rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-900 no-underline"
                : "text-muted rounded-lg px-3 py-1.5 text-sm font-medium no-underline hover:bg-muted/40 hover:text-foreground"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
