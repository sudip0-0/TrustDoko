import { ReviewStatus } from "@prisma/client";

import { MODERATION_QUEUE_STATUSES } from "@/lib/moderation/review-transitions";
import { prisma } from "@/lib/db";

import { requireAdminQuery } from "./guard";

export type AdminReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  status: ReviewStatus;
  createdAt: Date;
  authorName: string | null;
  authorEmail: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  proofFileId: string | null;
};

export async function getReviewsForModeration(
  statusFilter?: ReviewStatus | "ALL",
): Promise<AdminReviewRow[]> {
  await requireAdminQuery();

  const where =
    statusFilter && statusFilter !== "ALL"
      ? { status: statusFilter }
      : { status: { in: MODERATION_QUEUE_STATUSES } };

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      rating: true,
      title: true,
      body: true,
      status: true,
      proofFileId: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
      business: { select: { id: true, name: true, slug: true } },
    },
  });

  return reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    status: r.status,
    createdAt: r.createdAt,
    authorName: r.user.name,
    authorEmail: r.user.email,
    businessId: r.business.id,
    businessName: r.business.name,
    businessSlug: r.business.slug,
    proofFileId: r.proofFileId,
  }));
}
