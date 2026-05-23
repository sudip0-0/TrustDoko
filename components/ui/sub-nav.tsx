"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type SubNavLink = {
  href: string;
  label: string;
  exact?: boolean;
};

type SubNavProps = {
  links: readonly SubNavLink[];
  ariaLabel: string;
  className?: string;
};

export function SubNav({ links, ariaLabel, className }: SubNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "-mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-border px-1 pb-4",
        className,
      )}
      aria-label={ariaLabel}
    >
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
              "shrink-0 rounded-lg px-3 py-2 text-sm no-underline transition-colors",
              active
                ? "bg-primary/10 text-primary font-semibold"
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
