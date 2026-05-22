import { ComplaintCategory, ComplaintSeverity } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { getComplaintSeverity } from "@/lib/complaints/severity";

describe("getComplaintSeverity", () => {
  it("maps high-risk categories to HIGH", () => {
    expect(getComplaintSeverity(ComplaintCategory.FAKE_PRODUCT)).toBe(
      ComplaintSeverity.HIGH,
    );
    expect(getComplaintSeverity(ComplaintCategory.HARASSMENT)).toBe(
      ComplaintSeverity.HIGH,
    );
  });

  it("maps common order issues to MEDIUM", () => {
    expect(getComplaintSeverity(ComplaintCategory.NON_DELIVERY)).toBe(
      ComplaintSeverity.MEDIUM,
    );
    expect(getComplaintSeverity(ComplaintCategory.REFUND_ISSUE)).toBe(
      ComplaintSeverity.MEDIUM,
    );
  });

  it("maps other categories to LOW", () => {
    expect(getComplaintSeverity(ComplaintCategory.OTHER)).toBe(
      ComplaintSeverity.LOW,
    );
  });
});
