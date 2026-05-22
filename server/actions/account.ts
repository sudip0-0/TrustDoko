"use server";

import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { updateAccountSchema } from "@/lib/validations/account";

export type AccountActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  message?: string;
};

export async function updateAccountAction(
  _prevState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must sign in to update settings." };
  }

  const parsed = updateAccountSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).filter(
          (entry): entry is [string, string[]] =>
            entry[1] !== undefined && entry[1].length > 0,
        ),
      ),
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name },
  });

  revalidatePath("/dashboard/user");
  revalidatePath("/dashboard/user/settings");

  return { success: true, message: "Account settings saved." };
}
