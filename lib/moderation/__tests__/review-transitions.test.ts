import { ReviewStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { canTransitionReviewStatus } from "../review-transitions";

describe("canTransitionReviewStatus", () => {
  it("allows approve from pending", () => {
    expect(
      canTransitionReviewStatus(ReviewStatus.PENDING, ReviewStatus.APPROVED),
    ).toBe(true);
  });

  it("allows flag from approved", () => {
    expect(
      canTransitionReviewStatus(ReviewStatus.APPROVED, ReviewStatus.FLAGGED),
    ).toBe(true);
  });

  it("disallows approve from rejected to pending", () => {
    expect(
      canTransitionReviewStatus(ReviewStatus.REJECTED, ReviewStatus.PENDING),
    ).toBe(false);
  });
});
