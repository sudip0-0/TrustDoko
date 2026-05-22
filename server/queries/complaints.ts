import { ClaimStatus, ComplaintStatus } from "@prisma/client";

import { getComplaintCategoryLabel } from "@/lib/complaints/categories";
import { prisma } from "@/lib/db";
import { canManageBusiness } from "@/lib/permissions/business";
import type { SessionUser } from "@/types/auth";

export type UserComplaintListItem = {
  id: string;
  category: string;
  categoryLabel: string;
  status: ComplaintStatus;
  statusLabel: string;
  summary: string;
  createdAt: Date;
  businessName: string;
  businessSlug: string;
};

export type OwnerComplaintListItem = {
  id: string;
  category: string;
  categoryLabel: string;
  status: ComplaintStatus;
  statusLabel: string;
  summary: string;
  description: string;
  experienceDate: Date;
  createdAt: Date;
  hasResponse: boolean;
  responseBody: string | null;
};

const statusLabels: Record<ComplaintStatus, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  BUSINESS_RESPONDED: "Business responded",
  RESOLVED: "Resolved",
  UNRESOLVED: "Unresolved",
  REJECTED: "Rejected",
};

export function formatComplaintStatus(status: ComplaintStatus): string {
  return statusLabels[status] ?? status;
}

export async function getUserComplaints(
  userId: string,
): Promise<UserComplaintListItem[]> {
  const complaints = await prisma.complaint.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      category: true,
      status: true,
      summary: true,
      createdAt: true,
      business: { select: { name: true, slug: true } },
    },
  });

  return complaints.map((c) => ({
    id: c.id,
    category: c.category,
    categoryLabel: getComplaintCategoryLabel(c.category),
    status: c.status,
    statusLabel: formatComplaintStatus(c.status),
    summary: c.summary,
    createdAt: c.createdAt,
    businessName: c.business.name,
    businessSlug: c.business.slug,
  }));
}

export async function getOwnerComplaintsForBusiness(
  businessId: string,
  viewer: SessionUser,
  business: {
    claimedByUserId: string | null;
    claimStatus: ClaimStatus;
  },
): Promise<OwnerComplaintListItem[]> {
  if (!canManageBusiness(viewer, business)) {
    return [];
  }

  const complaints = await prisma.complaint.findMany({
    where: {
      businessId,
      status: { not: ComplaintStatus.REJECTED },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      category: true,
      status: true,
      summary: true,
      description: true,
      experienceDate: true,
      createdAt: true,
      businessResponse: { select: { body: true } },
    },
  });

  return complaints.map((c) => ({
    id: c.id,
    category: c.category,
    categoryLabel: getComplaintCategoryLabel(c.category),
    status: c.status,
    statusLabel: formatComplaintStatus(c.status),
    summary: c.summary,
    description: c.description,
    experienceDate: c.experienceDate,
    createdAt: c.createdAt,
    hasResponse: Boolean(c.businessResponse),
    responseBody: c.businessResponse?.body ?? null,
  }));
}
