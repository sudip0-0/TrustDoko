import Link from "next/link";

import { copy } from "@/lib/copy/messages";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-foreground text-lg font-bold">
              Trust<span className="text-primary">Doko</span>
            </p>
            <p className="text-muted mt-3 max-w-xs text-sm leading-relaxed">
              {copy.trust.beforeYouPay} {copy.brand.nepal}
            </p>
          </div>
          <nav
            className="flex flex-col gap-3 text-sm"
            aria-label="Footer"
          >
            <Link
              href="/businesses"
              className="text-muted no-underline transition-colors duration-300 hover:text-foreground"
            >
              Browse businesses
            </Link>
            <Link
              href="/about"
              className="text-muted no-underline transition-colors duration-300 hover:text-foreground"
            >
              How trust scores work
            </Link>
            <Link
              href="/login"
              className="text-muted no-underline transition-colors duration-300 hover:text-foreground"
            >
              Sign in
            </Link>
          </nav>
        </div>
        <p className="text-muted mt-12 border-t border-border/50 pt-8 text-center text-xs sm:text-left">
          &copy; {new Date().getFullYear()} TrustDoko &middot; Reviews &middot; Complaints &middot; Trust signals
        </p>
      </div>
    </footer>
  );
}
