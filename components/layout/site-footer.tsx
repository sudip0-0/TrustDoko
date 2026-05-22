import Link from "next/link";

import { copy } from "@/lib/copy/messages";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-foreground text-base font-semibold">
              TrustDoko
            </p>
            <p className="text-muted mt-2 max-w-sm text-sm leading-relaxed">
              {copy.trust.beforeYouPay} {copy.brand.nepal}
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
            aria-label="Footer"
          >
            <Link href="/businesses" className="text-muted no-underline hover:text-foreground">
              Browse businesses
            </Link>
            <Link href="/about" className="text-muted no-underline hover:text-foreground">
              How trust scores work
            </Link>
            <Link href="/login" className="text-muted no-underline hover:text-foreground">
              Sign in
            </Link>
          </nav>
        </div>
        <p className="text-muted mt-8 border-t border-border pt-6 text-center text-xs sm:text-left">
          © {new Date().getFullYear()} TrustDoko · Reviews · Complaints · Trust signals
        </p>
      </div>
    </footer>
  );
}
