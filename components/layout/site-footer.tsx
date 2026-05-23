import Link from "next/link";

import { copy } from "@/lib/copy/messages";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="type-brand text-foreground">
              Trust<span className="text-primary">Doko</span>
            </p>
            <p className="type-body mt-3 max-w-xs">
              {copy.trust.beforeYouPay} {copy.brand.nepal}
            </p>
          </div>
          <nav className="flex flex-col gap-2.5" aria-label="Footer">
            <Link
              href="/businesses"
              className="type-body-strong text-muted no-underline hover:text-foreground"
            >
              Browse businesses
            </Link>
            <Link
              href="/about"
              className="type-body-strong text-muted no-underline hover:text-foreground"
            >
              How trust scores work
            </Link>
            <Link
              href="/login"
              className="type-body-strong text-muted no-underline hover:text-foreground"
            >
              Sign in
            </Link>
          </nav>
        </div>
        <p className="type-caption mt-10 border-t border-border pt-6 text-center sm:text-left">
          &copy; {new Date().getFullYear()} TrustDoko &middot; Reviews &middot; Complaints
          &middot; Trust signals
        </p>
      </div>
    </footer>
  );
}
