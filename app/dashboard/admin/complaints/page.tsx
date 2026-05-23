import type { Metadata } from "next";
import Link from "next/link";

import { AdminProofLink } from "@/components/admin/admin-proof-link";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ComplaintModerationActions } from "@/components/admin/complaint-moderation-actions";
import { ModerationStatusBadge } from "@/components/admin/moderation-status-badge";
import { getComplaintsForModeration } from "@/server/queries/admin/complaints";

export const metadata: Metadata = {
  title: "Admin — Complaint moderation",
};

export default async function AdminComplaintsPage() {
  const complaints = await getComplaintsForModeration();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="type-h3">Complaint moderation queue</h2>
        <p className="text-muted mt-1 text-sm">
          Open community reports. Update status, add private admin notes, and
          view attached proof when provided.
        </p>
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          title="Queue is clear"
          description="No open complaints waiting for admin review."
        />
      ) : (
        <ul className="list-none space-y-6 p-0">
          {complaints.map((complaint) => (
            <li
              key={complaint.id}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/businesses/${complaint.businessSlug}`}
                    className="text-foreground font-semibold no-underline hover:text-primary"
                  >
                    {complaint.businessName}
                  </Link>
                  <p className="text-muted mt-1 text-sm">
                    {complaint.category.replace(/_/g, " ")} ·{" "}
                    {complaint.severity} · {complaint.authorEmail} ·{" "}
                    {complaint.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <ModerationStatusBadge status={complaint.status} />
              </div>
              <p className="text-foreground mt-3 font-medium">
                {complaint.summary}
              </p>
              {complaint.adminNote ? (
                <p className="text-muted mt-2 rounded-md bg-muted/30 px-3 py-2 text-sm">
                  <span className="font-medium">Admin note:</span>{" "}
                  {complaint.adminNote}
                </p>
              ) : null}
              {complaint.proofFileId ? (
                <p className="mt-3">
                  <AdminProofLink proofFileId={complaint.proofFileId} />
                </p>
              ) : null}
              <ComplaintModerationActions
                complaintId={complaint.id}
                currentStatus={complaint.status}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
