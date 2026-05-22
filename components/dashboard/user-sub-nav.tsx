"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard/user", label: "Overview", exact: true },
  { href: "/dashboard/user/reviews", label: "My reviews" },
  { href: "/dashboard/user/complaints", label: "My complaints" },
  { href: "/dashboard/user/saved", label: "Saved" },
  { href: "/dashboard/user/settings", label: "Settings" },
] as const;

export function UserSubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="-mx-1 mb-6 flex gap-2 overflow-x-auto border-b border-border px-1 pb-4"
      aria-label="Your dashboard"
    >
      {links.map((link) => {
        const active =
          "exact" in link && link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "bg-primary/10 text-primary shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold no-underline"
                : "text-muted shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium no-underline hover:bg-accent hover:text-foreground"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
