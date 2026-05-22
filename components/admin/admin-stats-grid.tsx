import Link from "next/link";

import type { AdminDashboardStats } from "@/server/queries/admin/stats";

type AdminStatsGridProps = {
  stats: AdminDashboardStats;
};

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  const cards = [
    {
      label: "Pending reviews",
      value: stats.pendingReviews,
      href: "/dashboard/admin/reviews",
    },
    {
      label: "Pending complaints",
      value: stats.pendingComplaints,
      href: "/dashboard/admin/complaints",
    },
    {
      label: "Pending claims",
      value: stats.pendingClaims,
      href: "/dashboard/admin/claims",
    },
    {
      label: "Flagged reviews",
      value: stats.flaggedReviews,
      href: "/dashboard/admin/reviews",
    },
    {
      label: "Flagged users",
      value: stats.flaggedUsers,
      href: "/dashboard/admin/users",
    },
    {
      label: "Total businesses",
      value: stats.totalBusinesses,
      href: "/dashboard/admin/businesses",
    },
    {
      label: "Total users",
      value: stats.totalUsers,
      href: "/dashboard/admin/users",
    },
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.label}
          href={card.href}
          className="rounded-xl border border-border bg-card p-5 no-underline transition-shadow hover:shadow-sm"
        >
          <p className="text-muted text-sm font-medium">{card.label}</p>
          <p className="text-foreground mt-2 text-3xl font-bold tabular-nums">
            {card.value}
          </p>
        </Link>
      ))}
    </div>
  );
}
