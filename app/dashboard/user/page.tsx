import type { Metadata } from "next";

import { QuickLink } from "@/components/dashboard/quick-link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";
import { ProfileSummaryCard } from "@/components/dashboard/profile-summary-card";
import { getSessionUser } from "@/lib/auth/session";
import {
  getUserNotifications,
  getUserProfileSummary,
} from "@/server/queries/user-dashboard";
import { notFound } from "next/navigation";

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

      <section aria-labelledby="quick-links-heading">
        <h2 id="quick-links-heading" className="text-foreground mb-3 text-sm font-semibold">
          Quick links
        </h2>
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
          <QuickLink
            href="/dashboard/user/settings"
            label="Settings"
            hint="Account & privacy"
          />
        </div>
      </section>

      <NotificationsPanel notifications={notifications} />
    </DashboardShell>
  );
}
