import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BusinessProfileActions } from "@/components/business/business-profile-actions";
import { BusinessProfileComplaints } from "@/components/business/business-profile-complaints";
import { BusinessProfileHeader } from "@/components/business/business-profile-header";
import { BusinessProfileReviews } from "@/components/business/business-profile-reviews";
import { BusinessProfileStats } from "@/components/business/business-profile-stats";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewPendingBanner } from "@/components/reviews/review-pending-banner";
import { ReviewSignInCta } from "@/components/reviews/review-sign-in-cta";
import { getSessionUser } from "@/lib/auth/session";
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
      <BusinessProfileStats business={business} />
      <BusinessProfileActions business={business} />

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

      <p className="text-muted text-center text-sm">
        <Link href="/businesses" className="no-underline hover:underline">
          ← Browse all businesses
        </Link>
      </p>
    </div>
  );
}
