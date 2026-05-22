"use server";

import type { UserTrustLevel } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { getSessionUser } from "@/lib/auth/session";
import { recordAuditLog } from "@/lib/moderation/audit-log";
import { isAdmin } from "@/lib/permissions/admin";
import { prisma } from "@/lib/db";
import { updateUserModerationSchema } from "@/lib/validations/admin";

export type AdminUserActionState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function updateUserTrustLevelAction(
  _prevState: AdminUserActionState,
  formData: FormData,
): Promise<AdminUserActionState> {
  const user = await getSessionUser();
  if (!user || !isAdmin(user)) {
    return { error: "Admin access required." };
  }

  const parsed = updateUserModerationSchema.safeParse({
    userId: formData.get("userId"),
    trustLevel: formData.get("trustLevel"),
  });

  if (!parsed.success) {
    return { error: "Invalid user update." };
  }

  if (parsed.data.userId === user.id) {
    return { error: "You cannot change your own trust level here." };
  }

  const target = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, trustLevel: true, email: true },
  });

  if (!target) {
    return { error: "User not found." };
  }

  const nextLevel = parsed.data.trustLevel as UserTrustLevel;

  await prisma.user.update({
    where: { id: target.id },
    data: { trustLevel: nextLevel },
  });

  await recordAuditLog({
    actorUserId: user.id,
    action:
      nextLevel === "FLAGGED"
        ? "USER_FLAGGED"
        : "USER_TRUST_LEVEL_UPDATED",
    entityType: "User",
    entityId: target.id,
    metadata: { from: target.trustLevel, to: nextLevel },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/users");

  return { success: true, message: "User trust level updated." };
}
