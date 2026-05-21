import { describe, expect, it } from "vitest";

import {
  buildBusinessWhere,
  hasActiveBusinessFilters,
} from "@/lib/search/business-filters";
import {
  buildBusinessListQueryString,
  businessListFiltersSchema,
} from "@/lib/validations/business-list";

describe("buildBusinessWhere", () => {
  it("includes social URLs and category name in keyword search", () => {
    const where = buildBusinessWhere({ page: 1, q: "instagram", sort: "trust" });

    expect(where.OR).toEqual(
      expect.arrayContaining([
        { name: { contains: "instagram", mode: "insensitive" } },
        { category: { name: { contains: "instagram", mode: "insensitive" } } },
        { instagramUrl: { contains: "instagram", mode: "insensitive" } },
        { facebookUrl: { contains: "instagram", mode: "insensitive" } },
        { tiktokUrl: { contains: "instagram", mode: "insensitive" } },
        { websiteUrl: { contains: "instagram", mode: "insensitive" } },
      ]),
    );
  });
});

describe("businessListFiltersSchema", () => {
  it("defaults sort to trust", () => {
    const parsed = businessListFiltersSchema.parse({ page: "1" });
    expect(parsed.sort).toBe("trust");
  });
});

describe("hasActiveBusinessFilters", () => {
  it("returns true when sort is not default", () => {
    expect(
      hasActiveBusinessFilters({ page: 1, sort: "newest" }),
    ).toBe(true);
  });

  it("returns false when only default sort is set", () => {
    expect(hasActiveBusinessFilters({ page: 1, sort: "trust" })).toBe(false);
  });
});

describe("buildBusinessListQueryString", () => {
  it("includes non-default sort in query string", () => {
    const query = buildBusinessListQueryString({
      page: 1,
      sort: "rating",
    });
    expect(query).toContain("sort=rating");
  });

  it("omits default trust sort from query string", () => {
    const query = buildBusinessListQueryString({
      page: 1,
      sort: "trust",
    });
    expect(query).not.toContain("sort=");
  });
});
