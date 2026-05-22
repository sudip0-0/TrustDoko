import { prisma } from "@/lib/db";

import { requireAdminQuery } from "./guard";

export type AdminAuditRow = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: Date;
  actorName: string | null;
  actorEmail: string | null;
};

export async function getRecentAuditLogs(limit = 30): Promise<AdminAuditRow[]> {
  await requireAdminQuery();

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      action: true,
      entityType: true,
      entityId: true,
      createdAt: true,
      actor: { select: { name: true, email: true } },
    },
  });

  return logs.map((log) => ({
    id: log.id,
    action: log.action,
    entityType: log.entityType,
    entityId: log.entityId,
    createdAt: log.createdAt,
    actorName: log.actor?.name ?? null,
    actorEmail: log.actor?.email ?? null,
  }));
}
