"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; matchPrefix?: boolean };

type NavLinksProps = {
  items: NavItem[];
  className?: string;
  linkClassName?: string;
  activeClassName?: string;
};

export function NavLinks({
  items,
  className,
  linkClassName = "text-muted text-sm font-medium no-underline hover:text-foreground",
  activeClassName = "text-foreground font-semibold",
}: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className={className} aria-label="Main">
      {items.map((item) => {
        const active = item.matchPrefix
          ? pathname.startsWith(item.href)
          : pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={active ? activeClassName : linkClassName}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
