/**
 * Explicit Prisma selects — never include proofFileId, proofFile, userId, or allowAdminContact
 * on public or cross-user complaint reads.
 */
export const complaintDashboardSelect = {
  id: true,
  category: true,
  status: true,
  summary: true,
  createdAt: true,
  business: { select: { name: true, slug: true } },
} as const;

export const complaintOwnerPanelSelect = {
  id: true,
  category: true,
  status: true,
  summary: true,
  description: true,
  experienceDate: true,
  createdAt: true,
  businessResponse: { select: { body: true } },
} as const;
