import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BusinessProfileActions } from "@/components/business/business-profile-actions";
import { BusinessProfileComplaints } from "@/components/business/business-profile-complaints";
import { BusinessProfileHeader } from "@/components/business/business-profile-header";
import { BusinessProfileReviews } from "@/components/business/business-profile-reviews";
import { BusinessProfileStats } from "@/components/business/business-profile-stats";
import { getBusinessProfile } from "@/server/queries/business-profile";

type BusinessProfilePageProps = {
  params: Promise<{ slug: string }>;
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
}: BusinessProfilePageProps) {
  const { slug } = await params;
  const business = await getBusinessProfile(slug);

  if (!business) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <BusinessProfileHeader business={business} />
      <BusinessProfileStats business={business} />
      <BusinessProfileActions business={business} />
      <BusinessProfileReviews business={business} />
      <BusinessProfileComplaints business={business} />
    </div>
  );
}
