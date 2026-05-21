import Link from "next/link";

import type { BusinessFilterOptions } from "@/server/queries/businesses";
import type { BusinessListFilters } from "@/lib/validations/business-list";

type BusinessListFiltersProps = {
  filters: BusinessListFilters;
  options: BusinessFilterOptions;
};

const selectClassName =
  "border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30";

export function BusinessListFilters({
  filters,
  options,
}: BusinessListFiltersProps) {
  return (
    <form
      method="get"
      action="/businesses"
      className="rounded-xl border border-border bg-card p-4 sm:p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-3">
          <label htmlFor="q" className="text-foreground mb-1.5 block text-sm font-medium">
            Search
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={filters.q ?? ""}
            placeholder="Name, city, category, or social handle…"
            className={selectClassName}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="text-foreground mb-1.5 block text-sm font-medium"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={filters.category ?? ""}
            className={selectClassName}
          >
            <option value="">All categories</option>
            {options.categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className="text-foreground mb-1.5 block text-sm font-medium">
            City
          </label>
          <select
            id="city"
            name="city"
            defaultValue={filters.city ?? ""}
            className={selectClassName}
          >
            <option value="">All cities</option>
            {options.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="businessType"
            className="text-foreground mb-1.5 block text-sm font-medium"
          >
            Business type
          </label>
          <select
            id="businessType"
            name="businessType"
            defaultValue={filters.businessType ?? ""}
            className={selectClassName}
          >
            <option value="">All types</option>
            <option value="ONLINE_ONLY">Online only</option>
            <option value="PHYSICAL">Physical</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="verificationStatus"
            className="text-foreground mb-1.5 block text-sm font-medium"
          >
            Verification
          </label>
          <select
            id="verificationStatus"
            name="verificationStatus"
            defaultValue={filters.verificationStatus ?? ""}
            className={selectClassName}
          >
            <option value="">Any status</option>
            <option value="UNVERIFIED">Unverified</option>
            <option value="CONTACT_VERIFIED">Contact verified</option>
            <option value="DOCUMENT_VERIFIED">Document verified</option>
            <option value="SOCIAL_VERIFIED">Social verified</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="minRating"
            className="text-foreground mb-1.5 block text-sm font-medium"
          >
            Minimum rating
          </label>
          <select
            id="minRating"
            name="minRating"
            defaultValue={
              filters.minRating !== undefined ? String(filters.minRating) : ""
            }
            className={selectClassName}
          >
            <option value="">Any rating</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
            <option value="1">1+ stars</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort" className="text-foreground mb-1.5 block text-sm font-medium">
            Sort by
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={filters.sort ?? "trust"}
            className={selectClassName}
          >
            <option value="trust">Highest trust score</option>
            <option value="rating">Highest rating</option>
            <option value="reviews">Most reviewed</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="trustLabel"
            className="text-foreground mb-1.5 block text-sm font-medium"
          >
            Trust label
          </label>
          <select
            id="trustLabel"
            name="trustLabel"
            defaultValue={filters.trustLabel ?? ""}
            className={selectClassName}
          >
            <option value="">Any trust level</option>
            <option value="HIGHLY_TRUSTED">Highly Trusted</option>
            <option value="TRUSTED">Trusted</option>
            <option value="MIXED">Mixed Reputation</option>
            <option value="RISKY">Risky</option>
            <option value="HIGH_RISK">High Risk</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="submit"
          className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-semibold hover:opacity-90"
        >
          Apply filters
        </button>
        <Link
          href="/businesses"
          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground no-underline hover:bg-accent"
        >
          Clear all
        </Link>
      </div>
    </form>
  );
}
