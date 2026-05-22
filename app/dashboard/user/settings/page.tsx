import type { Metadata } from "next";

import { AccountSettingsForm } from "@/components/dashboard/account-settings-form";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Account settings",
};

export default async function UserSettingsPage() {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  return (
    <DashboardShell
      title="Account settings"
      description="Manage how your name appears on TrustDoko."
    >
      <AccountSettingsForm name={user.name} email={user.email} />
    </DashboardShell>
  );
}
