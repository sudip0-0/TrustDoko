import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import type { BusinessProfileData } from "@/server/queries/business-profile";

type BusinessProfileComplaintsProps = {
  business: BusinessProfileData;
};

export function BusinessProfileComplaints({
  business,
}: BusinessProfileComplaintsProps) {
  const { complaintSummary } = business;
  const showCaution =
    complaintSummary.unresolved > 0 || complaintSummary.underReview > 0;

  return (
    <Card>
      <CardContent className="py-6">
        <h2 className="text-xl font-semibold">Complaint summary</h2>
        <p className="text-muted mt-1 text-sm leading-relaxed">
          Public counts only. Individual reports, proof, and admin notes stay
          private.
        </p>

        {complaintSummary.total === 0 ? (
          <p className="text-muted mt-4 text-sm">No complaints on record.</p>
        ) : (
          <ul className="text-muted mt-4 list-inside list-disc space-y-1 text-sm">
            <li>
              {complaintSummary.total} complaint
              {complaintSummary.total === 1 ? "" : "s"} reported
            </li>
            <li>{complaintSummary.resolved} resolved</li>
            <li>{complaintSummary.underReview} under review</li>
            <li>{complaintSummary.unresolved} unresolved complaints</li>
          </ul>
        )}

        {showCaution ? (
          <Alert variant="warning" className="mt-4">
            This business has unresolved complaints or reports under review.
            Check reviews and verify before paying.
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
