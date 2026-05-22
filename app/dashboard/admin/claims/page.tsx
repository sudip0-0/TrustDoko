import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ClaimReviewActions } from "@/components/admin/claim-review-actions";
import { SetVerificationForm } from "@/components/admin/set-verification-form";
import { getSessionUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/permissions/admin";
import { prisma } from "@/lib/db";
import { TrustLabelBadge } from "@/components/business/trust-label-badge";
import { resolveTrustLabelForBusiness } from "@/lib/trust-score";
import type { ClaimStatus } from "@prisma/client";
import { getPendingClaimsForAdmin } from "@/server/queries/claims";

export const metadata: Metadata = {
  title: "Admin — Business claims",
};

export default async function AdminClaimsPage() {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    redirect("/dashboard/user");
  }

  const pendingClaims = await getPendingClaimsForAdmin();

  const claimedBusinesses = await prisma.business.findMany({
    where: { claimStatus: "CLAIMED" },
    orderBy: { name: "asc" },
      select: {
      id: true,
      name: true,
      slug: true,
      verificationStatus: true,
      trustScore: true,
      claimStatus: true,
      trustScoreReasons: true,
    },
    take: 20,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business claims</h1>
        <p className="text-muted mt-2 text-sm">
          Review pending ownership requests and adjust verification tiers.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">
          Pending claims ({pendingClaims.length})
        </h2>
        {pendingClaims.length === 0 ? (
          <p className="text-muted mt-3 text-sm">No pending claims.</p>
        ) : (
          <ul className="mt-4 list-none space-y-6 p-0">
            {pendingClaims.map((claim) => {
              const trustLabel = resolveTrustLabelForBusiness({
                trustScore: claim.businessTrustScore,
                claimStatus: claim.businessClaimStatus as ClaimStatus,
                trustScoreReasons: claim.businessTrustScoreReasons,
              });
              return (
              <li
                key={claim.id}
                className="border-b border-border pb-6 last:border-0 last:pb-0"
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
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Claimed businesses — verification</h2>
        <p className="text-muted mt-1 text-sm">
          Assign trusted seller or other verification tiers after review.
        </p>
        <ul className="mt-4 list-none space-y-3 p-0">
          {claimedBusinesses.map((b) => {
            const trustLabel = resolveTrustLabelForBusiness({
              trustScore: b.trustScore,
              claimStatus: b.claimStatus as ClaimStatus,
              trustScoreReasons: b.trustScoreReasons,
            });
            return (
            <li
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/businesses/${b.slug}`}
                  className="text-foreground font-medium no-underline hover:text-primary"
                >
                  {b.name}
                </Link>
                <span className="text-muted text-xs tabular-nums">
                  {b.trustScore}/100
                </span>
                <TrustLabelBadge trustLabel={trustLabel} />
              </div>
              <SetVerificationForm
                businessId={b.id}
                currentStatus={b.verificationStatus}
              />
            </li>
          );
          })}
        </ul>
      </section>
    </div>
  );
}
