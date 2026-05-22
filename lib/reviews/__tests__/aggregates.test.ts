import { describe, expect, it } from "vitest";

import { computeAverageRating } from "@/lib/reviews/aggregates";

describe("computeAverageRating", () => {
  it("returns 0 for no ratings", () => {
    expect(computeAverageRating([])).toBe(0);
  });

  it("rounds to one decimal place", () => {
    expect(computeAverageRating([4, 5, 4])).toBe(4.3);
    expect(computeAverageRating([5, 4])).toBe(4.5);
  });

  it("handles a single approved rating", () => {
    expect(computeAverageRating([5])).toBe(5);
  });
});
