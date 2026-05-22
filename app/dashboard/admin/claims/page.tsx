import type { Metadata } from "next";
import Link from "next/link";

import { ClaimReviewActions } from "@/components/admin/claim-review-actions";
import { TrustLabelBadge } from "@/components/business/trust-label-badge";
import { resolveTrustLabelForBusiness } from "@/lib/trust-score";
import type { ClaimStatus } from "@prisma/client";
import { getPendingClaimsForAdmin } from "@/server/queries/claims";

export const metadata: Metadata = {
  title: "Admin — Business claims",
};

export default async function AdminClaimsPage() {
  const pendingClaims = await getPendingClaimsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          Business claim queue ({pendingClaims.length})
        </h2>
        <p className="text-muted mt-1 text-sm">
          Approve or reject ownership requests. Verification tier is set on
          approval based on claim method.
        </p>
      </div>

      {pendingClaims.length === 0 ? (
        <p className="text-muted text-sm">No pending claims.</p>
      ) : (
        <ul className="list-none space-y-6 p-0">
          {pendingClaims.map((claim) => {
            const trustLabel = resolveTrustLabelForBusiness({
              trustScore: claim.businessTrustScore,
              claimStatus: claim.businessClaimStatus as ClaimStatus,
              trustScoreReasons: claim.businessTrustScoreReasons,
            });
            return (
              <li
                key={claim.id}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/businesses/${claim.businessSlug}`}
                      className="text-foreground font-semibold no-underline hover:text-primary"
                    >
                      {claim.businessName}
                    </Link>
                    <p className="text-muted mt-1 text-sm">
                      {claim.ownerName} · {claim.ownerEmail}
                      {claim.ownerPhone ? ` · ${claim.ownerPhone}` : ""}
                    </p>
                    <p className="text-muted mt-1 text-xs">
                      Method: {claim.methodLabel} · Submitted{" "}
                      {claim.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-foreground text-sm font-semibold tabular-nums">
                      {claim.businessTrustScore}/100
                    </span>
                    <TrustLabelBadge trustLabel={trustLabel} />
                  </div>
                </div>
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  {claim.message}
                </p>
                <div className="mt-4">
                  <ClaimReviewActions claimId={claim.id} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
