import type { ClaimStatus } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ClaimPendingBanner } from "@/components/business/claim-pending-banner";
import { BusinessProfileActions } from "@/components/business/business-profile-actions";
import { BusinessProfileComplaints } from "@/components/business/business-profile-complaints";
import { BusinessProfileHeader } from "@/components/business/business-profile-header";
import { BusinessProfileReviews } from "@/components/business/business-profile-reviews";
import { BusinessProfileStats } from "@/components/business/business-profile-stats";
import { ComplaintForm } from "@/components/complaints/complaint-form";
import { ComplaintSignInCta } from "@/components/complaints/complaint-sign-in-cta";
import { OwnerComplaintsPanel } from "@/components/complaints/owner-complaints-panel";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewPendingBanner } from "@/components/reviews/review-pending-banner";
import { ReviewSignInCta } from "@/components/reviews/review-sign-in-cta";
import { getSessionUser } from "@/lib/auth/session";
import { isBusinessOwner } from "@/lib/permissions/business";
import { canViewBusinessComplaints } from "@/lib/permissions/complaint";
import { getBusinessProfile } from "@/server/queries/business-profile";
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

  return {
    title: business.name,
    description: `Trust score, reviews, and complaints for ${business.name} on TrustDoko.`,
  };
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

  const [reviewList, viewerReview] = await Promise.all([
    getApprovedReviewsForBusiness(business.id, reviewPage, sessionUser?.id),
    sessionUser
      ? getViewerReviewForBusiness(business.id, sessionUser.id)
      : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <BusinessProfileHeader business={business} />
      {business.claimStatus === "PENDING" ? (
        <ClaimPendingBanner businessName={business.name} />
      ) : null}
      <BusinessProfileStats business={business} />
      <BusinessProfileActions
        business={business}
        viewerIsOwner={
          sessionUser
            ? isBusinessOwner(sessionUser, {
                claimedByUserId: business.claimedByUserId,
                claimStatus: business.claimStatus as ClaimStatus,
              })
            : false
        }
      />

      {sessionUser ? (
        <div className="space-y-4">
          {viewerReview ? <ReviewPendingBanner review={viewerReview} /> : null}
          <ReviewForm
            businessSlug={business.slug}
            businessName={business.name}
            viewerReview={viewerReview}
          />
        </div>
      ) : (
        <ReviewSignInCta businessSlug={business.slug} />
      )}

      <BusinessProfileReviews
        businessSlug={business.slug}
        reviews={reviewList.reviews}
        reviewPage={reviewPage}
        reviewTotalPages={reviewList.totalPages}
        reviewTotal={reviewList.total}
        viewerUserId={sessionUser?.id}
        isLoggedIn={Boolean(sessionUser)}
      />
      <BusinessProfileComplaints business={business} />

      {sessionUser ? (
        <ComplaintForm
          businessSlug={business.slug}
          businessName={business.name}
        />
      ) : (
        <ComplaintSignInCta businessSlug={business.slug} />
      )}

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
          ← Browse all businesses
        </Link>
      </p>
    </div>
  );
}
