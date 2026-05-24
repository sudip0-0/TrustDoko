import type { ClaimStatus } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TrustScoreDisplay } from "@/components/business/trust-score-display";
import { VerificationBadge } from "@/components/business/verification-badge";
import { ReviewForm } from "@/components/reviews/review-form";
import { ReviewPendingBanner } from "@/components/reviews/review-pending-banner";
import { ReviewSignInCta } from "@/components/reviews/review-sign-in-cta";
import { Card, CardContent } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo/metadata";
import { isStorageConfigured } from "@/lib/storage/config";
import { resolveTrustLabelForBusiness } from "@/lib/trust-score";
import { getBusinessProfile } from "@/server/queries/business-profile";
import { getViewerReviewForBusiness } from "@/server/queries/reviews";

type WriteReviewPageProps = {
  params: Promise<{ businessSlug: string }>;
};

export async function generateMetadata({
  params,
}: WriteReviewPageProps): Promise<Metadata> {
  const { businessSlug } = await params;
  const business = await getBusinessProfile(businessSlug);

  if (!business) {
    return { title: "Business not found" };
  }

  return buildMetadata({
    title: `Write a review for ${business.name}`,
    description: `Share a moderated TrustDoko review for ${business.name}.`,
    path: `/write-review/${businessSlug}`,
  });
}

export default async function WriteReviewPage({ params }: WriteReviewPageProps) {
  const { businessSlug } = await params;
  const business = await getBusinessProfile(businessSlug);

  if (!business) {
    notFound();
  }

  const sessionUser = await getSessionUser();
  const viewerReview = sessionUser
    ? await getViewerReviewForBusiness(business.id, sessionUser.id)
    : null;
  const trustLabel = resolveTrustLabelForBusiness({
    trustScore: business.trustScore,
    claimStatus: business.claimStatus as ClaimStatus,
    trustScoreReasons: business.trustScoreReasons,
  });

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
      <div className="space-y-6">
        <div>
          <p className="type-eyebrow text-primary">Community review</p>
          <h1 className="type-h1 mt-2">Write a review</h1>
          <p className="type-body mt-3 max-w-2xl">
            Share a specific, fair account of your experience. Reviews with
            serious claims may be held for moderation before they appear publicly.
          </p>
        </div>

        {sessionUser ? (
          <div className="space-y-4">
            {viewerReview ? <ReviewPendingBanner review={viewerReview} /> : null}
            <ReviewForm
              businessSlug={business.slug}
              businessName={business.name}
              viewerReview={viewerReview}
              proofUploadEnabled={isStorageConfigured()}
            />
          </div>
        ) : (
          <ReviewSignInCta businessSlug={business.slug} />
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardContent className="space-y-5">
            <div>
              <p className="type-eyebrow text-primary">Reviewing</p>
              <h2 className="type-h3 mt-2">{business.name}</h2>
              {business.category ? (
                <p className="type-caption mt-1">{business.category.name}</p>
              ) : null}
            </div>
            <TrustScoreDisplay
              trustScore={business.trustScore}
              trustLabel={trustLabel}
              variant="compact"
            />
            <div className="space-y-2 text-sm">
              <VerificationBadge
                claimStatus={business.claimStatus}
                verificationStatus={business.verificationStatus}
              />
              <p className="text-muted">
                {business.averageRating.toFixed(1)} average rating from{" "}
                {business.reviewCount} approved reviews.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Before publishing
            </p>
            <ul className="text-muted list-disc space-y-2 pl-5 text-sm leading-relaxed">
              <li>Approved reviews are public on the business profile.</li>
              <li>Proof files stay private and are available to admins only.</li>
              <li>Accusations are reviewed before being amplified.</li>
            </ul>
            <Link
              href={`/businesses/${business.slug}`}
              className="text-primary inline-flex text-sm font-medium no-underline hover:underline"
            >
              Back to profile
            </Link>
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
