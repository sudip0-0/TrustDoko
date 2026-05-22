import type { Metadata } from "next";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Saved businesses</h1>
        <p className="text-muted mt-2 text-sm">
          Businesses you bookmarked for later comparison.
        </p>
      </div>
      <SavedBusinessList items={saved} />
    </div>
  );
}
