import Link from "next/link";

import { TrustLabelBadge } from "@/components/business/trust-label-badge";
import { getTrustLabelFromScore } from "@/lib/trust-score";
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
  const trustLabel = getTrustLabelFromScore(business.trustScore);
  const location = formatLocation(business.city, business.province);

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-foreground text-lg font-semibold leading-snug">
          <Link
            href={`/businesses/${business.slug}`}
            className="no-underline hover:text-primary"
          >
            {business.name}
          </Link>
        </h2>
        <TrustLabelBadge trustLabel={trustLabel} />
      </div>

      <dl className="text-muted mt-4 space-y-1.5 text-sm">
        {business.category ? (
          <div className="flex flex-wrap gap-x-2">
            <dt className="sr-only">Category</dt>
            <dd>{business.category.name}</dd>
          </div>
        ) : null}
        <div>
          <dt className="sr-only">Location</dt>
          <dd>{location}</dd>
        </div>
        <div>
          <dt className="sr-only">Rating</dt>
          <dd>{formatRating(business.averageRating, business.reviewCount)}</dd>
        </div>
        {business.complaintCount > 0 ? (
          <div>
            <dt className="sr-only">Complaints</dt>
            <dd>
              {business.complaintCount} complaint
              {business.complaintCount === 1 ? "" : "s"} on record
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-4 pt-2">
        <Link
          href={`/businesses/${business.slug}`}
          className="text-primary text-sm font-medium no-underline hover:underline"
        >
          View profile →
        </Link>
      </div>
    </article>
  );
}
