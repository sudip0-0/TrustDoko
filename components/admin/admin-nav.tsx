"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SubNav, type SubNavLink } from "@/components/ui/sub-nav";
import { cn } from "@/lib/utils";

const links: SubNavLink[] = [
  { href: "/dashboard/admin", label: "Overview", exact: true },
  { href: "/dashboard/admin/reviews", label: "Reviews" },
  { href: "/dashboard/admin/complaints", label: "Complaints" },
  { href: "/dashboard/admin/claims", label: "Claims" },
  { href: "/dashboard/admin/businesses", label: "Businesses" },
  { href: "/dashboard/admin/users", label: "Users" },
];

type AdminNavProps = {
  variant?: "tabs" | "sidebar";
};

export function AdminNav({ variant = "tabs" }: AdminNavProps) {
  const pathname = usePathname();

  if (variant === "sidebar") {
    return (
      <nav className="flex flex-col gap-0.5 px-2 pb-4" aria-label="Admin">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm no-underline transition-colors",
                active
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted font-medium hover:bg-accent hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return <SubNav links={links} ariaLabel="Admin" />;
}
