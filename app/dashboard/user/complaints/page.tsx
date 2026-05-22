import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
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
    <DashboardShell
      title="My complaints"
      description="Serious issues you reported and how they are being handled."
    >
      <UserComplaintsList complaints={complaints} />
    </DashboardShell>
  );
}
