import { describe, expect, it } from "vitest";

import {
  getTrustLabelFromResult,
  getTrustLabelFromScore,
  UNDER_REVIEW_LABEL,
} from "../labels";

describe("getTrustLabelFromScore", () => {
  it("returns Highly Trusted for high scores", () => {
    expect(getTrustLabelFromScore(85).label).toBe("Highly Trusted");
  });

  it("returns Trusted for good scores", () => {
    expect(getTrustLabelFromScore(70).label).toBe("Trusted");
  });

  it("returns Mixed Reputation for mid scores", () => {
    expect(getTrustLabelFromScore(50).label).toBe("Mixed Reputation");
  });

  it("returns Risky for low-mid scores", () => {
    expect(getTrustLabelFromScore(30).label).toBe("Risky");
  });

  it("returns High Risk for very low scores", () => {
    expect(getTrustLabelFromScore(10).label).toBe("High Risk");
  });

  it("returns Under Review when flagged", () => {
    expect(
      getTrustLabelFromResult(90, { underReview: true }).label,
    ).toBe(UNDER_REVIEW_LABEL.label);
  });
});
