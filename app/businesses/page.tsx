import type { Metadata } from "next";

import { BusinessCard } from "@/components/business/business-card";
import { BusinessListEmpty } from "@/components/business/business-list-empty";
import { BusinessListFilters } from "@/components/business/business-list-filters";
import { BusinessListPagination } from "@/components/business/business-list-pagination";
import { ContentWidth } from "@/components/layout/content-width";
import { PageHeader } from "@/components/ui/page-header";
import { prisma } from "@/lib/db";
import { copy } from "@/lib/copy/messages";
import { buildMetadata } from "@/lib/seo/metadata";
import { hasActiveBusinessFilters } from "@/lib/search/business-filters";
import { parseBusinessListFilters } from "@/lib/validations/business-list";
import {
  getBusinessFilterOptions,
  listBusinesses,
} from "@/server/queries/businesses";

type BusinessesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: BusinessesPageProps): Promise<Metadata> {
  const rawParams = await searchParams;
  const categorySlug =
    typeof rawParams.category === "string" ? rawParams.category : undefined;

  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { name: true },
    });
    if (category) {
      const title = `${category.name} businesses`;
      return buildMetadata({
        title,
        description: `Browse ${category.name.toLowerCase()} sellers on TrustDoko with trust scores, reviews, and complaint history.`,
        path: `/businesses?category=${categorySlug}`,
      });
    }
  }

  return buildMetadata({
    title: "Browse businesses",
    description:
      "Search and browse Nepali online businesses with trust scores, reviews, and complaint history on TrustDoko.",
    path: "/businesses",
  });
}

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
    <ContentWidth>
      <PageHeader
        eyebrow="Directory"
        title="Browse businesses"
        description="Compare trust scores, ratings, and complaint signals before you buy from online sellers and social shops in Nepal."
      />
      <p className="text-muted -mt-4 max-w-2xl text-sm leading-relaxed">
        {copy.trust.communityReported} Search by name, city, category, or social links.
      </p>

      <div className="mt-8 space-y-8">
        <BusinessListFilters filters={filters} options={filterOptions} />

        {result.total === 0 ? (
          <BusinessListEmpty filters={filters} />
        ) : (
          <>
            {hasActiveBusinessFilters(filters) ? (
              <p className="text-muted text-sm" role="status">
                <span className="text-foreground font-semibold tabular-nums">
                  {result.total}
                </span>{" "}
                result{result.total === 1 ? "" : "s"} found
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
    </ContentWidth>
  );
}
