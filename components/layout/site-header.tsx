import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { ButtonLink } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/session";

const navItems = [
  { href: "/businesses", label: "Businesses", matchPrefix: true },
  { href: "/about", label: "About trust scores" },
];

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-foreground text-lg font-bold no-underline"
        >
          Trust<span className="text-primary">Doko</span>
        </Link>

        <div className="hidden items-center gap-5 sm:flex">
          <NavLinks items={navItems} className="flex items-center gap-5" />
          {user ? (
            <>
              <Link
                href="/dashboard/user"
                className="text-muted text-sm font-medium no-underline hover:text-foreground"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-muted text-sm font-medium no-underline hover:text-foreground"
              >
                Sign in
              </Link>
              <ButtonLink href="/register" size="sm">
                Register
              </ButtonLink>
            </>
          )}
        </div>

        <MobileNav
          items={navItems}
          isLoggedIn={Boolean(user)}
          userLinks={
            user
              ? [{ href: "/dashboard/user", label: "Dashboard" }]
              : undefined
          }
        />
      </div>
    </header>
  );
}
