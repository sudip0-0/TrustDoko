import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BusinessProfileEditForm } from "@/components/business/business-profile-edit-form";
import { OwnerBusinessOverview } from "@/components/business/owner-business-overview";
import { OwnerVerificationSection } from "@/components/business/owner-verification-section";
import { OwnerReviewsPanel } from "@/components/business/owner-reviews-panel";
import { OwnerComplaintsPanel } from "@/components/complaints/owner-complaints-panel";
import { TrustScoreExplanation } from "@/components/business/trust-score-explanation";
import type { ClaimStatus, VerificationStatus } from "@prisma/client";

import { getSessionUser } from "@/lib/auth/session";
import { getBusinessForOwnerEdit } from "@/server/queries/business-owner";

type OwnerBusinessPageProps = {
  params: Promise<{ businessId: string }>;
};

export async function generateMetadata({
  params,
}: OwnerBusinessPageProps): Promise<Metadata> {
  const { businessId } = await params;
  const user = await getSessionUser();
  const business = user
    ? await getBusinessForOwnerEdit(businessId, user)
    : null;
  return { title: business ? `Manage ${business.name}` : "Manage business" };
}

export default async function OwnerBusinessPage({ params }: OwnerBusinessPageProps) {
  const { businessId } = await params;
  const user = await getSessionUser();
  if (!user) {
    notFound();
  }

  const business = await getBusinessForOwnerEdit(businessId, user);
  if (!business) {
    notFound();
  }

  const ownership = {
    claimedByUserId: business.claimedByUserId,
    claimStatus: business.claimStatus as ClaimStatus,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-muted text-sm">
            <Link
              href="/dashboard/business"
              className="no-underline hover:text-primary"
            >
              ← All businesses
            </Link>
          </p>
          <h1 className="type-h1 mt-2">
            {business.name}
          </h1>
          <p className="text-muted mt-2 text-sm">
            <Link
              href={`/businesses/${business.slug}`}
              className="text-primary no-underline hover:underline"
            >
              View public profile
            </Link>
          </p>
        </div>
      </div>

      <OwnerBusinessOverview business={business} />
      <OwnerVerificationSection
        claimStatus={business.claimStatus as ClaimStatus}
        verificationStatus={business.verificationStatus as VerificationStatus}
      />
      <TrustScoreExplanation
        trustScore={business.trustScore}
        reasons={business.trustScoreReasons}
      />
      <BusinessProfileEditForm business={business} />
      <OwnerReviewsPanel
        businessId={business.id}
        businessSlug={business.slug}
        sessionUser={user}
        business={ownership}
      />
      <OwnerComplaintsPanel
        businessId={business.id}
        businessName={business.name}
        sessionUser={user}
        business={ownership}
      />
    </div>
  );
}
