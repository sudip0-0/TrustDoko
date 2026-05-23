import { RatingDistribution } from "@/components/business/rating-distribution";
import { BusinessProfileComplaints } from "@/components/business/business-profile-complaints";
import { TrustScoreExplanation } from "@/components/business/trust-score-explanation";
import type { BusinessProfileData } from "@/server/queries/business-profile";

type BusinessProfileOverviewProps = {
  business: BusinessProfileData;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export function BusinessProfileOverview({
  business,
  ratingDistribution,
}: BusinessProfileOverviewProps) {
  return (
    <section id="overview" className="scroll-mt-24 space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <RatingDistribution
          distribution={ratingDistribution}
          averageRating={business.averageRating}
          reviewCount={business.reviewCount}
        />
        <BusinessProfileComplaints business={business} />
      </div>
      <TrustScoreExplanation
        trustScore={business.trustScore}
        reasons={business.trustScoreReasons}
      />
    </section>
  );
}
