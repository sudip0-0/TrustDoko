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
import { OwnerComplaintsPanel } from "@/components/complaints/owner-complaints-panel";
import { ButtonLink } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo/metadata";
import { isBusinessOwner } from "@/lib/permissions/business";
import { canViewBusinessComplaints } from "@/lib/permissions/complaint";
import { getBusinessProfile } from "@/server/queries/business-profile";
import { getRatingDistributionForBusiness } from "@/server/queries/home";
import { isBusinessSavedByUser } from "@/server/queries/saved-businesses";
import { getApprovedReviewsForBusiness } from "@/server/queries/reviews";

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

  const [reviewList, initialSaved, ratingDistribution] = await Promise.all([
    getApprovedReviewsForBusiness(business.id, reviewPage, sessionUser?.id),
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

      <BusinessProfileReviews
        businessSlug={business.slug}
        reviews={reviewList.reviews}
        reviewPage={reviewPage}
        reviewTotalPages={reviewList.totalPages}
        reviewTotal={reviewList.total}
        viewerUserId={sessionUser?.id}
        isLoggedIn={Boolean(sessionUser)}
      />

      <section
        id="report-issue"
        className="border-border bg-card scroll-mt-24 rounded-xl border p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Report an issue</h2>
            <p className="text-muted mt-1 max-w-2xl text-sm leading-relaxed">
              File serious issues through the dedicated report page so proof,
              privacy, and moderation steps stay clear.
            </p>
          </div>
          <ButtonLink
            href={`/report/${business.slug}`}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Open report form
          </ButtonLink>
        </div>
      </section>

      <section
        id="about"
        className="border-border bg-card scroll-mt-24 rounded-lg border p-6"
      >
        <h2 className="text-xl font-semibold">About this business</h2>
        {business.description ? (
          <p className="text-muted mt-3 leading-relaxed">
            {business.description}
          </p>
        ) : (
          <p className="text-muted mt-3 text-sm">
            No public description provided.
          </p>
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
