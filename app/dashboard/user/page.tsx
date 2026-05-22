import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";
import { ProfileSummaryCard } from "@/components/dashboard/profile-summary-card";
import { getSessionUser } from "@/lib/auth/session";
import {
  getUserNotifications,
  getUserProfileSummary,
} from "@/server/queries/user-dashboard";

export const metadata: Metadata = {
  title: "Your dashboard",
};

export default async function UserDashboardOverviewPage() {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  const [profile, notifications] = await Promise.all([
    getUserProfileSummary(user.id, user.id),
    getUserNotifications(user.id, user.id),
  ]);

  if (!profile) {
    notFound();
  }

  return (
    <DashboardShell
      title={`Welcome back${profile.name ? `, ${profile.name}` : ""}`}
      description="Track your reviews, complaints, saved businesses, and account activity."
    >
      <ProfileSummaryCard profile={profile} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink
          href="/dashboard/user/reviews"
          label="My reviews"
          count={profile.reviewCount}
        />
        <QuickLink
          href="/dashboard/user/complaints"
          label="My complaints"
          count={profile.complaintCount}
        />
        <QuickLink
          href="/dashboard/user/saved"
          label="Saved businesses"
          count={profile.savedCount}
        />
        <QuickLink href="/dashboard/user/settings" label="Settings" count={null} />
      </div>

      <NotificationsPanel notifications={notifications} />
    </DashboardShell>
  );
}

function QuickLink({
  href,
  label,
  count,
}: {
  href: string;
  label: string;
  count: number | null;
}) {
  return (
    <Link
      href={href}
      className="focus-visible:ring-ring min-h-11 rounded-xl border border-border bg-card p-4 no-underline transition-shadow hover:shadow-sm focus-visible:ring-2 focus-visible:outline-none"
    >
      <p className="text-foreground text-sm font-semibold">{label}</p>
      {count !== null ? (
        <p className="text-muted mt-1 text-2xl font-bold tabular-nums">{count}</p>
      ) : (
        <p className="text-muted mt-1 text-sm">Account</p>
      )}
    </Link>
  );
}
