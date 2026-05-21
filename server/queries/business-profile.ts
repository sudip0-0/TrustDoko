import { ComplaintStatus, ReviewStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

export type BusinessProfileReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: Date;
  authorName: string | null;
};

export type BusinessProfileData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  businessType: string;
  address: string | null;
  city: string | null;
  province: string | null;
  phone: string | null;
  email: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  claimStatus: string;
  verificationStatus: string;
  trustScore: number;
  averageRating: number;
  reviewCount: number;
  complaintCount: number;
  category: { name: string; slug: string } | null;
  reviews: BusinessProfileReview[];
  complaintSummary: {
    total: number;
    unresolved: number;
    resolved: number;
  };
};

export async function getBusinessProfile(
  slug: string,
): Promise<BusinessProfileData | null> {
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      category: { select: { name: true, slug: true } },
      reviews: {
        where: { status: ReviewStatus.APPROVED },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          rating: true,
          title: true,
          body: true,
          createdAt: true,
          user: { select: { name: true } },
        },
      },
    },
  });

  if (!business) {
    return null;
  }

  const [unresolved, resolved] = await Promise.all([
    prisma.complaint.count({
      where: {
        businessId: business.id,
        status: {
          in: [
            ComplaintStatus.SUBMITTED,
            ComplaintStatus.UNDER_REVIEW,
            ComplaintStatus.BUSINESS_RESPONDED,
            ComplaintStatus.UNRESOLVED,
          ],
        },
      },
    }),
    prisma.complaint.count({
      where: {
        businessId: business.id,
        status: ComplaintStatus.RESOLVED,
      },
    }),
  ]);

  return {
    id: business.id,
    name: business.name,
    slug: business.slug,
    description: business.description,
    businessType: business.businessType,
    address: business.address,
    city: business.city,
    province: business.province,
    phone: business.phone,
    email: business.email,
    websiteUrl: business.websiteUrl,
    facebookUrl: business.facebookUrl,
    instagramUrl: business.instagramUrl,
    tiktokUrl: business.tiktokUrl,
    claimStatus: business.claimStatus,
    verificationStatus: business.verificationStatus,
    trustScore: business.trustScore,
    averageRating: business.averageRating,
    reviewCount: business.reviewCount,
    complaintCount: business.complaintCount,
    category: business.category,
    reviews: business.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      body: review.body,
      createdAt: review.createdAt,
      authorName: review.user.name,
    })),
    complaintSummary: {
      total: business.complaintCount,
      unresolved,
      resolved,
    },
  };
}
