import type { ClaimStatus } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ClaimPendingBanner } from "@/components/business/claim-pending-banner";
import { BusinessProfileActions } from "@/components/business/business-profile-actions";
import { BusinessProfileHeader } from "@/components/business/business-profile-header";
import { BusinessProfileOverview } from "@/components/business/business-profile-overview";
import { BusinessProfileReviews } from "@/components/business/business-profile-reviews";
import { ProfileTabsNav } from "@/components/business/profile-tabs-nav";
import { ContentWidth } from "@/components/layout/content-width";
import { ComplaintForm } from "@/components/complaints/complaint-form";
import { ComplaintSignInCta } from "@/components/complaints/complaint-sign-in-cta";
import { OwnerComplaintsPanel } from "@/components/complaints/owner-complaints-panel";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewPendingBanner } from "@/components/reviews/review-pending-banner";
import { ReviewSignInCta } from "@/components/reviews/review-sign-in-cta";
import { getSessionUser } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo/metadata";
import { isStorageConfigured } from "@/lib/storage/config";
import { isBusinessOwner } from "@/lib/permissions/business";
import { canViewBusinessComplaints } from "@/lib/permissions/complaint";
import { getBusinessProfile } from "@/server/queries/business-profile";
import { getRatingDistributionForBusiness } from "@/server/queries/home";
import { isBusinessSavedByUser } from "@/server/queries/saved-businesses";
import {
  getApprovedReviewsForBusiness,
  getViewerReviewForBusiness,
} from "@/server/queries/reviews";

type BusinessProfilePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reviewPage?: string }>;
};

export async function generateMetadata({
  params,
}: BusinessProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessProfile(slug);

  if (!business) {
    return { title: "Business not found" };
  }

  return buildMetadata({
    title: business.name,
    description: `Trust score, reviews, and complaints for ${business.name} on TrustDoko.`,
    path: `/businesses/${slug}`,
  });
}

export default async function BusinessProfilePage({
  params,
  searchParams,
}: BusinessProfilePageProps) {
  const { slug } = await params;
  const rawSearch = await searchParams;
  const reviewPage = Math.max(1, Number(rawSearch.reviewPage) || 1);

  const business = await getBusinessProfile(slug);

  if (!business) {
    notFound();
  }

  const sessionUser = await getSessionUser();

  const [reviewList, viewerReview, initialSaved, ratingDistribution] =
    await Promise.all([
      getApprovedReviewsForBusiness(business.id, reviewPage, sessionUser?.id),
      sessionUser
        ? getViewerReviewForBusiness(business.id, sessionUser.id)
        : Promise.resolve(null),
      sessionUser
        ? isBusinessSavedByUser(sessionUser.id, business.id)
        : Promise.resolve(false),
      getRatingDistributionForBusiness(business.id),
    ]);

  const viewerIsOwner = sessionUser
    ? isBusinessOwner(sessionUser, {
        claimedByUserId: business.claimedByUserId,
        claimStatus: business.claimStatus as ClaimStatus,
      })
    : false;

  const proofUploadEnabled = isStorageConfigured();

  const profileTabs = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: `Reviews (${reviewList.total})` },
    { id: "report-issue", label: "Report issue" },
    { id: "about", label: "About" },
  ];

  return (
    <ContentWidth size="lg" className="space-y-6 py-8">
      <BusinessProfileHeader business={business} />

      {business.claimStatus === "PENDING" ? (
        <ClaimPendingBanner businessName={business.name} />
      ) : null}

      <BusinessProfileActions
        business={business}
        viewerIsOwner={viewerIsOwner}
        showSave={Boolean(sessionUser)}
        initialSaved={initialSaved}
      />

      <ProfileTabsNav tabs={profileTabs} />

      <BusinessProfileOverview
        business={business}
        ratingDistribution={ratingDistribution}
      />

      <section id="write-review" className="scroll-mt-24">
        {sessionUser ? (
          <div className="space-y-4">
            {viewerReview ? <ReviewPendingBanner review={viewerReview} /> : null}
            <ReviewForm
              businessSlug={business.slug}
              businessName={business.name}
              viewerReview={viewerReview}
              proofUploadEnabled={proofUploadEnabled}
            />
          </div>
        ) : (
          <ReviewSignInCta businessSlug={business.slug} />
        )}
      </section>

      <BusinessProfileReviews
        businessSlug={business.slug}
        reviews={reviewList.reviews}
        reviewPage={reviewPage}
        reviewTotalPages={reviewList.totalPages}
        reviewTotal={reviewList.total}
        viewerUserId={sessionUser?.id}
        isLoggedIn={Boolean(sessionUser)}
      />

      <section id="report-issue" className="scroll-mt-24">
        {sessionUser ? (
          <ComplaintForm
            businessSlug={business.slug}
            businessName={business.name}
            proofUploadEnabled={proofUploadEnabled}
          />
        ) : (
          <ComplaintSignInCta businessSlug={business.slug} />
        )}
      </section>

      <section id="about" className="scroll-mt-24 rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold">About this business</h2>
        {business.description ? (
          <p className="text-muted mt-3 leading-relaxed">{business.description}</p>
        ) : (
          <p className="text-muted mt-3 text-sm">No public description provided.</p>
        )}
      </section>

      {sessionUser &&
      canViewBusinessComplaints(sessionUser, {
        claimedByUserId: business.claimedByUserId,
        claimStatus: business.claimStatus as ClaimStatus,
      }) ? (
        <OwnerComplaintsPanel
          businessId={business.id}
          businessName={business.name}
          sessionUser={sessionUser}
          business={{
            claimedByUserId: business.claimedByUserId,
            claimStatus: business.claimStatus as ClaimStatus,
          }}
        />
      ) : null}

      <p className="text-muted text-center text-sm">
        <Link href="/businesses" className="no-underline hover:underline">
          Back to all businesses
        </Link>
      </p>
    </ContentWidth>
  );
}
