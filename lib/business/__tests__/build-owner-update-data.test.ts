import { describe, expect, it } from "vitest";

import { buildOwnerUpdateData } from "@/lib/business/build-owner-update-data";

describe("buildOwnerUpdateData", () => {
  it("only includes allowlisted profile fields", () => {
    const data = buildOwnerUpdateData({
      businessId: "biz-1",
      description: "Updated description",
      phone: "9800000000",
      email: "shop@example.com",
      websiteUrl: "https://example.com",
      facebookUrl: null,
      instagramUrl: null,
      tiktokUrl: null,
      address: null,
      city: "Kathmandu",
      province: "Bagmati",
      businessType: "ONLINE_ONLY",
    });

    expect(data).toEqual({
      description: "Updated description",
      phone: "9800000000",
      email: "shop@example.com",
      websiteUrl: "https://example.com",
      facebookUrl: null,
      instagramUrl: null,
      tiktokUrl: null,
      address: null,
      city: "Kathmandu",
      province: "Bagmati",
      businessType: "ONLINE_ONLY",
    });
    expect("name" in data).toBe(false);
    expect("trustScore" in data).toBe(false);
  });
});
