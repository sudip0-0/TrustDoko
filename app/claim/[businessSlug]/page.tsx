import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ClaimForm } from "@/components/claims/claim-form";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Alert } from "@/components/ui/alert";
import { copy } from "@/lib/copy/messages";
import { getSessionUser } from "@/lib/auth/session";
import { formatClaimStatus } from "@/lib/business/display";
import { isStorageConfigured } from "@/lib/storage/config";
import { prisma } from "@/lib/db";

type ClaimPageProps = {
  params: Promise<{ businessSlug: string }>;
};

export async function generateMetadata({
  params,
}: ClaimPageProps): Promise<Metadata> {
  const { businessSlug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug: businessSlug },
    select: { name: true },
  });
  return {
    title: business ? `Claim ${business.name}` : "Claim business",
  };
}

export default async function ClaimBusinessPage({ params }: ClaimPageProps) {
  const { businessSlug } = await params;
  const user = await getSessionUser();

  if (!user) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/claim/${businessSlug}`)}`,
    );
  }

  const business = await prisma.business.findUnique({
    where: { slug: businessSlug },
    select: { name: true, slug: true, claimStatus: true },
  });

  if (!business) {
    notFound();
  }

  const canSubmit =
    business.claimStatus === "UNCLAIMED" || business.claimStatus === "REJECTED";
  const proofUploadEnabled = isStorageConfigured();

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        title="Claim this business"
        description={`Request to manage ${business.name} on TrustDoko. ${copy.forms.claimHelper}`}
      />
      <p className="text-muted -mt-4 text-sm">
        Current status: {formatClaimStatus(business.claimStatus)}
      </p>

      {canSubmit ? (
        <Card className="mt-8">
          <CardContent className="py-6">
            <ClaimForm
              businessSlug={business.slug}
              businessName={business.name}
              proofUploadEnabled={proofUploadEnabled}
            />
          </CardContent>
        </Card>
      ) : (
        <Alert variant="warning" className="mt-8">
          {business.claimStatus === "PENDING"
            ? "A claim for this business is already under review."
            : "This business profile is already claimed by an approved owner."}
        </Alert>
      )}

      <Link
        href={`/businesses/${business.slug}`}
        className="text-primary mt-8 inline-block text-sm font-medium no-underline hover:underline"
      >
        ← Back to business profile
      </Link>
    </div>
  );
}
