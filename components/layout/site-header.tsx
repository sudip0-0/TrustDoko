import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { ButtonLink } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/session";

const navItems = [
  { href: "/businesses", label: "Businesses", matchPrefix: true },
  { href: "/about", label: "Trust scores" },
];

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="type-brand text-foreground no-underline hover:no-underline">
          Trust<span className="text-primary">Doko</span>
        </Link>

        <div className="hidden flex-1 justify-center sm:flex">
          <Link
            href="/businesses"
            className="type-caption text-muted hover:text-foreground max-w-md flex-1 rounded-lg border border-border bg-background px-4 py-2.5 no-underline transition-colors hover:no-underline"
          >
            Search businesses in Nepal…
          </Link>
        </div>

        <div className="hidden items-center gap-5 sm:flex">
          <NavLinks
            items={navItems}
            className="flex items-center gap-5"
            linkClassName="type-body-strong text-muted no-underline hover:text-foreground hover:no-underline"
            activeClassName="type-body-strong text-foreground font-semibold no-underline"
          />
          {user ? (
            <>
              <Link
                href="/dashboard/user"
                className="type-body-strong text-muted no-underline hover:text-foreground"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="type-body-strong text-muted no-underline hover:text-foreground"
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
