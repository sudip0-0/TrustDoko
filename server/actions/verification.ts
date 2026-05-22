"use server";

import { VerificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/permissions/admin";
import { recalculateTrustScore } from "@/lib/trust-score/recalculate";

export type VerificationActionState = {
  success?: boolean;
  error?: string;
  message?: string;
};

const setVerificationSchema = z.object({
  businessId: z.string().trim().min(1),
  verificationStatus: z.enum([
    "UNVERIFIED",
    "CONTACT_VERIFIED",
    "DOCUMENT_VERIFIED",
    "SOCIAL_VERIFIED",
    "TRUSTED_SELLER",
  ]),
});

export async function setBusinessVerificationAction(
  _prevState: VerificationActionState,
  formData: FormData,
): Promise<VerificationActionState> {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    return { error: "Admin access required." };
  }

  const parsed = setVerificationSchema.safeParse({
    businessId: formData.get("businessId"),
    verificationStatus: formData.get("verificationStatus"),
  });

  if (!parsed.success) {
    return { error: "Invalid verification status." };
  }

  const business = await prisma.business.findUnique({
    where: { id: parsed.data.businessId },
    select: { id: true, slug: true },
  });

  if (!business) {
    return { error: "Business not found." };
  }

  const status = parsed.data.verificationStatus as VerificationStatus;

  await prisma.$transaction([
    prisma.business.update({
      where: { id: business.id },
      data: { verificationStatus: status },
    }),
    prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "VERIFICATION_STATUS_UPDATED",
        entityType: "Business",
        entityId: business.id,
        metadata: { verificationStatus: status },
      },
    }),
  ]);

  await recalculateTrustScore(business.id);

  revalidatePath(`/businesses/${business.slug}`);
  revalidatePath("/businesses");
  revalidatePath("/dashboard/admin/claims");
  revalidatePath("/dashboard/business");

  return { success: true, message: "Verification status updated." };
}
