import { EmptyState } from "@/components/dashboard/empty-state";
import { copy } from "@/lib/copy/messages";
import type { BusinessListFilters } from "@/lib/validations/business-list";
import { hasActiveBusinessFilters } from "@/lib/search/business-filters";

type BusinessListEmptyProps = {
  filters?: BusinessListFilters;
};

export function BusinessListEmpty({ filters }: BusinessListEmptyProps) {
  const hasFilters = filters ? hasActiveBusinessFilters(filters) : false;

  if (hasFilters) {
    return (
      <EmptyState
        title="No matching businesses"
        description="Try a different keyword, city, or category — or clear filters to see more sellers across Nepal."
        action={{ href: "/businesses", label: "Clear filters" }}
      />
    );
  }

  return (
    <EmptyState
      title="No businesses in the directory yet"
      description={copy.empty.businesses}
      action={{ href: "/", label: "Back to home" }}
    />
  );
}
