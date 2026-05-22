import { ComplaintStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { buildComplaintSummaryFromCounts } from "@/lib/complaints/summary";

describe("buildComplaintSummaryFromCounts", () => {
  it("computes four non-overlapping buckets", () => {
    const summary = buildComplaintSummaryFromCounts([
      { status: ComplaintStatus.SUBMITTED, count: 2 },
      { status: ComplaintStatus.UNDER_REVIEW, count: 1 },
      { status: ComplaintStatus.BUSINESS_RESPONDED, count: 1 },
      { status: ComplaintStatus.UNRESOLVED, count: 1 },
      { status: ComplaintStatus.RESOLVED, count: 3 },
      { status: ComplaintStatus.REJECTED, count: 5 },
    ]);

    expect(summary).toEqual({
      total: 8,
      resolved: 3,
      underReview: 1,
      unresolved: 4,
    });
  });

  it("returns zeros when no complaints", () => {
    expect(buildComplaintSummaryFromCounts([])).toEqual({
      total: 0,
      resolved: 0,
      underReview: 0,
      unresolved: 0,
    });
  });
});
