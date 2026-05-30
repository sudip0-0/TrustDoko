import { describe, expect, it } from "vitest";

import { hasRecentNegativeTrend } from "../recent-trend";

describe("hasRecentNegativeTrend", () => {
  it("returns false without enough recent reviews", () => {
    expect(
      hasRecentNegativeTrend(
        { count: 1, averageRating: 2 },
        { count: 5, averageRating: 5 },
      ),
    ).toBe(false);
  });

  it("returns false without an older baseline", () => {
    expect(
      hasRecentNegativeTrend(
        { count: 4, averageRating: 2 },
        { count: 0, averageRating: 0 },
      ),
    ).toBe(false);
  });

  it("flags a half-star or larger drop versus the older average", () => {
    expect(
      hasRecentNegativeTrend(
        { count: 3, averageRating: 3.5 },
        { count: 4, averageRating: 4.0 },
      ),
    ).toBe(true);
  });

  it("does not flag a drop smaller than half a star", () => {
    expect(
      hasRecentNegativeTrend(
        { count: 3, averageRating: 3.8 },
        { count: 4, averageRating: 4.0 },
      ),
    ).toBe(false);
  });

  it("does not flag improving or steady ratings", () => {
    expect(
      hasRecentNegativeTrend(
        { count: 3, averageRating: 4.5 },
        { count: 4, averageRating: 4.0 },
      ),
    ).toBe(false);
  });
});
