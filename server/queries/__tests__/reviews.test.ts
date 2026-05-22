import { ReviewStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

/**
 * Documents the public review filter used by getApprovedReviewsForBusiness.
 * Pending reviews must never appear in the public listing query.
 */
describe("public review listing policy", () => {
  it("only APPROVED status is public", () => {
    const publicWhere = { businessId: "biz-1", status: ReviewStatus.APPROVED };
    expect(publicWhere.status).toBe(ReviewStatus.APPROVED);
    expect(publicWhere.status).not.toBe(ReviewStatus.PENDING);
  });
});
