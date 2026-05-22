import { ClaimStatus, VerificationStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { getVerificationBadgeDisplay } from "@/lib/business/verification-display";

describe("getVerificationBadgeDisplay", () => {
  it("returns Unverified for unclaimed business", () => {
    expect(
      getVerificationBadgeDisplay(ClaimStatus.UNCLAIMED, VerificationStatus.UNVERIFIED),
    ).toMatchObject({ key: "UNVERIFIED", label: "Unverified" });
  });

  it("returns Claimed when claimed but not verified", () => {
    expect(
      getVerificationBadgeDisplay(ClaimStatus.CLAIMED, VerificationStatus.UNVERIFIED),
    ).toMatchObject({ key: "CLAIMED", label: "Claimed" });
  });

  it("returns Contact verified", () => {
    expect(
      getVerificationBadgeDisplay(
        ClaimStatus.CLAIMED,
        VerificationStatus.CONTACT_VERIFIED,
      ),
    ).toMatchObject({ key: "CONTACT_VERIFIED", label: "Contact verified" });
  });

  it("returns Trusted seller as highest tier", () => {
    expect(
      getVerificationBadgeDisplay(
        ClaimStatus.CLAIMED,
        VerificationStatus.TRUSTED_SELLER,
      ),
    ).toMatchObject({ key: "TRUSTED_SELLER", label: "Trusted seller" });
  });
});
