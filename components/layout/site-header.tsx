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
    <header className="fixed top-0 right-0 left-0 z-50 flex justify-center pt-4">
      <div className="glass-panel-strong flex h-12 w-max max-w-[calc(100vw-2rem)] items-center gap-5 rounded-full px-4 shadow-glass sm:px-5">
        <Link
          href="/"
          className="font-display text-foreground text-[15px] font-bold no-underline leading-none"
        >
          Trust<span className="text-primary">Doko</span>
        </Link>

        <div className="hidden items-center gap-5 sm:flex">
          <NavLinks
            items={navItems}
            className="flex items-center gap-5"
            linkClassName="text-muted text-xs font-medium no-underline hover:text-foreground transition-colors duration-300"
            activeClassName="text-foreground font-semibold text-xs"
          />
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {user ? (
            <>
              <Link
                href="/dashboard/user"
                className="text-muted text-xs font-medium no-underline hover:text-foreground transition-colors duration-300"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-muted text-xs font-medium no-underline hover:text-foreground transition-colors duration-300"
              >
                Sign in
              </Link>
              <ButtonLink
                href="/register"
                size="sm"
                className="min-h-8 px-3 py-1 text-[11px]"
              >
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
