import { describe, expect, it } from "vitest";

import {
  moderateReviewSchema,
  updateComplaintModerationSchema,
  updateUserModerationSchema,
} from "../admin";

describe("admin validations", () => {
  it("accepts valid review moderation actions", () => {
    for (const action of [
      "approve",
      "reject",
      "flag",
      "under_review",
      "delete",
    ] as const) {
      const parsed = moderateReviewSchema.safeParse({
        reviewId: "rev-1",
        action,
      });
      expect(parsed.success).toBe(true);
    }
  });

  it("rejects unknown review actions", () => {
    const parsed = moderateReviewSchema.safeParse({
      reviewId: "rev-1",
      action: "ban",
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts complaint status updates with admin note", () => {
    const parsed = updateComplaintModerationSchema.safeParse({
      complaintId: "c-1",
      status: "RESOLVED",
      adminNote: "Verified with both parties.",
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts user trust level updates", () => {
    const parsed = updateUserModerationSchema.safeParse({
      userId: "u-1",
      trustLevel: "FLAGGED",
    });
    expect(parsed.success).toBe(true);
  });
});
