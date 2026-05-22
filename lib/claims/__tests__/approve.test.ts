import { BusinessClaimMethod, VerificationStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { verificationStatusForClaimMethod } from "@/lib/claims/approve";

describe("verificationStatusForClaimMethod", () => {
  it("maps document method to document verified", () => {
    expect(verificationStatusForClaimMethod(BusinessClaimMethod.DOCUMENT)).toBe(
      VerificationStatus.DOCUMENT_VERIFIED,
    );
  });

  it("maps phone to contact verified", () => {
    expect(verificationStatusForClaimMethod(BusinessClaimMethod.PHONE)).toBe(
      VerificationStatus.CONTACT_VERIFIED,
    );
  });

  it("maps social to social verified", () => {
    expect(verificationStatusForClaimMethod(BusinessClaimMethod.SOCIAL)).toBe(
      VerificationStatus.SOCIAL_VERIFIED,
    );
  });
});
