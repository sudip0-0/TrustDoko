import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ModerationStatusBadge } from "@/components/admin/moderation-status-badge";
import type { UserComplaintListItem } from "@/server/queries/complaints";

type UserComplaintsListProps = {
  complaints: UserComplaintListItem[];
};

export function UserComplaintsList({ complaints }: UserComplaintsListProps) {
  if (complaints.length === 0) {
    return (
      <EmptyState
        title="No complaints filed"
        description="Report serious issues like non-delivery or misleading listings. Complaints are reviewed before they affect public trust signals."
        action={{ href: "/businesses", label: "Browse businesses" }}
      />
    );
  }

  return (
    <ul className="list-none space-y-4 p-0">
      {complaints.map((complaint) => (
        <li
          key={complaint.id}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <Link
                href={`/businesses/${complaint.businessSlug}#report-issue`}
                className="text-foreground font-semibold no-underline hover:text-primary"
              >
                {complaint.businessName}
              </Link>
              <p className="text-muted mt-1 text-sm">
                {complaint.categoryLabel} ·{" "}
                {complaint.createdAt.toLocaleDateString()}
              </p>
            </div>
            <ModerationStatusBadge status={complaint.status} />
          </div>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            {complaint.summary}
          </p>
        </li>
      ))}
    </ul>
  );
}
