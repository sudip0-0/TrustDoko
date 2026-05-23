import type { Metadata } from "next";
import Link from "next/link";

import { TrustLabelBadge } from "@/components/business/trust-label-badge";
import { SetVerificationForm } from "@/components/admin/set-verification-form";
import { resolveTrustLabelForListing } from "@/lib/trust-score";
import type { ClaimStatus } from "@prisma/client";
import { getBusinessesForAdmin } from "@/server/queries/admin/businesses";

export const metadata: Metadata = {
  title: "Admin — Businesses",
};

export default async function AdminBusinessesPage() {
  const businesses = await getBusinessesForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="type-h3">Business management</h2>
        <p className="text-muted mt-1 text-sm">
          Browse listed businesses, trust scores, and verification tiers.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Trust</th>
              <th className="px-4 py-3 font-medium">Claim</th>
              <th className="px-4 py-3 font-medium">Reviews</th>
              <th className="px-4 py-3 font-medium">Complaints</th>
              <th className="px-4 py-3 font-medium">Verification</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((b) => {
              const trustLabel = resolveTrustLabelForListing({
                trustScore: b.trustScore,
                claimStatus: b.claimStatus as ClaimStatus,
              });
              return (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/businesses/${b.slug}`}
                      className="font-medium no-underline hover:text-primary"
                    >
                      {b.name}
                    </Link>
                    {b.city ? (
                      <p className="text-muted text-xs">{b.city}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold tabular-nums">
                      {b.trustScore}/100
                    </span>
                    <div className="mt-1">
                      <TrustLabelBadge trustLabel={trustLabel} />
                    </div>
                  </td>
                  <td className="text-muted px-4 py-3">{b.claimStatus}</td>
                  <td className="text-muted px-4 py-3">{b.reviewCount}</td>
                  <td className="text-muted px-4 py-3">{b.complaintCount}</td>
                  <td className="px-4 py-3">
                    <SetVerificationForm
                      businessId={b.id}
                      currentStatus={b.verificationStatus}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
