import { describe, expect, it } from "vitest";

import { updateBusinessProfileSchema } from "@/lib/validations/business-profile";

describe("updateBusinessProfileSchema", () => {
  it("accepts valid owner profile updates", () => {
    const parsed = updateBusinessProfileSchema.safeParse({
      businessId: "biz-1",
      description: "Updated description for our shop.",
      phone: "+9779800000000",
      email: "shop@example.com",
      websiteUrl: "https://example.com",
      city: "Kathmandu",
      businessType: "ONLINE_ONLY",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid email and missing business id", () => {
    const missingId = updateBusinessProfileSchema.safeParse({
      businessId: "",
      email: "shop@example.com",
    });
    expect(missingId.success).toBe(false);

    const badEmail = updateBusinessProfileSchema.safeParse({
      businessId: "biz-1",
      email: "not-an-email",
    });
    expect(badEmail.success).toBe(false);
  });

  it("normalizes empty optional fields to null", () => {
    const parsed = updateBusinessProfileSchema.parse({
      businessId: "biz-1",
      description: "",
      websiteUrl: "",
      email: "",
    });
    expect(parsed.description).toBeNull();
    expect(parsed.websiteUrl).toBeNull();
    expect(parsed.email).toBeNull();
  });
});
