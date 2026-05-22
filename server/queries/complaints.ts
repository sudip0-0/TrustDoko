import { ClaimStatus, ComplaintStatus } from "@prisma/client";

import { getComplaintCategoryLabel } from "@/lib/complaints/categories";
import {
  complaintDashboardSelect,
  complaintOwnerPanelSelect,
} from "@/lib/complaints/selects";
import { prisma } from "@/lib/db";
import { canViewBusinessComplaints } from "@/lib/permissions/complaint";
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
  requesterId: string,
): Promise<UserComplaintListItem[]> {
  if (userId !== requesterId) {
    throw new Error("Forbidden: cannot load another user's complaints");
  }

  const complaints = await prisma.complaint.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: complaintDashboardSelect,
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

/** Dashboard entry point — always scopes to the signed-in user. */
export async function getDashboardComplaints(
  sessionUser: SessionUser,
): Promise<UserComplaintListItem[]> {
  return getUserComplaints(sessionUser.id, sessionUser.id);
}

export async function getOwnerComplaintsForBusiness(
  businessId: string,
  viewer: SessionUser,
  business: {
    claimedByUserId: string | null;
    claimStatus: ClaimStatus;
  },
): Promise<OwnerComplaintListItem[]> {
  const record = await prisma.business.findUnique({
    where: { id: businessId },
    select: { claimedByUserId: true, claimStatus: true },
  });

  if (!record) {
    return [];
  }

  if (
    record.claimedByUserId !== business.claimedByUserId ||
    record.claimStatus !== business.claimStatus
  ) {
    return [];
  }

  if (!canViewBusinessComplaints(viewer, record)) {
    return [];
  }

  const complaints = await prisma.complaint.findMany({
    where: {
      businessId,
      status: { not: ComplaintStatus.REJECTED },
    },
    orderBy: { createdAt: "desc" },
    select: complaintOwnerPanelSelect,
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
