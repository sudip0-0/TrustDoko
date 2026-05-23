import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import type { BusinessFilterOptions } from "@/server/queries/businesses";
import type { BusinessListFilters } from "@/lib/validations/business-list";

type BusinessListFiltersProps = {
  filters: BusinessListFilters;
  options: BusinessFilterOptions;
};

function countActiveFilters(filters: BusinessListFilters): number {
  let count = 0;
  if (filters.q) count++;
  if (filters.category) count++;
  if (filters.city) count++;
  if (filters.businessType) count++;
  if (filters.verificationStatus) count++;
  if (filters.minRating !== undefined) count++;
  if (filters.trustLabel) count++;
  if (filters.sort && filters.sort !== "trust") count++;
  return count;
}

export function BusinessListFilters({
  filters,
  options,
}: BusinessListFiltersProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <Card>
      <CardContent className="py-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-foreground text-sm font-semibold">Filter directory</p>
          {activeCount > 0 ? (
            <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
              {activeCount} active
            </span>
          ) : null}
        </div>

        <form method="get" action="/businesses" className="mt-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="form-field sm:col-span-2 lg:col-span-3">
              <label htmlFor="q" className="text-foreground block text-sm font-medium">
                Search
              </label>
              <Input
                id="q"
                name="q"
                type="search"
                defaultValue={filters.q ?? ""}
                placeholder="Name, city, category, or social handle…"
              />
            </div>

            <div className="form-field">
              <label
                htmlFor="category"
                className="text-foreground block text-sm font-medium"
              >
                Category
              </label>
              <Select id="category" name="category" defaultValue={filters.category ?? ""}>
                <option value="">All categories</option>
                {options.categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="form-field">
              <label htmlFor="city" className="text-foreground block text-sm font-medium">
                City
              </label>
              <Select id="city" name="city" defaultValue={filters.city ?? ""}>
                <option value="">All cities</option>
                {options.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </div>

            <div className="form-field">
              <label
                htmlFor="businessType"
                className="text-foreground block text-sm font-medium"
              >
                Business type
              </label>
              <Select
                id="businessType"
                name="businessType"
                defaultValue={filters.businessType ?? ""}
              >
                <option value="">All types</option>
                <option value="ONLINE_ONLY">Online only</option>
                <option value="PHYSICAL">Physical</option>
                <option value="HYBRID">Hybrid</option>
              </Select>
            </div>

            <div className="form-field">
              <label
                htmlFor="verificationStatus"
                className="text-foreground block text-sm font-medium"
              >
                Verification
              </label>
              <Select
                id="verificationStatus"
                name="verificationStatus"
                defaultValue={filters.verificationStatus ?? ""}
              >
                <option value="">Any status</option>
                <option value="UNVERIFIED">Unverified</option>
                <option value="CONTACT_VERIFIED">Contact verified</option>
                <option value="DOCUMENT_VERIFIED">Document verified</option>
                <option value="SOCIAL_VERIFIED">Social verified</option>
              </Select>
            </div>

            <div className="form-field">
              <label
                htmlFor="minRating"
                className="text-foreground block text-sm font-medium"
              >
                Minimum rating
              </label>
              <Select
                id="minRating"
                name="minRating"
                defaultValue={
                  filters.minRating !== undefined ? String(filters.minRating) : ""
                }
              >
                <option value="">Any rating</option>
                <option value="4">4+ stars</option>
                <option value="3">3+ stars</option>
                <option value="2">2+ stars</option>
                <option value="1">1+ stars</option>
              </Select>
            </div>

            <div className="form-field">
              <label htmlFor="sort" className="text-foreground block text-sm font-medium">
                Sort by
              </label>
              <Select id="sort" name="sort" defaultValue={filters.sort ?? "trust"}>
                <option value="trust">Highest trust score</option>
                <option value="rating">Highest rating</option>
                <option value="reviews">Most reviewed</option>
                <option value="newest">Newest</option>
              </Select>
            </div>

            <div className="form-field">
              <label
                htmlFor="trustLabel"
                className="text-foreground block text-sm font-medium"
              >
                Trust label
              </label>
              <Select
                id="trustLabel"
                name="trustLabel"
                defaultValue={filters.trustLabel ?? ""}
              >
                <option value="">Any trust level</option>
                <option value="HIGHLY_TRUSTED">Highly Trusted</option>
                <option value="TRUSTED">Trusted</option>
                <option value="MIXED">Mixed Reputation</option>
                <option value="RISKY">Risky</option>
                <option value="HIGH_RISK">High Risk</option>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="submit">Apply filters</Button>
            <ButtonLink href="/businesses" variant="outline">
              Clear all
            </ButtonLink>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
