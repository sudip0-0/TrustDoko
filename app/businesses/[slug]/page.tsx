import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";

type BusinessProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BusinessProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
    select: { name: true },
  });

  if (!business) {
    return { title: "Business not found" };
  }

  return {
    title: business.name,
    description: `Trust score, reviews, and complaints for ${business.name} on TrustDoko.`,
  };
}

/** Placeholder until TD-0204 full profile page. */
export default async function BusinessProfilePage({
  params,
}: BusinessProfilePageProps) {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
    select: { name: true, slug: true },
  });

  if (!business) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">{business.name}</h1>
      <p className="text-muted mt-4 leading-relaxed">
        Full business profile (reviews, complaints, trust breakdown) is coming
        in TD-0204.
      </p>
      <Link
        href="/businesses"
        className="text-primary mt-8 inline-block text-sm font-medium no-underline hover:underline"
      >
        ← Back to businesses
      </Link>
    </div>
  );
}
