import Link from "next/link";

import type { AdminDashboardStats } from "@/server/queries/admin/stats";
import { cn } from "@/lib/utils";

type AdminStatsGridProps = {
  stats: AdminDashboardStats;
};

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  const cards = [
    {
      label: "Pending reviews",
      value: stats.pendingReviews,
      href: "/dashboard/admin/reviews",
      urgent: stats.pendingReviews > 0,
    },
    {
      label: "Open complaints",
      value: stats.pendingComplaints,
      href: "/dashboard/admin/complaints",
      urgent: stats.pendingComplaints > 0,
    },
    {
      label: "Pending claims",
      value: stats.pendingClaims,
      href: "/dashboard/admin/claims",
      urgent: stats.pendingClaims > 0,
    },
    {
      label: "Flagged reviews",
      value: stats.flaggedReviews,
      href: "/dashboard/admin/reviews",
      urgent: stats.flaggedReviews > 0,
    },
    {
      label: "Risk flags",
      value: stats.flaggedReviews + stats.flaggedUsers,
      href: "/dashboard/admin/reviews",
      urgent: stats.flaggedReviews + stats.flaggedUsers > 0,
    },
    {
      label: "Total businesses",
      value: stats.totalBusinesses,
      href: "/dashboard/admin/businesses",
      urgent: false,
    },
    {
      label: "Total users",
      value: stats.totalUsers,
      href: "/dashboard/admin/users",
      urgent: false,
    },
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className={cn(
            "rounded-xl border bg-card p-5 no-underline transition-[border-color,box-shadow] hover:shadow-sm",
            card.urgent
              ? "border-primary/30 bg-primary/[0.03]"
              : "border-border",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-muted text-sm font-medium">{card.label}</p>
            {card.urgent ? (
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                Action
              </span>
            ) : null}
          </div>
          <p className="text-foreground mt-2 font-mono text-3xl font-bold tabular-nums">
            {card.value}
          </p>
        </Link>
      ))}
    </div>
  );
}
