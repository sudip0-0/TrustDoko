import { UserSubNav } from "@/components/dashboard/user-sub-nav";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <UserSubNav />
      {children}
    </div>
  );
}
