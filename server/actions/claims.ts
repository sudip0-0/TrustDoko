"use server";

import { BusinessClaimStatus, ClaimStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { approveBusinessClaim, rejectBusinessClaim } from "@/lib/claims/approve";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/permissions/admin";
import {
  parseClaimFormData,
  submitClaimSchema,
} from "@/lib/validations/claim";

export type ClaimActionState = {
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

export async function submitClaimAction(
  _prevState: ClaimActionState,
  formData: FormData,
): Promise<ClaimActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must sign in to claim a business." };
  }

  const parsed = submitClaimSchema.safeParse({
    ...parseClaimFormData(formData),
    businessSlug: formData.get("businessSlug"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const business = await prisma.business.findUnique({
    where: { slug: parsed.data.businessSlug },
    select: { id: true, slug: true, claimStatus: true, claimedByUserId: true },
  });

  if (!business) {
    return { error: "Business not found." };
  }

  if (business.claimStatus === ClaimStatus.CLAIMED) {
    return { error: "This business is already claimed." };
  }

  if (business.claimStatus === ClaimStatus.PENDING) {
    const pending = await prisma.businessClaim.findFirst({
      where: {
        businessId: business.id,
        status: BusinessClaimStatus.PENDING,
      },
      select: { userId: true },
    });
    if (pending?.userId === user.id) {
      return {
        error: "You already have a pending claim for this business.",
      };
    }
    return { error: "A claim for this business is already under review." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const fresh = await tx.business.findUnique({
        where: { id: business.id },
        select: { claimStatus: true },
      });

      if (!fresh) {
        throw new Error("NOT_FOUND");
      }

      if (
        fresh.claimStatus === ClaimStatus.CLAIMED ||
        fresh.claimStatus === ClaimStatus.PENDING
      ) {
        throw new Error("NOT_ELIGIBLE");
      }

      const pendingClaim = await tx.businessClaim.findFirst({
        where: {
          businessId: business.id,
          status: BusinessClaimStatus.PENDING,
        },
        select: { userId: true },
      });

      if (pendingClaim) {
        if (pendingClaim.userId === user.id) {
          throw new Error("DUPLICATE_USER");
        }
        throw new Error("PENDING_OTHER");
      }

      const created = await tx.businessClaim.create({
        data: {
          businessId: business.id,
          userId: user.id,
          ownerName: parsed.data.ownerName,
          ownerEmail: parsed.data.ownerEmail,
          ownerPhone: parsed.data.ownerPhone || null,
          method: parsed.data.method,
          message: parsed.data.message,
        },
        select: { id: true },
      });

      await tx.business.update({
        where: { id: business.id },
        data: { claimStatus: ClaimStatus.PENDING },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: "CLAIM_SUBMITTED",
          entityType: "BusinessClaim",
          entityId: created.id,
          metadata: { businessId: business.id, method: parsed.data.method },
        },
      });
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "NOT_FOUND") {
      return { error: "Business not found." };
    }
    if (code === "NOT_ELIGIBLE") {
      return { error: "This business cannot be claimed right now." };
    }
    if (code === "DUPLICATE_USER") {
      return { error: "You already submitted a claim for this business." };
    }
    if (code === "PENDING_OTHER") {
      return {
        error: "A claim for this business is already under review.",
      };
    }
    throw error;
  }

  revalidatePath(`/businesses/${business.slug}`);
  revalidatePath(`/claim/${business.slug}`);
  revalidatePath("/dashboard/user");
  revalidatePath("/dashboard/admin/claims");

  return {
    success: true,
    message:
      "Your claim was submitted and is pending review. We will contact you if we need more information.",
  };
}

export async function approveClaimAction(
  _prevState: ClaimActionState,
  formData: FormData,
): Promise<ClaimActionState> {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    return { error: "Admin access required." };
  }

  const claimId = String(formData.get("claimId") ?? "");
  const adminNote = String(formData.get("adminNote") ?? "").trim() || null;

  if (!claimId) {
    return { error: "Claim is required." };
  }

  try {
    const claim = await prisma.businessClaim.findUnique({
      where: { id: claimId },
      select: {
        businessId: true,
        business: { select: { slug: true } },
      },
    });
    await approveBusinessClaim(claimId, user.id, adminNote);
    if (claim?.business.slug) {
      revalidatePath(`/businesses/${claim.business.slug}`);
      revalidatePath("/dashboard/business");
      revalidatePath(`/dashboard/business/${claim.businessId}`);
    }
    revalidatePath("/dashboard/admin/claims");
    return { success: true, message: "Claim approved." };
  } catch {
    return { error: "Could not approve this claim." };
  }
}

export async function rejectClaimAction(
  _prevState: ClaimActionState,
  formData: FormData,
): Promise<ClaimActionState> {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    return { error: "Admin access required." };
  }

  const claimId = String(formData.get("claimId") ?? "");
  const adminNote = String(formData.get("adminNote") ?? "").trim() || null;

  if (!claimId) {
    return { error: "Claim is required." };
  }

  try {
    const claim = await prisma.businessClaim.findUnique({
      where: { id: claimId },
      select: { business: { select: { slug: true } } },
    });
    await rejectBusinessClaim(claimId, user.id, adminNote);
    if (claim?.business.slug) {
      revalidatePath(`/businesses/${claim.business.slug}`);
    }
    revalidatePath("/dashboard/admin/claims");
    return { success: true, message: "Claim rejected." };
  } catch {
    return { error: "Could not reject this claim." };
  }
}
