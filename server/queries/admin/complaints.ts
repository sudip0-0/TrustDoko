import { ComplaintStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

import { requireAdminQuery } from "./guard";

export type AdminComplaintRow = {
  id: string;
  summary: string;
  category: string;
  status: ComplaintStatus;
  severity: string;
  adminNote: string | null;
  createdAt: Date;
  authorEmail: string;
  businessName: string;
  businessSlug: string;
  proofFileId: string | null;
};

const OPEN_STATUSES: ComplaintStatus[] = [
  ComplaintStatus.SUBMITTED,
  ComplaintStatus.UNDER_REVIEW,
  ComplaintStatus.BUSINESS_RESPONDED,
  ComplaintStatus.UNRESOLVED,
];

export async function getComplaintsForModeration(
  statusFilter?: ComplaintStatus | "ALL",
): Promise<AdminComplaintRow[]> {
  await requireAdminQuery();

  const where =
    statusFilter && statusFilter !== "ALL"
      ? { status: statusFilter }
      : { status: { in: OPEN_STATUSES } };

  const complaints = await prisma.complaint.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      summary: true,
      category: true,
      status: true,
      severity: true,
      adminNote: true,
      proofFileId: true,
      createdAt: true,
      user: { select: { email: true } },
      business: { select: { name: true, slug: true } },
    },
  });

  return complaints.map((c) => ({
    id: c.id,
    summary: c.summary,
    category: c.category,
    status: c.status,
    severity: c.severity,
    adminNote: c.adminNote,
    createdAt: c.createdAt,
    authorEmail: c.user.email,
    businessName: c.business.name,
    businessSlug: c.business.slug,
    proofFileId: c.proofFileId,
  }));
}
