import { Card, CardContent } from "@/components/ui/card";
import type { BusinessProfileData } from "@/server/queries/business-profile";

type BusinessProfileStatsProps = {
  business: BusinessProfileData;
};

export function BusinessProfileStats({ business }: BusinessProfileStatsProps) {
  const ratingText =
    business.reviewCount > 0
      ? `${business.averageRating.toFixed(1)} / 5`
      : "No ratings yet";

  return (
    <section
      className="grid gap-4 sm:grid-cols-2"
      aria-label="Reputation summary"
    >
      <Card>
        <CardContent>
          <p className="text-muted text-sm font-medium">Average rating</p>
          <p className="type-metric text-foreground mt-2 text-2xl">
            {ratingText}
          </p>
          <p className="text-muted mt-1 text-xs">
            {business.reviewCount} approved review
            {business.reviewCount === 1 ? "" : "s"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <p className="text-muted text-sm font-medium">Complaints on record</p>
          <p className="type-metric text-foreground mt-2 text-2xl">
            {business.complaintSummary.total}
          </p>
          <p className="text-muted mt-1 text-xs">
            {business.complaintSummary.unresolved} unresolved
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
