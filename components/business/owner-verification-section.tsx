import { VerificationBadge } from "@/components/business/verification-badge";
import { VerificationLegend } from "@/components/business/verification-legend";
import {
  formatClaimStatus,
  formatVerificationStatus,
} from "@/lib/business/display";
import { getVerificationBadgeDisplay } from "@/lib/business/verification-display";
import type { ClaimStatus, VerificationStatus } from "@prisma/client";

type OwnerVerificationSectionProps = {
  claimStatus: ClaimStatus;
  verificationStatus: VerificationStatus;
};

export function OwnerVerificationSection({
  claimStatus,
  verificationStatus,
}: OwnerVerificationSectionProps) {
  const display = getVerificationBadgeDisplay(claimStatus, verificationStatus);

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Verification status</h2>
          <p className="text-muted mt-1 text-sm">
            How TrustDoko displays trust on your public profile.
          </p>
        </div>
        <VerificationBadge
          claimStatus={claimStatus}
          verificationStatus={verificationStatus}
        />
      </div>
      <dl className="text-muted mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-foreground font-medium">Profile status</dt>
          <dd>{formatClaimStatus(claimStatus)}</dd>
        </div>
        <div>
          <dt className="text-foreground font-medium">Verification tier</dt>
          <dd>
            {display.label}
            {display.key !== "UNVERIFIED"
              ? ` (${formatVerificationStatus(verificationStatus)})`
              : ""}
          </dd>
        </div>
      </dl>
      <p className="text-muted mt-4 text-sm leading-relaxed">
        {display.description}
      </p>
      <VerificationLegend />
    </section>
  );
}
