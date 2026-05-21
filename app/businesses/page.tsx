import type { Metadata } from "next";

import { BusinessCard } from "@/components/business/business-card";
import { BusinessListEmpty } from "@/components/business/business-list-empty";
import { BusinessListPagination } from "@/components/business/business-list-pagination";
import { businessListSearchSchema } from "@/lib/validations/business-list";
import { listBusinesses } from "@/server/queries/businesses";

export const metadata: Metadata = {
  title: "Browse businesses",
  description:
    "Search and browse Nepali online businesses with trust scores, reviews, and complaint history on TrustDoko.",
};

type BusinessesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BusinessesPage({
  searchParams,
}: BusinessesPageProps) {
  const rawParams = await searchParams;
  const { page } = businessListSearchSchema.parse({
    page: rawParams.page,
  });

  const result = await listBusinesses(page);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Browse businesses</h1>
        <p className="text-muted mt-3 text-sm leading-relaxed sm:text-base">
          Compare trust scores, ratings, and complaint signals before you buy from
          online sellers in Nepal.
        </p>
      </header>

      <div className="mt-8">
        {result.total === 0 ? (
          <BusinessListEmpty />
        ) : (
          <>
            <ul className="grid list-none gap-4 p-0 sm:grid-cols-2">
              {result.businesses.map((business) => (
                <li key={business.id}>
                  <BusinessCard business={business} />
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <BusinessListPagination
                page={result.page}
                totalPages={result.totalPages}
                total={result.total}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
