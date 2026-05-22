import { ComplaintStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { canTransitionComplaintStatus } from "@/lib/complaints/status-transitions";

describe("canTransitionComplaintStatus", () => {
  it("allows SUBMITTED to UNDER_REVIEW or REJECTED", () => {
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.SUBMITTED,
        ComplaintStatus.UNDER_REVIEW,
      ),
    ).toBe(true);
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.SUBMITTED,
        ComplaintStatus.REJECTED,
      ),
    ).toBe(true);
  });

  it("blocks owner-style resolve from SUBMITTED", () => {
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.SUBMITTED,
        ComplaintStatus.RESOLVED,
      ),
    ).toBe(false);
  });

  it("allows BUSINESS_RESPONDED to RESOLVED or UNRESOLVED", () => {
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.BUSINESS_RESPONDED,
        ComplaintStatus.RESOLVED,
      ),
    ).toBe(true);
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.BUSINESS_RESPONDED,
        ComplaintStatus.UNRESOLVED,
      ),
    ).toBe(true);
  });

  it("blocks transitions from terminal RESOLVED", () => {
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.RESOLVED,
        ComplaintStatus.UNDER_REVIEW,
      ),
    ).toBe(false);
  });
});
