import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ClaimForm } from "@/components/claims/claim-form";
import { getSessionUser } from "@/lib/auth/session";
import { formatClaimStatus } from "@/lib/business/display";
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

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold">Claim this business</h1>
      <p className="text-muted mt-3 text-sm leading-relaxed">
        Request to manage <strong>{business.name}</strong> on TrustDoko. Claims are
        reviewed by our team before you can edit the profile or respond to reviews.
      </p>
      <p className="text-muted mt-2 text-sm">
        Current status: {formatClaimStatus(business.claimStatus)}
      </p>

      {canSubmit ? (
        <div className="mt-8">
          <ClaimForm businessSlug={business.slug} businessName={business.name} />
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-border bg-card px-4 py-3 text-sm">
          {business.claimStatus === "PENDING"
            ? "A claim for this business is already under review."
            : "This business profile is already claimed."}
        </p>
      )}

      <Link
        href={`/businesses/${business.slug}`}
        className="text-primary mt-8 inline-block text-sm font-medium no-underline hover:underline"
      >
        ← Back to business
      </Link>
    </div>
  );
}
