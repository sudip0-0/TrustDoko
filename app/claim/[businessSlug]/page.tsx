import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";

type ClaimPageProps = {
  params: Promise<{ businessSlug: string }>;
};

export default async function ClaimBusinessPage({ params }: ClaimPageProps) {
  const { businessSlug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug: businessSlug },
    select: { name: true, slug: true, claimStatus: true },
  });

  if (!business) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold">Claim this business</h1>
      <p className="text-muted mt-3 text-sm leading-relaxed">
        Business claim flow for <strong>{business.name}</strong> will be available
        in TD-0601. Current status: {business.claimStatus.toLowerCase()}.
      </p>
      <Link
        href={`/businesses/${business.slug}`}
        className="text-primary mt-6 inline-block text-sm font-medium no-underline hover:underline"
      >
        ← Back to business
      </Link>
    </div>
  );
}
