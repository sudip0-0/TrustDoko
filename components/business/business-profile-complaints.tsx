import type { BusinessProfileData } from "@/server/queries/business-profile";

type BusinessProfileComplaintsProps = {
  business: BusinessProfileData;
};

export function BusinessProfileComplaints({
  business,
}: BusinessProfileComplaintsProps) {
  const { complaintSummary } = business;

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-xl font-semibold">Complaint summary</h2>
      <p className="text-muted mt-1 text-sm leading-relaxed">
        Public summary only. Individual complaints are moderated and details stay
        private unless approved for display.
      </p>

      {complaintSummary.total === 0 ? (
        <p className="text-muted mt-4 text-sm">No complaints on record.</p>
      ) : (
        <ul className="text-muted mt-4 list-inside list-disc space-y-1 text-sm">
          <li>
            {complaintSummary.total} complaint
            {complaintSummary.total === 1 ? "" : "s"} reported
          </li>
          <li>
            {complaintSummary.unresolved} unresolved or in progress
          </li>
          <li>{complaintSummary.resolved} marked resolved</li>
        </ul>
      )}

      {complaintSummary.unresolved > 0 ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          This business has recent unresolved complaint reports. Read reviews and
          verify before paying.
        </p>
      ) : null}
    </section>
  );
}
