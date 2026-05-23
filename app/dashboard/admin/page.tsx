import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-shell";
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

  const riskFlags = stats.flaggedReviews + stats.flaggedUsers;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Moderation queue"
        description="Review and manage user submissions. Risky claims are not published automatically."
      />

      <AdminStatsGrid stats={stats} />

      {riskFlags > 0 ? (
        <p className="text-muted text-sm" role="status">
          <span className="text-foreground font-semibold tabular-nums">{riskFlags}</span>{" "}
          risk flag{riskFlags === 1 ? "" : "s"} need attention in reviews or users.
        </p>
      ) : null}

      <section className="rounded-lg border border-border bg-card p-6">
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
