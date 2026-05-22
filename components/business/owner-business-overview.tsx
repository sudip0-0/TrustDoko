import { TrustLabelBadge } from "@/components/business/trust-label-badge";
import { VerificationBadge } from "@/components/business/verification-badge";
import {
  formatClaimStatus,
  formatVerificationStatus,
} from "@/lib/business/display";
import { resolveTrustLabelForBusiness } from "@/lib/trust-score";
import type { ClaimStatus } from "@prisma/client";

type OwnerBusinessOverviewProps = {
  business: {
    name: string;
    slug: string;
    trustScore: number;
    trustScoreReasons: string[] | null;
    reviewCount: number;
    complaintCount: number;
    claimStatus: string;
    verificationStatus: string;
    claimedByUserId: string | null;
  };
};

export function OwnerBusinessOverview({ business }: OwnerBusinessOverviewProps) {
  const trustLabel = resolveTrustLabelForBusiness({
    trustScore: business.trustScore,
    claimStatus: business.claimStatus as ClaimStatus,
    trustScoreReasons: business.trustScoreReasons,
  });

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">Business overview</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Trust score" value={`${business.trustScore}/100`} />
        <Metric label="Reviews" value={String(business.reviewCount)} />
        <Metric label="Complaints" value={String(business.complaintCount)} />
        <Metric
          label="Verification"
          value={formatVerificationStatus(business.verificationStatus)}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <TrustLabelBadge trustLabel={trustLabel} />
        <VerificationBadge
          claimStatus={business.claimStatus}
          verificationStatus={business.verificationStatus}
        />
        <span className="text-muted text-xs">
          Claim: {formatClaimStatus(business.claimStatus)}
        </span>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/30 px-3 py-3">
      <p className="text-muted text-xs font-medium">{label}</p>
      <p className="text-foreground mt-1 text-lg font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}
