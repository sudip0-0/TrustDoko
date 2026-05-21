import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { getSessionUser } from "@/lib/auth/session";

const navItems = [
  { href: "/businesses", label: "Businesses" },
  { href: "/about", label: "About" },
] as const;

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-foreground text-lg font-bold no-underline">
          Trust<span className="text-primary">Doko</span>
        </Link>
        <nav
          className="flex items-center gap-4 sm:gap-6"
          aria-label="Main"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted text-sm font-medium no-underline hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
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
              <Link
                href="/register"
                className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-sm font-semibold no-underline hover:opacity-90"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
