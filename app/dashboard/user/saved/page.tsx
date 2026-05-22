import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SavedBusinessList } from "@/components/dashboard/saved-business-list";
import { getSessionUser } from "@/lib/auth/session";
import { getUserSavedBusinesses } from "@/server/queries/saved-businesses";

export const metadata: Metadata = {
  title: "Saved businesses",
};

export default async function UserSavedPage() {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  const saved = await getUserSavedBusinesses(user.id, user.id);

  return (
    <DashboardShell
      title="Saved businesses"
      description="Businesses you bookmarked to compare trust signals before you pay."
    >
      <SavedBusinessList items={saved} />
    </DashboardShell>
  );
}
