import type { Metadata } from "next";

import { AccountSettingsForm } from "@/components/dashboard/account-settings-form";
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account settings</h1>
        <p className="text-muted mt-2 text-sm">
          Manage how your name appears on TrustDoko.
        </p>
      </div>
      <AccountSettingsForm name={user.name} email={user.email} />
    </div>
  );
}
