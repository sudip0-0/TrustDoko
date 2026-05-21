import type { Metadata } from "next";

import { BusinessCard } from "@/components/business/business-card";
import { BusinessListEmpty } from "@/components/business/business-list-empty";
import { BusinessListFilters } from "@/components/business/business-list-filters";
import { BusinessListPagination } from "@/components/business/business-list-pagination";
import { hasActiveBusinessFilters } from "@/lib/search/business-filters";
import { parseBusinessListFilters } from "@/lib/validations/business-list";
import {
  getBusinessFilterOptions,
  listBusinesses,
} from "@/server/queries/businesses";

export const metadata: Metadata = {
  title: "Browse businesses",
  description:
    "Search and browse Nepali online businesses with trust scores, reviews, and complaint history on TrustDoko.",
};

type BusinessesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BusinessesPage({
  searchParams,
}: BusinessesPageProps) {
  const rawParams = await searchParams;
  const filters = parseBusinessListFilters(rawParams);

  const [result, filterOptions] = await Promise.all([
    listBusinesses(filters),
    getBusinessFilterOptions(),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Browse businesses</h1>
        <p className="text-muted mt-3 text-sm leading-relaxed sm:text-base">
          Compare trust scores, ratings, and complaint signals before you buy from
          online sellers and social shops in Nepal.
        </p>
        <p className="text-muted mt-2 text-xs leading-relaxed sm:text-sm">
          Trust labels (Highly Trusted, Mixed, High Risk) summarize reputation from
          reviews and complaints — not legal findings. Search by name, city, category,
          or social links.
        </p>
      </header>

      <div className="mt-8 space-y-8">
        <BusinessListFilters filters={filters} options={filterOptions} />

        {result.total === 0 ? (
          <BusinessListEmpty filters={filters} />
        ) : (
          <>
            {hasActiveBusinessFilters(filters) ? (
              <p className="text-muted text-sm">
                {result.total} result{result.total === 1 ? "" : "s"} found
              </p>
            ) : null}

            <ul className="grid list-none gap-4 p-0 sm:grid-cols-2">
              {result.businesses.map((business) => (
                <li key={business.id}>
                  <BusinessCard business={business} />
                </li>
              ))}
            </ul>

            <BusinessListPagination
              page={result.page}
              totalPages={result.totalPages}
              total={result.total}
              filters={result.filters}
            />
          </>
        )}
      </div>
    </div>
  );
}
