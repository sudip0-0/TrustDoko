import type { Metadata } from "next";
import Link from "next/link";

import { TrustScoreDisplay } from "@/components/business/trust-score-display";
import { TrustLabelBadge } from "@/components/business/trust-label-badge";
import { VerificationBadge } from "@/components/business/verification-badge";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { copy } from "@/lib/copy/messages";
import { getSessionUser } from "@/lib/auth/session";
import { resolveTrustLabelForListing } from "@/lib/trust-score";
import type { ClaimStatus } from "@prisma/client";
import { getOwnedBusinesses } from "@/server/queries/business-owner";

export const metadata: Metadata = {
  title: "My businesses",
};

export default async function BusinessDashboardPage() {
  const user = await getSessionUser();
  const businesses = user ? await getOwnedBusinesses(user) : [];

  return (
    <DashboardShell
      title="My businesses"
      description="Manage claimed profiles, respond to reviews and complaints, and update verification details."
    >
      {businesses.length === 0 ? (
        <EmptyState
          title="No claimed businesses yet"
          description={copy.empty.ownerBusinesses}
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
              <li key={business.id}>
                <Card className="flex h-full flex-col">
                  <CardContent className="flex flex-1 flex-col py-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/dashboard/business/${business.id}`}
                          className="text-foreground type-h3 no-underline hover:text-primary"
                        >
                          {business.name}
                        </Link>
                        <p className="text-muted mt-1 text-sm">
                          {business.reviewCount} reviews · {business.complaintCount}{" "}
                          complaints
                        </p>
                        <div className="mt-3">
                          <TrustScoreDisplay
                            trustScore={business.trustScore}
                            trustLabel={trustLabel}
                            variant="compact"
                          />
                        </div>
                        <div className="mt-2">
                          <TrustLabelBadge trustLabel={trustLabel} />
                        </div>
                      </div>
                      <VerificationBadge
                        claimStatus={business.claimStatus}
                        verificationStatus={business.verificationStatus}
                      />
                    </div>
                    <div className="mt-auto flex flex-wrap gap-3 pt-4">
                      <ButtonLink
                        href={`/dashboard/business/${business.id}`}
                        size="sm"
                      >
                        Manage
                      </ButtonLink>
                      <ButtonLink
                        href={`/businesses/${business.slug}`}
                        variant="outline"
                        size="sm"
                      >
                        Public profile
                      </ButtonLink>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardShell>
  );
}
