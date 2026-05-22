import type { Metadata } from "next";

import { UserTrustActions } from "@/components/admin/user-trust-actions";
import { ModerationStatusBadge } from "@/components/admin/moderation-status-badge";
import { getUsersForAdmin } from "@/server/queries/admin/users";

export const metadata: Metadata = {
  title: "Admin — Users",
};

export default async function AdminUsersPage() {
  const users = await getUsersForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">User management</h2>
        <p className="text-muted mt-1 text-sm">
          Review accounts and flag suspicious activity via trust level. Role
          changes are not exposed in MVP to reduce privilege-escalation risk.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Trust level</th>
              <th className="px-4 py-3 font-medium">Activity</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{u.name ?? "—"}</p>
                  <p className="text-muted text-xs">{u.email}</p>
                </td>
                <td className="text-muted px-4 py-3">{u.role}</td>
                <td className="px-4 py-3">
                  <ModerationStatusBadge status={u.trustLevel} />
                </td>
                <td className="text-muted px-4 py-3">
                  {u.reviewCount} reviews · {u.complaintCount} complaints
                </td>
                <td className="px-4 py-3">
                  <UserTrustActions
                    userId={u.id}
                    currentTrustLevel={u.trustLevel}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
