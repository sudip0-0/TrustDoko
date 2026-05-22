import type { ClaimStatus } from "@prisma/client";

import { OwnerComplaintResponseForm } from "@/components/complaints/owner-complaint-response-form";
import { canManageBusiness } from "@/lib/permissions/business";
import type { SessionUser } from "@/types/auth";
import {
  getOwnerComplaintsForBusiness,
  type OwnerComplaintListItem,
} from "@/server/queries/complaints";

type OwnerComplaintsPanelProps = {
  businessId: string;
  businessName: string;
  sessionUser: SessionUser;
  business: {
    claimedByUserId: string | null;
    claimStatus: ClaimStatus;
  };
};

function ComplaintOwnerCard({ complaint }: { complaint: OwnerComplaintListItem }) {
  return (
    <li className="rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">{complaint.categoryLabel}</span>
        <span className="text-muted text-xs">{complaint.statusLabel}</span>
      </div>
      <p className="text-muted mt-2 text-xs">
        Reported {complaint.createdAt.toLocaleDateString()} · Experience{" "}
        {complaint.experienceDate.toLocaleDateString()}
      </p>
      <p className="mt-2 text-sm leading-relaxed">{complaint.description}</p>
      {complaint.hasResponse && complaint.responseBody ? (
        <div className="mt-3 rounded-md bg-muted/40 px-3 py-2 text-sm">
          <p className="text-muted text-xs font-medium">Your response</p>
          <p className="mt-1">{complaint.responseBody}</p>
        </div>
      ) : (
        <OwnerComplaintResponseForm complaintId={complaint.id} />
      )}
    </li>
  );
}

export async function OwnerComplaintsPanel({
  businessId,
  businessName,
  sessionUser,
  business,
}: OwnerComplaintsPanelProps) {
  if (!canManageBusiness(sessionUser, business)) {
    return null;
  }

  const complaints = await getOwnerComplaintsForBusiness(
    businessId,
    sessionUser,
    business,
  );

  if (complaints.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-xl font-semibold">Complaints on {businessName}</h2>
      <p className="text-muted mt-1 text-sm leading-relaxed">
        As the claimed owner, you can respond to community complaints. Details are
        private to you and TrustDoko admins.
      </p>
      <ul className="mt-4 space-y-4">
        {complaints.map((complaint) => (
          <ComplaintOwnerCard key={complaint.id} complaint={complaint} />
        ))}
      </ul>
    </section>
  );
}
