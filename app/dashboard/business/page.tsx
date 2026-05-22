import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
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
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          My businesses
        </h1>
        <p className="text-muted mt-2 text-sm">
          Manage claimed business profiles, respond to reviews and complaints, and
          update verification details.
        </p>
      </div>

      {businesses.length === 0 ? (
        <EmptyState
          title="No claimed businesses yet"
          description="Submit a claim request for a business you operate. After admin approval you can manage the profile here."
          action={{ href: "/businesses", label: "Browse businesses to claim" }}
        />
      ) : (
        <ul className="grid list-none gap-4 p-0 sm:grid-cols-2">
          {businesses.map((business) => {
            const trustLabel = resolveTrustLabelForListing({
              trustScore: business.trustScore,
              claimStatus: business.claimStatus as ClaimStatus,
            });
            return (
              <li
                key={business.id}
                className="flex flex-col rounded-xl border border-border bg-card p-5"
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
                      complaints
                    </p>
                    <p className="text-muted mt-1 text-sm tabular-nums">
                      Trust {business.trustScore}/100
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
                <div className="mt-auto flex flex-wrap gap-3 pt-4 text-sm">
                  <Link
                    href={`/dashboard/business/${business.id}`}
                    className="text-primary font-medium no-underline hover:underline"
                  >
                    Manage →
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
