"use server";

import { ComplaintStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { recalculateBusinessComplaintCount } from "@/lib/complaints/aggregates";
import { canTransitionComplaintStatus } from "@/lib/complaints/status-transitions";
import { getSessionUser } from "@/lib/auth/session";
import { recordAuditLog } from "@/lib/moderation/audit-log";
import { isAdmin } from "@/lib/permissions/admin";
import { prisma } from "@/lib/db";
import { recalculateTrustScore } from "@/lib/trust-score/recalculate";
import { updateComplaintModerationSchema } from "@/lib/validations/admin";

export type AdminComplaintActionState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function moderateComplaintAction(
  _prevState: AdminComplaintActionState,
  formData: FormData,
): Promise<AdminComplaintActionState> {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    return { error: "Admin access required." };
  }

  const adminNoteRaw = formData.get("adminNote");
  const parsed = updateComplaintModerationSchema.safeParse({
    complaintId: formData.get("complaintId"),
    status: formData.get("status"),
    adminNote:
      typeof adminNoteRaw === "string" && adminNoteRaw.trim()
        ? adminNoteRaw.trim()
        : undefined,
  });

  if (!parsed.success) {
    return { error: "Invalid complaint update." };
  }

  const complaint = await prisma.complaint.findUnique({
    where: { id: parsed.data.complaintId },
    select: {
      id: true,
      status: true,
      businessId: true,
      business: { select: { slug: true } },
    },
  });

  if (!complaint) {
    return { error: "Complaint not found." };
  }

  const nextStatus = parsed.data.status as ComplaintStatus;
  if (!canTransitionComplaintStatus(complaint.status, nextStatus)) {
    return { error: "That status change is not allowed." };
  }

  await prisma.complaint.update({
    where: { id: complaint.id },
    data: {
      status: nextStatus,
      ...(parsed.data.adminNote !== undefined
        ? { adminNote: parsed.data.adminNote || null }
        : {}),
    },
  });

  await recalculateBusinessComplaintCount(complaint.businessId);
  await recalculateTrustScore(complaint.businessId);

  await recordAuditLog({
    actorUserId: user.id,
    action: "COMPLAINT_MODERATED",
    entityType: "Complaint",
    entityId: complaint.id,
    metadata: {
      from: complaint.status,
      to: nextStatus,
      hasAdminNote: Boolean(parsed.data.adminNote),
    },
  });

  revalidatePath(`/businesses/${complaint.business.slug}`);
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/complaints");

  return { success: true, message: "Complaint updated." };
}
