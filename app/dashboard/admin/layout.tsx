import { requireAdminPage } from "@/lib/auth/require-admin-page";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return (
    <div className="dashboard-surface mx-auto w-full max-w-6xl">
      <div className="mb-6 border-b border-border pb-6">
        <p className="text-primary mb-2 text-xs font-semibold tracking-wide uppercase">
          Moderation
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin</h1>
        <p className="text-muted mt-2 text-sm leading-relaxed">
          Moderate reviews, complaints, claims, and platform accounts.
        </p>
      </div>
      <AdminNav />
      {children}
    </div>
  );
}
