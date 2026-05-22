import { ClaimStatus, VerificationStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { calculateTrustScore } from "../calculate-trust-score";
import { buildTrustScoreReasons } from "../explanations";
import {
  getTrustLabelFromResult,
  getTrustLabelFromScore,
} from "../labels";
import type { TrustScoreFactor, TrustScoreInput } from "../types";

const BANNED_WORDS = [
  "scam",
  "fraud",
  "fraudulent",
  "illegal",
  "criminal",
  "guaranteed safe",
  "certified safe",
];

function baseInput(overrides: Partial<TrustScoreInput> = {}): TrustScoreInput {
  return {
    averageRating: 0,
    reviewCount: 0,
    complaintCount: 0,
    unresolvedComplaintCount: 0,
    complaintsUnderModerationCount: 0,
    highSeverityOpenCount: 0,
    verificationStatus: VerificationStatus.UNVERIFIED,
    claimStatus: ClaimStatus.UNCLAIMED,
    responseRate: 0,
    profileCompleteness: 0,
    recentNegativeTrend: false,
    pendingReviewCount: 0,
    accountAgeDays: 0,
    ...overrides,
  };
}

function collectPublicCopy(
  result: ReturnType<typeof calculateTrustScore>,
): string {
  return [...result.reasons, ...result.factors.map((f) => f.description)].join(
    " ",
  );
}

describe("trust score QA", () => {
  it("clamps score to 0–100 for extreme numeric inputs", () => {
    const extremes: Partial<TrustScoreInput>[] = [
      {
        averageRating: 99,
        reviewCount: 1000,
        responseRate: 5,
        profileCompleteness: 2,
        verificationStatus: VerificationStatus.TRUSTED_SELLER,
        accountAgeDays: 9999,
      },
      {
        averageRating: -10,
        reviewCount: -5,
        complaintCount: 100,
        unresolvedComplaintCount: 100,
        highSeverityOpenCount: 50,
        recentNegativeTrend: true,
        responseRate: -1,
        profileCompleteness: -0.5,
      },
    ];

    for (const overrides of extremes) {
      const result = calculateTrustScore(baseInput(overrides));
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    }
  });

  it("increases score when review signals improve", () => {
    const lowReviews = calculateTrustScore(
      baseInput({ averageRating: 3, reviewCount: 2 }),
    );
    const highReviews = calculateTrustScore(
      baseInput({ averageRating: 4.8, reviewCount: 12 }),
    );
    expect(highReviews.score).toBeGreaterThan(lowReviews.score);
  });

  it("decreases score when complaints increase", () => {
    const baseline = calculateTrustScore(
      baseInput({ averageRating: 4.5, reviewCount: 6 }),
    );
    const withComplaints = calculateTrustScore(
      baseInput({
        averageRating: 4.5,
        reviewCount: 6,
        complaintCount: 5,
        unresolvedComplaintCount: 4,
      }),
    );
    expect(withComplaints.score).toBeLessThan(baseline.score);
  });

  it("penalizes unresolved complaints even when total count is fixed", () => {
    const fewOpen = calculateTrustScore(
      baseInput({
        averageRating: 4,
        reviewCount: 4,
        complaintCount: 3,
        unresolvedComplaintCount: 1,
      }),
    );
    const manyOpen = calculateTrustScore(
      baseInput({
        averageRating: 4,
        reviewCount: 4,
        complaintCount: 3,
        unresolvedComplaintCount: 3,
      }),
    );
    expect(manyOpen.score).toBeLessThan(fewOpen.score);
  });

  it("improves score with higher verification tier", () => {
    const unverified = calculateTrustScore(
      baseInput({ averageRating: 4, reviewCount: 4 }),
    );
    const verified = calculateTrustScore(
      baseInput({
        averageRating: 4,
        reviewCount: 4,
        verificationStatus: VerificationStatus.DOCUMENT_VERIFIED,
      }),
    );
    expect(verified.score).toBeGreaterThan(unverified.score);
  });

  it("improves score with higher business response rate", () => {
    const low = calculateTrustScore(
      baseInput({ averageRating: 4, reviewCount: 5, responseRate: 0 }),
    );
    const high = calculateTrustScore(
      baseInput({ averageRating: 4, reviewCount: 5, responseRate: 1 }),
    );
    expect(high.score).toBeGreaterThan(low.score);
  });

  it("maps numeric score to correct label when not under review", () => {
    const cases: Array<{ score: number; label: string; key: string }> = [
      { score: 85, label: "Highly Trusted", key: "HIGHLY_TRUSTED" },
      { score: 80, label: "Highly Trusted", key: "HIGHLY_TRUSTED" },
      { score: 79, label: "Trusted", key: "TRUSTED" },
      { score: 65, label: "Trusted", key: "TRUSTED" },
      { score: 64, label: "Mixed Reputation", key: "MIXED" },
      { score: 45, label: "Mixed Reputation", key: "MIXED" },
      { score: 44, label: "Risky", key: "RISKY" },
      { score: 25, label: "Risky", key: "RISKY" },
      { score: 24, label: "High Risk", key: "HIGH_RISK" },
      { score: 0, label: "High Risk", key: "HIGH_RISK" },
    ];

    for (const { score, label, key } of cases) {
      const display = getTrustLabelFromScore(score);
      expect(display.label).toBe(label);
      expect(display.key).toBe(key);
      expect(
        getTrustLabelFromResult(score, { underReview: false }).key,
      ).toBe(key);
    }
  });

  it("includes understandable baseline explanations for new businesses", () => {
    const result = calculateTrustScore(baseInput());
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(
      result.reasons.some((r) => r.includes("Not enough approved reviews")),
    ).toBe(true);
    expect(
      result.reasons.some((r) => r.includes("No community complaints")),
    ).toBe(true);
  });

  it("avoids defamatory or legal-conclusion wording in public copy", () => {
    const scenarios = [
      baseInput(),
      baseInput({
        averageRating: 2,
        reviewCount: 8,
        complaintCount: 6,
        unresolvedComplaintCount: 5,
        recentNegativeTrend: true,
      }),
      baseInput({
        claimStatus: ClaimStatus.PENDING,
        pendingReviewCount: 2,
      }),
    ];

    for (const input of scenarios) {
      const result = calculateTrustScore(input);
      const copy = collectPublicCopy(result).toLowerCase();
      for (const word of BANNED_WORDS) {
        expect(copy).not.toContain(word);
      }
    }
  });

  it("buildTrustScoreReasons surfaces educational factors with zero impact", () => {
    const factors: TrustScoreFactor[] = [
      {
        key: "RATING",
        impact: 0,
        description: "Not enough approved reviews yet.",
      },
      {
        key: "VERIFICATION",
        impact: 0,
        description: "No verification tier is recorded yet.",
      },
      {
        key: "PROFILE_COMPLETENESS",
        impact: 0,
        description: "Profile mostly empty.",
      },
    ];
    const reasons = buildTrustScoreReasons(factors);
    expect(reasons).toContain("Not enough approved reviews yet.");
    expect(reasons).toContain("No verification tier is recorded yet.");
    expect(reasons).not.toContain("Profile mostly empty.");
  });
});
