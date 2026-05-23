import Link from "next/link";

import { BusinessCard } from "@/components/business/business-card";
import type { BusinessListItem } from "@/server/queries/businesses";

type HomeFeaturedBusinessesProps = {
  businesses: BusinessListItem[];
};

export function HomeFeaturedBusinesses({ businesses }: HomeFeaturedBusinessesProps) {
  return (
    <section aria-labelledby="featured-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="featured-heading" className="type-h2">
            Featured businesses
          </h2>
          <p className="type-body mt-1">Highest trust scores from the community directory.</p>
        </div>
        <Link
          href="/businesses"
          className="text-primary text-sm font-semibold no-underline hover:underline"
        >
          View all businesses
        </Link>
      </div>

      {businesses.length === 0 ? (
        <p className="text-muted mt-6 rounded-lg border border-dashed border-border px-6 py-10 text-center text-sm">
          No businesses listed yet. Check back after the directory is seeded.
        </p>
      ) : (
        <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2">
          {businesses.map((business) => (
            <li key={business.id}>
              <BusinessCard business={business} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
