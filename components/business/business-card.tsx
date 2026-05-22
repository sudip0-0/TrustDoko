import Link from "next/link";

import { TrustScoreDisplay } from "@/components/business/trust-score-display";
import { VerificationBadge } from "@/components/business/verification-badge";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { resolveTrustLabelForListing } from "@/lib/trust-score";
import type { ClaimStatus } from "@prisma/client";
import type { BusinessListItem } from "@/server/queries/businesses";

type BusinessCardProps = {
  business: BusinessListItem;
};

function formatLocation(city: string | null, province: string | null): string {
  if (city && province) {
    return `${city}, ${province}`;
  }
  return city ?? province ?? "Nepal";
}

function formatRating(averageRating: number, reviewCount: number): string {
  if (reviewCount === 0) {
    return "No reviews yet";
  }
  return `${averageRating.toFixed(1)} ★ · ${reviewCount} review${reviewCount === 1 ? "" : "s"}`;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const trustLabel = resolveTrustLabelForListing({
    trustScore: business.trustScore,
    claimStatus: business.claimStatus as ClaimStatus,
  });
  const location = formatLocation(business.city, business.province);

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-[box-shadow,border-color] hover:border-primary/30 hover:shadow-md motion-reduce:transition-none">
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="text-foreground text-lg font-semibold leading-snug">
            <Link
              href={`/businesses/${business.slug}`}
              className="no-underline hover:text-primary"
            >
              {business.name}
            </Link>
          </h2>
          {business.category ? (
            <Badge variant="default" className="shrink-0">
              {business.category.name}
            </Badge>
          ) : null}
        </div>

        <TrustScoreDisplay
          trustScore={business.trustScore}
          trustLabel={trustLabel}
          variant="compact"
        />

        <div className="flex flex-wrap items-center gap-2">
          <VerificationBadge
            claimStatus={business.claimStatus}
            verificationStatus={business.verificationStatus}
          />
          {business.complaintCount > 0 ? (
            <Badge variant="warning" aria-label={`${business.complaintCount} complaints on record`}>
              {business.complaintCount} complaint
              {business.complaintCount === 1 ? "" : "s"}
            </Badge>
          ) : null}
        </div>
      </div>

      <dl className="text-muted mt-4 flex-1 space-y-1.5 text-sm">
        <div>
          <dt className="sr-only">Location</dt>
          <dd>{location}</dd>
        </div>
        <div>
          <dt className="sr-only">Rating</dt>
          <dd>{formatRating(business.averageRating, business.reviewCount)}</dd>
        </div>
      </dl>

      <div className="mt-4 pt-2">
        <ButtonLink
          href={`/businesses/${business.slug}`}
          variant="outline"
          size="md"
          className="w-full sm:w-auto"
        >
          View profile
        </ButtonLink>
      </div>
    </article>
  );
}
