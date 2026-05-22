import { ReviewStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  containsRiskyReviewLanguage,
  determineReviewStatus,
} from "@/lib/moderation/review-status";

describe("containsRiskyReviewLanguage", () => {
  it("detects scam and fraud phrases", () => {
    expect(containsRiskyReviewLanguage("This is a total scam")).toBe(true);
    expect(containsRiskyReviewLanguage("Possible fraud on delivery")).toBe(true);
  });

  it("ignores safe wording", () => {
    expect(containsRiskyReviewLanguage("Great service and fast delivery")).toBe(
      false,
    );
  });

  it("avoids substring false positives", () => {
    expect(containsRiskyReviewLanguage("scamper around the store")).toBe(false);
  });
});

describe("determineReviewStatus", () => {
  it("approves normal reviews", () => {
    expect(
      determineReviewStatus("Good shop", "Reliable seller with fair prices."),
    ).toBe(ReviewStatus.APPROVED);
  });

  it("pending for risky reviews", () => {
    expect(
      determineReviewStatus("Warning", "This seller is a scam artist."),
    ).toBe(ReviewStatus.PENDING);
  });
});
