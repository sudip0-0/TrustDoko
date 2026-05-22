"use server";

import { revalidatePath } from "next/cache";

import { buildOwnerUpdateData } from "@/lib/business/build-owner-update-data";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { isBusinessOwner } from "@/lib/permissions/business";
import {
  parseBusinessProfileFormData,
  updateBusinessProfileSchema,
} from "@/lib/validations/business-profile";

export type BusinessProfileActionState = {
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

export async function updateBusinessProfileAction(
  _prevState: BusinessProfileActionState,
  formData: FormData,
): Promise<BusinessProfileActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must sign in to update this business." };
  }

  const parsed = updateBusinessProfileSchema.safeParse(
    parseBusinessProfileFormData(formData),
  );

  if (!parsed.success) {
    return {
      fieldErrors: formatZodErrors(parsed.error.flatten().fieldErrors),
    };
  }

  const business = await prisma.business.findUnique({
    where: { id: parsed.data.businessId },
    select: {
      id: true,
      slug: true,
      claimStatus: true,
      claimedByUserId: true,
    },
  });

  if (!business) {
    return { error: "Business not found." };
  }

  if (!isBusinessOwner(user, business)) {
    return {
      error: "Only the approved owner of a claimed business can edit this profile.",
    };
  }

  await prisma.$transaction([
    prisma.business.update({
      where: { id: business.id },
      data: buildOwnerUpdateData(parsed.data),
    }),
    prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "BUSINESS_PROFILE_UPDATED",
        entityType: "Business",
        entityId: business.id,
      },
    }),
  ]);

  revalidatePath(`/businesses/${business.slug}`);
  revalidatePath("/dashboard/business");
  revalidatePath(`/dashboard/business/${business.id}`);

  return {
    success: true,
    message: "Business profile updated.",
  };
}
