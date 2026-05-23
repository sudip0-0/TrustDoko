import type { Metadata } from "next";

import { AuditTrailList } from "@/components/admin/audit-trail-list";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";
import { SectionHeader } from "@/components/ui/section-header";
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
        <SectionHeader
          title="Queue summary"
          description="Click a metric to open the related moderation queue."
        />
        <div className="mt-5">
          <AdminStatsGrid stats={stats} />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <SectionHeader
          title="Recent audit trail"
          description="Who performed an action, what changed, and when — for accountability."
        />
        <div className="mt-5">
          <AuditTrailList logs={auditLogs} />
        </div>
      </section>
    </div>
  );
}
