import { requireAdminPage } from "@/lib/auth/require-admin-page";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
        <p className="text-muted mt-1 text-sm">
          Moderate reviews, complaints, claims, and platform accounts.
        </p>
      </div>
      <AdminNav />
      {children}
    </div>
  );
}
