"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export type SavedBusinessActionState = {
  success?: boolean;
  error?: string;
  saved?: boolean;
  message?: string;
};

export async function toggleSaveBusinessAction(
  businessId: string,
): Promise<SavedBusinessActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Sign in to save businesses." };
  }

  if (!businessId) {
    return { error: "Business is required." };
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { id: true, slug: true },
  });

  if (!business) {
    return { error: "Business not found." };
  }

  const existing = await prisma.savedBusiness.findUnique({
    where: {
      userId_businessId: { userId: user.id, businessId: business.id },
    },
    select: { id: true },
  });

  if (existing) {
    await prisma.savedBusiness.delete({ where: { id: existing.id } });
    revalidatePath("/dashboard/user/saved");
    revalidatePath(`/businesses/${business.slug}`);
    return { success: true, saved: false, message: "Removed from saved." };
  }

  await prisma.savedBusiness.create({
    data: { userId: user.id, businessId: business.id },
  });

  revalidatePath("/dashboard/user/saved");
  revalidatePath(`/businesses/${business.slug}`);
  return { success: true, saved: true, message: "Business saved." };
}

export async function removeSavedBusinessAction(
  _prevState: SavedBusinessActionState,
  formData: FormData,
): Promise<SavedBusinessActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Sign in to manage saved businesses." };
  }

  const savedId = formData.get("savedId");
  if (typeof savedId !== "string" || !savedId) {
    return { error: "Saved entry is required." };
  }

  const row = await prisma.savedBusiness.findUnique({
    where: { id: savedId },
    select: { id: true, userId: true },
  });

  if (!row || row.userId !== user.id) {
    return { error: "Saved business not found." };
  }

  await prisma.savedBusiness.delete({ where: { id: row.id } });
  revalidatePath("/dashboard/user/saved");

  return { success: true, saved: false, message: "Removed from saved." };
}
