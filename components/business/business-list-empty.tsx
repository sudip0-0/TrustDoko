import Link from "next/link";

export function BusinessListEmpty() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <h2 className="text-foreground text-lg font-semibold">No businesses yet</h2>
      <p className="text-muted mx-auto mt-2 max-w-md text-sm leading-relaxed">
        TrustDoko is building its directory of Nepali online sellers and service
        providers. Check back soon or run{" "}
        <code className="text-foreground rounded bg-accent px-1.5 py-0.5 text-xs">
          npm run db:seed
        </code>{" "}
        in local development.
      </p>
      <Link
        href="/"
        className="text-primary mt-6 inline-block text-sm font-medium no-underline hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
