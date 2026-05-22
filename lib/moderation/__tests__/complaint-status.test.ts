import { ComplaintCategory, ComplaintStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  containsEscalationLanguage,
  determineInitialComplaintStatus,
} from "@/lib/moderation/complaint-status";

describe("determineInitialComplaintStatus", () => {
  it("returns SUBMITTED for low-severity categories", () => {
    expect(
      determineInitialComplaintStatus(
        ComplaintCategory.POOR_SERVICE,
        "The staff was rude during my visit.",
      ),
    ).toBe(ComplaintStatus.SUBMITTED);
  });

  it("returns UNDER_REVIEW for high-severity categories", () => {
    expect(
      determineInitialComplaintStatus(
        ComplaintCategory.HARASSMENT,
        "Staff used abusive language toward me.",
      ),
    ).toBe(ComplaintStatus.UNDER_REVIEW);
  });

  it("returns UNDER_REVIEW when description contains escalation language", () => {
    expect(
      determineInitialComplaintStatus(
        ComplaintCategory.OTHER,
        "This was clear fraud and they threatened me.",
      ),
    ).toBe(ComplaintStatus.UNDER_REVIEW);
  });
});

describe("containsEscalationLanguage", () => {
  it("detects escalation phrases", () => {
    expect(containsEscalationLanguage("They committed fraud")).toBe(true);
  });

  it("returns false for neutral text", () => {
    expect(containsEscalationLanguage("Delivery was late")).toBe(false);
  });
});
