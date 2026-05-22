import { ClaimStatus, VerificationStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { calculateTrustScore } from "../calculate-trust-score";
import type { TrustScoreInput } from "../types";

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

describe("calculateTrustScore", () => {
  it("returns mid score for new business with no reviews", () => {
    const result = calculateTrustScore(baseInput());
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.score).toBe(50);
    expect(
      result.factors.find((f) => f.key === "RATING")?.description,
    ).toContain("Not enough approved reviews");
  });

  it("returns Highly Trusted for strong review signals", () => {
    const result = calculateTrustScore(
      baseInput({
        averageRating: 4.8,
        reviewCount: 10,
        profileCompleteness: 0.8,
        verificationStatus: VerificationStatus.SOCIAL_VERIFIED,
        responseRate: 0.5,
        accountAgeDays: 120,
      }),
    );
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.label.key).toBe("HIGHLY_TRUSTED");
  });

  it("lowers score with unresolved complaints", () => {
    const clean = calculateTrustScore(
      baseInput({ averageRating: 4.5, reviewCount: 5 }),
    );
    const withComplaints = calculateTrustScore(
      baseInput({
        averageRating: 4.5,
        reviewCount: 5,
        complaintCount: 4,
        unresolvedComplaintCount: 3,
        highSeverityOpenCount: 2,
      }),
    );
    expect(withComplaints.score).toBeLessThan(clean.score);
    expect(
      withComplaints.reasons.some((r) => r.includes("community report")),
    ).toBe(true);
  });

  it("adds verification bonus", () => {
    const unverified = calculateTrustScore(
      baseInput({ averageRating: 4, reviewCount: 3 }),
    );
    const verified = calculateTrustScore(
      baseInput({
        averageRating: 4,
        reviewCount: 3,
        verificationStatus: VerificationStatus.TRUSTED_SELLER,
      }),
    );
    expect(verified.score).toBeGreaterThan(unverified.score);
  });

  it("rewards response rate", () => {
    const noResponse = calculateTrustScore(
      baseInput({ averageRating: 4, reviewCount: 4, responseRate: 0 }),
    );
    const highResponse = calculateTrustScore(
      baseInput({ averageRating: 4, reviewCount: 4, responseRate: 1 }),
    );
    expect(highResponse.score).toBeGreaterThan(noResponse.score);
  });

  it("rewards profile completeness", () => {
    const sparse = calculateTrustScore(
      baseInput({ averageRating: 4, reviewCount: 3, profileCompleteness: 0 }),
    );
    const complete = calculateTrustScore(
      baseInput({ averageRating: 4, reviewCount: 3, profileCompleteness: 1 }),
    );
    expect(complete.score).toBeGreaterThan(sparse.score);
  });

  it("applies negative trend penalty", () => {
    const stable = calculateTrustScore(
      baseInput({ averageRating: 4, reviewCount: 6, recentNegativeTrend: false }),
    );
    const trending = calculateTrustScore(
      baseInput({ averageRating: 4, reviewCount: 6, recentNegativeTrend: true }),
    );
    expect(trending.score).toBeLessThan(stable.score);
  });

  it("overrides label to Under Review when claim is pending", () => {
    const result = calculateTrustScore(
      baseInput({
        averageRating: 5,
        reviewCount: 20,
        claimStatus: ClaimStatus.PENDING,
      }),
    );
    expect(result.label.key).toBe("UNDER_REVIEW");
    expect(result.flags.underReview).toBe(true);
  });

  it("overrides label when reviews are pending moderation", () => {
    const result = calculateTrustScore(
      baseInput({
        averageRating: 4.5,
        reviewCount: 5,
        pendingReviewCount: 2,
      }),
    );
    expect(result.label.key).toBe("UNDER_REVIEW");
  });

  it("increases score when average rating improves with same review count", () => {
    const lower = calculateTrustScore(
      baseInput({ averageRating: 2.5, reviewCount: 5 }),
    );
    const higher = calculateTrustScore(
      baseInput({ averageRating: 4.8, reviewCount: 5 }),
    );
    expect(higher.score).toBeGreaterThan(lower.score);
  });

  it("always clamps score between 0 and 100", () => {
    const high = calculateTrustScore(
      baseInput({
        averageRating: 5,
        reviewCount: 50,
        verificationStatus: VerificationStatus.TRUSTED_SELLER,
        responseRate: 1,
        profileCompleteness: 1,
        accountAgeDays: 365,
      }),
    );
    const low = calculateTrustScore(
      baseInput({
        complaintCount: 20,
        unresolvedComplaintCount: 15,
        highSeverityOpenCount: 10,
        recentNegativeTrend: true,
      }),
    );
    expect(high.score).toBeLessThanOrEqual(100);
    expect(low.score).toBeGreaterThanOrEqual(0);
  });
});
