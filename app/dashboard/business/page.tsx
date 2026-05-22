import type { Metadata } from "next";
import Link from "next/link";

import { TrustLabelBadge } from "@/components/business/trust-label-badge";
import { VerificationBadge } from "@/components/business/verification-badge";
import { getSessionUser } from "@/lib/auth/session";
import { resolveTrustLabelForListing } from "@/lib/trust-score";
import type { ClaimStatus } from "@prisma/client";
import { getOwnedBusinesses } from "@/server/queries/business-owner";

export const metadata: Metadata = {
  title: "My businesses",
};

export default async function BusinessDashboardPage() {
  const user = await getSessionUser();
  const businesses = user ? await getOwnedBusinesses(user.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My businesses</h1>
        <p className="text-muted mt-2 text-sm">
          Manage claimed business profiles, respond to reviews, and handle
          complaints.
        </p>
      </div>

      {businesses.length === 0 ? (
        <section className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
          <p className="text-muted text-sm">
            You have not claimed any businesses yet.{" "}
            <Link href="/businesses" className="text-primary no-underline hover:underline">
              Browse businesses
            </Link>{" "}
            to submit a claim.
          </p>
        </section>
      ) : (
        <ul className="list-none space-y-4 p-0">
          {businesses.map((business) => {
            const trustLabel = resolveTrustLabelForListing({
              trustScore: business.trustScore,
              claimStatus: business.claimStatus as ClaimStatus,
            });
            return (
            <li
              key={business.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/dashboard/business/${business.id}`}
                    className="text-foreground text-lg font-semibold no-underline hover:text-primary"
                  >
                    {business.name}
                  </Link>
                  <p className="text-muted mt-1 text-sm">
                    {business.reviewCount} reviews · {business.complaintCount}{" "}
                    complaints · Trust {business.trustScore}/100
                  </p>
                  <div className="mt-2">
                    <TrustLabelBadge trustLabel={trustLabel} />
                  </div>
                </div>
                <VerificationBadge
                  claimStatus={business.claimStatus}
                  verificationStatus={business.verificationStatus}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link
                  href={`/dashboard/business/${business.id}`}
                  className="text-primary font-medium no-underline hover:underline"
                >
                  Manage
                </Link>
                <Link
                  href={`/businesses/${business.slug}`}
                  className="text-muted no-underline hover:text-foreground"
                >
                  Public profile
                </Link>
              </div>
            </li>
          );
          })}
        </ul>
      )}
    </div>
  );
}
