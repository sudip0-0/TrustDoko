import Link from "next/link";

const navItems = [
  { href: "/businesses", label: "Businesses" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-foreground text-lg font-bold no-underline">
          Trust<span className="text-primary">Doko</span>
        </Link>
        <nav className="flex items-center gap-6" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted text-sm font-medium no-underline hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
