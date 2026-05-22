import { redirect } from "next/navigation";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { getSessionUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <DashboardNav user={user} />
      {children}
    </div>
  );
}
