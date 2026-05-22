import { describe, expect, it } from "vitest";

import { computeProfileCompleteness } from "../profile-completeness";

describe("computeProfileCompleteness", () => {
  it("returns 0 when all fields are empty", () => {
    expect(
      computeProfileCompleteness({
        description: null,
        phone: null,
        email: null,
        websiteUrl: null,
        facebookUrl: null,
        instagramUrl: null,
        tiktokUrl: null,
        address: null,
        city: null,
        province: null,
      }),
    ).toBe(0);
  });

  it("returns 1 when all fields are filled", () => {
    expect(
      computeProfileCompleteness({
        description: "Shop",
        phone: "9800000000",
        email: "a@b.com",
        websiteUrl: "https://x.com",
        facebookUrl: "https://fb.com",
        instagramUrl: "https://ig.com",
        tiktokUrl: "https://tiktok.com",
        address: "Street",
        city: "KTM",
        province: "Bagmati",
      }),
    ).toBe(1);
  });
});
