import { describe, expect, it } from "vitest";

import { businessResponseTargetSchema } from "@/lib/business-responses/target";

describe("businessResponseTargetSchema", () => {
  it("accepts a review response target", () => {
    expect(
      businessResponseTargetSchema.safeParse({ reviewId: "review-1" }).success,
    ).toBe(true);
  });

  it("accepts a complaint response target", () => {
    expect(
      businessResponseTargetSchema.safeParse({ complaintId: "complaint-1" })
        .success,
    ).toBe(true);
  });

  it("rejects missing target", () => {
    expect(businessResponseTargetSchema.safeParse({}).success).toBe(false);
  });

  it("rejects two targets", () => {
    expect(
      businessResponseTargetSchema.safeParse({
        reviewId: "review-1",
        complaintId: "complaint-1",
      }).success,
    ).toBe(false);
  });
});
