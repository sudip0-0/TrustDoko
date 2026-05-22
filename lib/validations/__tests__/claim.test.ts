import { describe, expect, it } from "vitest";

import { submitClaimSchema } from "@/lib/validations/claim";

const validClaim = {
  businessSlug: "sample-kathmandu-threads",
  ownerName: "Ram Sharma",
  ownerEmail: "ram@example.com",
  ownerPhone: "+9779800000000",
  method: "EMAIL",
  message:
    "I operate this business and can verify ownership through our official email inbox.",
};

describe("submitClaimSchema", () => {
  it("accepts a valid claim", () => {
    const parsed = submitClaimSchema.parse(validClaim);
    expect(parsed.ownerName).toBe("Ram Sharma");
    expect(parsed.method).toBe("EMAIL");
  });

  it("rejects short message", () => {
    const result = submitClaimSchema.safeParse({
      ...validClaim,
      message: "Too short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = submitClaimSchema.safeParse({
      ...validClaim,
      ownerEmail: "not-an-email",
    });
    expect(result.success).toBe(false);
  });
});
