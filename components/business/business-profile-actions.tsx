import Link from "next/link";

import { SaveBusinessButton } from "@/components/business/save-business-button";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { BusinessProfileData } from "@/server/queries/business-profile";

type BusinessProfileActionsProps = {
  business: BusinessProfileData;
  viewerIsOwner?: boolean;
  showSave?: boolean;
  initialSaved?: boolean;
};

export function BusinessProfileActions({
  business,
  viewerIsOwner = false,
  showSave = false,
  initialSaved = false,
}: BusinessProfileActionsProps) {
  const canClaim =
    business.claimStatus === "UNCLAIMED" || business.claimStatus === "REJECTED";
  const isPending = business.claimStatus === "PENDING";

  return (
    <section
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 sm:flex-row sm:flex-wrap"
      aria-label="Actions for this business"
    >
      <ButtonLink href={`/write-review/${business.slug}`} size="md">
        Write a review
      </ButtonLink>
      <ButtonLink
        href={`/report/${business.slug}`}
        variant="secondary"
        size="md"
      >
        Report an issue
      </ButtonLink>
      {canClaim ? (
        <ButtonLink href={`/claim/${business.slug}`} variant="outline" size="md">
          Claim this business
        </ButtonLink>
      ) : null}
      {isPending ? (
        <Badge variant="warning" className="min-h-11 px-4 py-2.5">
          Claim pending review
        </Badge>
      ) : null}
      {showSave && !viewerIsOwner ? (
        <SaveBusinessButton businessId={business.id} initialSaved={initialSaved} />
      ) : null}
      {viewerIsOwner ? (
        <ButtonLink href="/dashboard/business" variant="outline" size="md">
          Manage my business
        </ButtonLink>
      ) : null}
      <Link
        href="/businesses"
        className="text-muted inline-flex min-h-11 items-center px-2 text-sm no-underline hover:text-foreground sm:ml-auto"
      >
        ← All businesses
      </Link>
    </section>
  );
}
