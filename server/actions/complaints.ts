"use server";

import { ComplaintStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { recalculateBusinessComplaintCount } from "@/lib/complaints/aggregates";
import { isComplaintRateLimited } from "@/lib/complaints/rate-limit";
import { getComplaintSeverity } from "@/lib/complaints/severity";
import { canTransitionComplaintStatus } from "@/lib/complaints/status-transitions";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { determineInitialComplaintStatus } from "@/lib/moderation/complaint-status";
import { isAdmin } from "@/lib/permissions/admin";
import { canReplyToComplaint } from "@/lib/permissions/complaint";
import {
  buildComplaintSummary,
  parseComplaintFormData,
  respondToComplaintSchema,
  submitComplaintSchema,
  updateComplaintStatusSchema,
} from "@/lib/validations/complaint";

export type ComplaintActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  message?: string;
};

function formatZodErrors(
  errors: Record<string, string[] | undefined>,
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(errors).filter((entry): entry is [string, string[]] => {
      return entry[1] !== undefined && entry[1].length > 0;
    }),
  );
}

function parseExperienceDate(value: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid experience date");
  }
  return date;
}

async function logComplaintAudit(
  actorUserId: string | null,
  action: string,
  complaintId: string,
  metadata?: Prisma.InputJsonValue,
) {
  await prisma.auditLog.create({
    data: {
      actorUserId,
      action,
      entityType: "Complaint",
      entityId: complaintId,
      metadata,
    },
  });
}

export async function submitComplaintAction(
  _prevState: ComplaintActionState,
  formData: FormData,
): Promise<ComplaintActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must sign in to report an issue." };
  }

  const parsed = submitComplaintSchema.safeParse({
    ...parseComplaintFormData(formData),
    businessSlug: formData.get("businessSlug"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const business = await prisma.business.findUnique({
    where: { slug: parsed.data.businessSlug },
    select: { id: true, slug: true },
  });

  if (!business) {
    return { error: "Business not found." };
  }

  if (await isComplaintRateLimited(user.id)) {
    return {
      error: "You have reached the complaint limit for today. Please try again tomorrow.",
    };
  }

  const status = determineInitialComplaintStatus(
    parsed.data.category,
    parsed.data.description,
  );
  const severity = getComplaintSeverity(parsed.data.category);
  const summary = buildComplaintSummary(parsed.data.description);

  const complaint = await prisma.complaint.create({
    data: {
      businessId: business.id,
      userId: user.id,
      category: parsed.data.category,
      summary,
      description: parsed.data.description,
      experienceDate: parseExperienceDate(parsed.data.experienceDate),
      amountRange: parsed.data.amountRange ?? null,
      allowAdminContact: parsed.data.allowAdminContact ?? false,
      status,
      severity,
    },
    select: { id: true },
  });

  await recalculateBusinessComplaintCount(business.id);
  await logComplaintAudit(user.id, "COMPLAINT_SUBMITTED", complaint.id, {
    status,
    category: parsed.data.category,
  });

  revalidatePath(`/businesses/${business.slug}`);
  revalidatePath(`/report/${business.slug}`);
  revalidatePath("/dashboard/user");

  return {
    success: true,
    message:
      status === ComplaintStatus.UNDER_REVIEW
        ? "Your report was received and is under review."
        : "Your report was submitted successfully.",
  };
}

export async function respondToComplaintAction(
  _prevState: ComplaintActionState,
  formData: FormData,
): Promise<ComplaintActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must sign in to respond." };
  }

  const parsed = respondToComplaintSchema.safeParse({
    complaintId: formData.get("complaintId"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const complaint = await prisma.complaint.findUnique({
    where: { id: parsed.data.complaintId },
    select: {
      id: true,
      businessId: true,
      status: true,
      business: {
        select: {
          slug: true,
          claimedByUserId: true,
          claimStatus: true,
        },
      },
      businessResponse: { select: { id: true } },
    },
  });

  if (!complaint) {
    return { error: "Complaint not found." };
  }

  if (!canReplyToComplaint(user, complaint.business)) {
    return { error: "Only the claimed business owner can respond to this complaint." };
  }

  if (complaint.businessResponse) {
    return { error: "A response has already been posted for this complaint." };
  }

  if (complaint.status === ComplaintStatus.REJECTED) {
    return { error: "This complaint is closed and cannot receive a response." };
  }

  await prisma.$transaction([
    prisma.businessResponse.create({
      data: {
        businessId: complaint.businessId,
        authorUserId: user.id,
        complaintId: complaint.id,
        body: parsed.data.body,
      },
    }),
    prisma.complaint.update({
      where: { id: complaint.id },
      data: { status: ComplaintStatus.BUSINESS_RESPONDED },
    }),
    prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "COMPLAINT_BUSINESS_RESPONDED",
        entityType: "Complaint",
        entityId: complaint.id,
      },
    }),
  ]);

  revalidatePath(`/businesses/${complaint.business.slug}`);
  revalidatePath("/dashboard/user");

  return {
    success: true,
    message: "Your response was posted.",
  };
}

export async function updateComplaintStatusAction(
  _prevState: ComplaintActionState,
  formData: FormData,
): Promise<ComplaintActionState> {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    return { error: "Admin access required." };
  }

  const parsed = updateComplaintStatusSchema.safeParse({
    complaintId: formData.get("complaintId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
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
    data: { status: nextStatus },
  });

  await recalculateBusinessComplaintCount(complaint.businessId);
  await logComplaintAudit(user.id, "COMPLAINT_STATUS_UPDATED", complaint.id, {
    from: complaint.status,
    to: nextStatus,
  });

  revalidatePath(`/businesses/${complaint.business.slug}`);
  revalidatePath("/dashboard/user");

  return { success: true, message: "Complaint status updated." };
}
