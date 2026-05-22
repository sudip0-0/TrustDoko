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

  it("allows UNDER_REVIEW to admin and owner outcomes", () => {
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.UNDER_REVIEW,
        ComplaintStatus.BUSINESS_RESPONDED,
      ),
    ).toBe(true);
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.UNDER_REVIEW,
        ComplaintStatus.RESOLVED,
      ),
    ).toBe(true);
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.UNDER_REVIEW,
        ComplaintStatus.UNRESOLVED,
      ),
    ).toBe(true);
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.UNDER_REVIEW,
        ComplaintStatus.REJECTED,
      ),
    ).toBe(true);
  });

  it("allows UNRESOLVED to reopen or resolve", () => {
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.UNRESOLVED,
        ComplaintStatus.UNDER_REVIEW,
      ),
    ).toBe(true);
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.UNRESOLVED,
        ComplaintStatus.RESOLVED,
      ),
    ).toBe(true);
  });

  it("blocks transitions from terminal REJECTED", () => {
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.REJECTED,
        ComplaintStatus.UNDER_REVIEW,
      ),
    ).toBe(false);
  });

  it("allows identity transitions", () => {
    expect(
      canTransitionComplaintStatus(
        ComplaintStatus.SUBMITTED,
        ComplaintStatus.SUBMITTED,
      ),
    ).toBe(true);
  });
});
