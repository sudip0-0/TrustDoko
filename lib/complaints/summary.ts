import { ComplaintStatus } from "@prisma/client";

export type ComplaintSummaryCounts = {
  total: number;
  resolved: number;
  underReview: number;
  unresolved: number;
};

export type ComplaintStatusCountRow = {
  status: ComplaintStatus;
  count: number;
};

export function buildComplaintSummaryFromCounts(
  rows: ComplaintStatusCountRow[],
): ComplaintSummaryCounts {
  let resolved = 0;
  let underReview = 0;
  let unresolved = 0;

  for (const row of rows) {
    switch (row.status) {
      case ComplaintStatus.RESOLVED:
        resolved = row.count;
        break;
      case ComplaintStatus.UNDER_REVIEW:
        underReview = row.count;
        break;
      case ComplaintStatus.SUBMITTED:
      case ComplaintStatus.BUSINESS_RESPONDED:
      case ComplaintStatus.UNRESOLVED:
        unresolved += row.count;
        break;
      case ComplaintStatus.REJECTED:
        break;
      default: {
        const _exhaustive: never = row.status;
        void _exhaustive;
      }
    }
  }

  return {
    total: resolved + underReview + unresolved,
    resolved,
    underReview,
    unresolved,
  };
}
