import type { Metadata } from "next";

import { HomeCategoryChips } from "@/components/home/home-category-chips";
import { HomeComplaintSnapshot } from "@/components/home/home-complaint-snapshot";
import { HomeFeaturedBusinesses } from "@/components/home/home-featured-businesses";
import { HomeSearchHero } from "@/components/home/home-search-hero";
import { HomeTrustMetricsBar } from "@/components/home/home-trust-metrics";
import { buildMetadata } from "@/lib/seo/metadata";
import { getHomePageData } from "@/server/queries/home";

export const metadata: Metadata = buildMetadata({
  title: "Trust reviews for Nepali businesses",
  description:
    "Search Nepali businesses, read moderated reviews, and check complaint history before you pay online sellers.",
  path: "/",
});

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <HomeSearchHero />

      <HomeTrustMetricsBar metrics={data.metrics} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
        <HomeFeaturedBusinesses businesses={data.featured} />
        <HomeComplaintSnapshot snapshot={data.complaintSnapshot} />
      </div>

      <HomeCategoryChips categories={data.categories} />
    </div>
  );
}
