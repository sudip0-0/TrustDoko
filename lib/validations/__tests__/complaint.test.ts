import { describe, expect, it } from "vitest";

import { submitComplaintSchema } from "@/lib/validations/complaint";

const validComplaint = {
  category: "NON_DELIVERY",
  description:
    "I ordered a product three weeks ago and it still has not arrived despite repeated follow-ups with the seller.",
  experienceDate: "2026-01-15",
  allowAdminContact: "true",
};

describe("submitComplaintSchema", () => {
  it("accepts a valid complaint", () => {
    const parsed = submitComplaintSchema.parse({
      ...validComplaint,
      businessSlug: "sample-valley-mobile-hub",
      amountRange: "AMOUNT_1000_5000",
    });
    expect(parsed.category).toBe("NON_DELIVERY");
    expect(parsed.allowAdminContact).toBe(true);
    expect(parsed.amountRange).toBe("AMOUNT_1000_5000");
  });

  it("rejects description shorter than 30 characters", () => {
    const result = submitComplaintSchema.safeParse({
      ...validComplaint,
      description: "Too short",
      businessSlug: "sample-valley-mobile-hub",
    });
    expect(result.success).toBe(false);
  });

  it("rejects future experience date", () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const result = submitComplaintSchema.safeParse({
      ...validComplaint,
      experienceDate: future.toISOString().slice(0, 10),
      businessSlug: "sample-valley-mobile-hub",
    });
    expect(result.success).toBe(false);
  });

  it("requires category", () => {
    const result = submitComplaintSchema.safeParse({
      ...validComplaint,
      category: "",
      businessSlug: "sample-valley-mobile-hub",
    });
    expect(result.success).toBe(false);
  });
});
