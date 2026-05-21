import type { Metadata } from "next";

import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Your dashboard",
};

export default async function UserDashboardPage() {
  const user = await getSessionUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your dashboard</h1>
        <p className="text-muted mt-2">
          Signed in as {user?.email} ({user?.role})
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Coming soon</h2>
        <ul className="text-muted mt-3 list-inside list-disc space-y-1 text-sm">
          <li>Your submitted reviews</li>
          <li>Your complaint reports</li>
          <li>Account settings</li>
        </ul>
      </section>
    </div>
  );
}
