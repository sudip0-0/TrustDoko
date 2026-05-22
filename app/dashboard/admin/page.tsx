import type { Metadata } from "next";

import { AuditTrailList } from "@/components/admin/audit-trail-list";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";
import { getAdminDashboardStats } from "@/server/queries/admin/stats";
import { getRecentAuditLogs } from "@/server/queries/admin/audit";

export const metadata: Metadata = {
  title: "Admin overview",
};

export default async function AdminOverviewPage() {
  const [stats, auditLogs] = await Promise.all([
    getAdminDashboardStats(),
    getRecentAuditLogs(25),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold">Queue summary</h2>
        <p className="text-muted mt-1 text-sm">
          Click a metric to open the related moderation queue.
        </p>
        <div className="mt-4">
          <AdminStatsGrid stats={stats} />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Recent audit trail</h2>
        <p className="text-muted mt-1 text-sm">
          Who performed an action, what changed, and when — for accountability.
        </p>
        <div className="mt-4">
          <AuditTrailList logs={auditLogs} />
        </div>
      </section>
    </div>
  );
}
