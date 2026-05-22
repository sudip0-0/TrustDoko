import { describe, expect, it } from "vitest";

import { buildTrustScoreReasons } from "../explanations";

describe("buildTrustScoreReasons", () => {
  it("includes neutral fallback when no factors qualify", () => {
    const reasons = buildTrustScoreReasons([
      { key: "BASE", impact: 50, description: "Baseline." },
      { key: "PROFILE_COMPLETENESS", impact: 0, description: "Empty profile." },
    ]);
    expect(reasons[0]).toContain("limited community signals");
  });

  it("never includes BASE factor text", () => {
    const reasons = buildTrustScoreReasons([
      { key: "BASE", impact: 50, description: "Starting baseline." },
      {
        key: "COMPLAINTS",
        impact: 0,
        description: "No community complaints are on file.",
      },
    ]);
    expect(reasons.some((r) => r.includes("Starting baseline"))).toBe(false);
    expect(reasons).toContain("No community complaints are on file.");
  });
});
