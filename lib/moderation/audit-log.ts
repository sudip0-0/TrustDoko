import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

export type RecordAuditLogInput = {
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Prisma.InputJsonValue;
};

export async function recordAuditLog(input: RecordAuditLogInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actorUserId: input.actorUserId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata,
    },
  });
}
