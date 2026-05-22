import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    auditLog: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db";
import { recordAuditLog } from "../audit-log";

describe("recordAuditLog", () => {
  beforeEach(() => {
    vi.mocked(prisma.auditLog.create).mockClear();
  });

  it("persists actor, action, entity, and metadata", async () => {
    await recordAuditLog({
      actorUserId: "admin-1",
      action: "REVIEW_APPROVED",
      entityType: "Review",
      entityId: "rev-1",
      metadata: { from: "PENDING", to: "APPROVED" },
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        actorUserId: "admin-1",
        action: "REVIEW_APPROVED",
        entityType: "Review",
        entityId: "rev-1",
        metadata: { from: "PENDING", to: "APPROVED" },
      },
    });
  });
});
