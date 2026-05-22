import type { Metadata } from "next";

import { UserComplaintsList } from "@/components/dashboard/user-complaints-list";
import { getSessionUser } from "@/lib/auth/session";
import { getDashboardComplaints } from "@/server/queries/complaints";

export const metadata: Metadata = {
  title: "My complaints",
};

export default async function UserComplaintsPage() {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  const complaints = await getDashboardComplaints(user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My complaints</h1>
        <p className="text-muted mt-2 text-sm">
          Serious issues you reported and how they are being handled.
        </p>
      </div>
      <UserComplaintsList complaints={complaints} />
    </div>
  );
}
