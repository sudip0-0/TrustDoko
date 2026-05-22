import { ComplaintStatus } from "@prisma/client";

const ALLOWED_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  [ComplaintStatus.SUBMITTED]: [
    ComplaintStatus.UNDER_REVIEW,
    ComplaintStatus.REJECTED,
  ],
  [ComplaintStatus.UNDER_REVIEW]: [
    ComplaintStatus.BUSINESS_RESPONDED,
    ComplaintStatus.RESOLVED,
    ComplaintStatus.UNRESOLVED,
    ComplaintStatus.REJECTED,
  ],
  [ComplaintStatus.BUSINESS_RESPONDED]: [
    ComplaintStatus.RESOLVED,
    ComplaintStatus.UNRESOLVED,
    ComplaintStatus.UNDER_REVIEW,
  ],
  [ComplaintStatus.RESOLVED]: [],
  [ComplaintStatus.UNRESOLVED]: [ComplaintStatus.UNDER_REVIEW, ComplaintStatus.RESOLVED],
  [ComplaintStatus.REJECTED]: [],
};

export function canTransitionComplaintStatus(
  from: ComplaintStatus,
  to: ComplaintStatus,
): boolean {
  if (from === to) {
    return true;
  }
  return ALLOWED_TRANSITIONS[from].includes(to);
}
