import Link from "next/link";

import type { BusinessProfileData } from "@/server/queries/business-profile";

type BusinessProfileActionsProps = {
  business: BusinessProfileData;
  viewerIsOwner?: boolean;
};

export function BusinessProfileActions({
  business,
  viewerIsOwner = false,
}: BusinessProfileActionsProps) {
  const canClaim =
    business.claimStatus === "UNCLAIMED" || business.claimStatus === "REJECTED";
  const isPending = business.claimStatus === "PENDING";

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 sm:flex-row sm:flex-wrap">
      <Link
        href={`/businesses/${business.slug}#write-review`}
        className="bg-primary text-primary-foreground inline-flex justify-center rounded-lg px-5 py-2.5 text-sm font-semibold no-underline hover:opacity-90"
      >
        Write a review
      </Link>
      <Link
        href={`/businesses/${business.slug}#report-issue`}
        className="inline-flex justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground no-underline hover:bg-accent"
      >
        Report an issue
      </Link>
      {canClaim ? (
        <Link
          href={`/claim/${business.slug}`}
          className="inline-flex justify-center rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary no-underline hover:bg-accent"
        >
          Claim this business
        </Link>
      ) : null}
      {isPending ? (
        <span className="inline-flex cursor-default justify-center rounded-lg border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-900">
          Claim pending review
        </span>
      ) : null}
      {viewerIsOwner ? (
        <Link
          href="/dashboard/business"
          className="inline-flex justify-center rounded-lg border border-primary bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary no-underline hover:bg-accent"
        >
          Manage my business
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
