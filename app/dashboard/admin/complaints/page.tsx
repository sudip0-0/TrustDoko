import type { Metadata } from "next";
import Link from "next/link";

import { AdminProofLink } from "@/components/admin/admin-proof-link";
import { ComplaintModerationActions } from "@/components/admin/complaint-moderation-actions";
import { ModerationStatusBadge } from "@/components/admin/moderation-status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { getComplaintsForModeration } from "@/server/queries/admin/complaints";

export const metadata: Metadata = {
  title: "Admin - Complaint moderation",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function AdminComplaintsPage() {
  const complaints = await getComplaintsForModeration();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Complaint moderation queue"
        description="Open community reports. Update status, add private admin notes, and view attached proof when provided."
      />

      {complaints.length === 0 ? (
        <EmptyState
          title="Queue is clear"
          description="No open complaints waiting for admin review."
        />
      ) : (
        <>
          <div className="border-border bg-card hidden overflow-x-auto rounded-xl border md:block">
            <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Complaints waiting for admin moderation
              </caption>
              <thead className="bg-muted/30 text-muted text-xs tracking-wide uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Business
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Complaint
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Reporter
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Proof
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {complaints.map((complaint) => (
                  <tr key={complaint.id} className="align-top">
                    <td className="w-52 px-4 py-4">
                      <Link
                        href={`/businesses/${complaint.businessSlug}`}
                        className="text-foreground hover:text-primary font-semibold no-underline"
                      >
                        {complaint.businessName}
                      </Link>
                      <p className="text-muted mt-1 text-xs">
                        {formatDate(complaint.createdAt)}
                      </p>
                    </td>
                    <td className="max-w-md px-4 py-4">
                      <p className="text-foreground font-medium">
                        {formatCategory(complaint.category)}
                      </p>
                      <p className="text-muted mt-1 line-clamp-3 leading-relaxed">
                        {complaint.summary}
                      </p>
                      {complaint.adminNote ? (
                        <p className="bg-muted/30 text-muted mt-2 rounded-lg px-3 py-2 text-xs">
                          <span className="text-foreground font-medium">
                            Admin note:
                          </span>{" "}
                          {complaint.adminNote}
                        </p>
                      ) : null}
                    </td>
                    <td className="w-52 px-4 py-4">
                      <p className="text-foreground font-medium">
                        {complaint.severity}
                      </p>
                      <p className="text-muted mt-1 text-xs break-all">
                        {complaint.authorEmail}
                      </p>
                    </td>
                    <td className="w-40 px-4 py-4">
                      <ModerationStatusBadge status={complaint.status} />
                    </td>
                    <td className="w-28 px-4 py-4">
                      {complaint.proofFileId ? (
                        <AdminProofLink proofFileId={complaint.proofFileId} />
                      ) : (
                        <span className="text-muted text-xs">None</span>
                      )}
                    </td>
                    <td className="w-80 px-4 py-4">
                      <ComplaintModerationActions
                        complaintId={complaint.id}
                        currentStatus={complaint.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="list-none space-y-4 p-0 md:hidden">
            {complaints.map((complaint) => (
              <li
                key={complaint.id}
                className="border-border bg-card rounded-xl border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/businesses/${complaint.businessSlug}`}
                      className="text-foreground hover:text-primary font-semibold no-underline"
                    >
                      {complaint.businessName}
                    </Link>
                    <p className="text-muted mt-1 text-xs">
                      {formatCategory(complaint.category)} -{" "}
                      {formatDate(complaint.createdAt)}
                    </p>
                  </div>
                  <ModerationStatusBadge status={complaint.status} />
                </div>
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  {complaint.summary}
                </p>
                {complaint.adminNote ? (
                  <p className="bg-muted/30 text-muted mt-3 rounded-lg px-3 py-2 text-xs">
                    <span className="text-foreground font-medium">
                      Admin note:
                    </span>{" "}
                    {complaint.adminNote}
                  </p>
                ) : null}
                <dl className="mt-3 grid gap-2 text-xs">
                  <div>
                    <dt className="text-foreground font-medium">Reporter</dt>
                    <dd className="text-muted break-all">
                      {complaint.authorEmail}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-foreground font-medium">Severity</dt>
                    <dd className="text-muted">{complaint.severity}</dd>
                  </div>
                  <div>
                    <dt className="text-foreground font-medium">Proof</dt>
                    <dd>
                      {complaint.proofFileId ? (
                        <AdminProofLink proofFileId={complaint.proofFileId} />
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </dd>
                  </div>
                </dl>
                <ComplaintModerationActions
                  complaintId={complaint.id}
                  currentStatus={complaint.status}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
