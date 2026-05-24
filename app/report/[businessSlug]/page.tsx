import type { ClaimStatus } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TrustScoreDisplay } from "@/components/business/trust-score-display";
import { VerificationBadge } from "@/components/business/verification-badge";
import { ComplaintForm } from "@/components/complaints/complaint-form";
import { ComplaintSignInCta } from "@/components/complaints/complaint-sign-in-cta";
import { Card, CardContent } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo/metadata";
import { isStorageConfigured } from "@/lib/storage/config";
import { resolveTrustLabelForBusiness } from "@/lib/trust-score";
import { getBusinessProfile } from "@/server/queries/business-profile";

type ReportPageProps = {
  params: Promise<{ businessSlug: string }>;
};

export async function generateMetadata({
  params,
}: ReportPageProps): Promise<Metadata> {
  const { businessSlug } = await params;
  const business = await getBusinessProfile(businessSlug);

  if (!business) {
    return { title: "Business not found" };
  }

  return buildMetadata({
    title: `Report an issue with ${business.name}`,
    description: `Submit a private, moderated TrustDoko complaint about ${business.name}.`,
    path: `/report/${businessSlug}`,
  });
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { businessSlug } = await params;
  const business = await getBusinessProfile(businessSlug);

  if (!business) {
    notFound();
  }

  const sessionUser = await getSessionUser();
  const trustLabel = resolveTrustLabelForBusiness({
    trustScore: business.trustScore,
    claimStatus: business.claimStatus as ClaimStatus,
    trustScoreReasons: business.trustScoreReasons,
  });

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
      <div className="space-y-6">
        <div>
          <p className="type-eyebrow text-primary">Private report</p>
          <h1 className="type-h1 mt-2">Report a serious issue</h1>
          <p className="type-body mt-3 max-w-2xl">
            Use this for unresolved orders, misleading pricing, non-delivery, or
            other serious issues. Reports are moderated before they affect
            public trust signals.
          </p>
        </div>

        {sessionUser ? (
          <ComplaintForm
            businessSlug={business.slug}
            businessName={business.name}
            proofUploadEnabled={isStorageConfigured()}
          />
        ) : (
          <ComplaintSignInCta businessSlug={business.slug} />
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardContent className="space-y-5">
            <div>
              <p className="type-eyebrow text-primary">Reporting</p>
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
                {business.complaintSummary.unresolved} unresolved of{" "}
                {business.complaintSummary.total} moderated complaints.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3">
            <p className="text-foreground text-sm font-semibold">
              Privacy and moderation
            </p>
            <ul className="text-muted list-disc space-y-2 pl-5 text-sm leading-relaxed">
              <li>Complaint proof is private by default.</li>
              <li>
                Admins may review the report before public status changes.
              </li>
              <li>Public wording avoids presenting allegations as facts.</li>
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
