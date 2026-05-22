import Link from "next/link";

import type { BusinessProfileData } from "@/server/queries/business-profile";

type BusinessProfileActionsProps = {
  business: BusinessProfileData;
};

export function BusinessProfileActions({ business }: BusinessProfileActionsProps) {
  const isUnclaimed = business.claimStatus === "UNCLAIMED";

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 sm:flex-row sm:flex-wrap">
      <Link
        href={`/businesses/${business.slug}#write-review`}
        className="bg-primary text-primary-foreground inline-flex justify-center rounded-lg px-5 py-2.5 text-sm font-semibold no-underline hover:opacity-90"
      >
        Write a review
      </Link>
      <Link
        href={`/report/${business.slug}`}
        className="inline-flex justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground no-underline hover:bg-accent"
      >
        Report an issue
      </Link>
      {isUnclaimed ? (
        <Link
          href={`/claim/${business.slug}`}
          className="inline-flex justify-center rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary no-underline hover:bg-accent"
        >
          Claim this business
        </Link>
      ) : null}
      <Link
        href="/businesses"
        className="text-muted inline-flex justify-center px-2 py-2.5 text-sm no-underline hover:text-foreground sm:ml-auto"
      >
        ← All businesses
      </Link>
    </section>
  );
}
