"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

type MobileNavProps = {
  items: NavItem[];
  userLinks?: NavItem[] | undefined;
  showAuth?: boolean;
  isLoggedIn?: boolean;
};

export function MobileNav({
  items,
  userLinks = [],
  showAuth = true,
  isLoggedIn = false,
}: MobileNavProps) {
  const pathname = usePathname();

  return (
    <details className="relative sm:hidden">
      <summary className="text-foreground list-none cursor-pointer rounded-lg border border-border px-3 py-2 text-sm font-medium [&::-webkit-details-marker]:hidden">
        Menu
      </summary>
      <nav
        className="absolute right-0 z-50 mt-2 min-w-[12rem] rounded-xl border border-border bg-card p-2 shadow-lg"
        aria-label="Mobile"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className="text-foreground block rounded-lg px-3 py-2 text-sm font-medium no-underline hover:bg-accent"
          >
            {item.label}
          </Link>
        ))}
        {userLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname.startsWith(item.href) ? "page" : undefined}
            className="text-foreground block rounded-lg px-3 py-2 text-sm font-medium no-underline hover:bg-accent"
          >
            {item.label}
          </Link>
        ))}
        {showAuth && !isLoggedIn ? (
          <>
            <Link
              href="/login"
              className="text-foreground block rounded-lg px-3 py-2 text-sm font-medium no-underline hover:bg-accent"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-primary text-primary-foreground mt-1 block rounded-lg px-3 py-2 text-center text-sm font-semibold no-underline"
            >
              Register
            </Link>
          </>
        ) : null}
      </nav>
    </details>
  );
}
