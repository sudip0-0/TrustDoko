import { describe, expect, it } from "vitest";

import {
  submitReviewSchema,
  updateReviewSchema,
} from "@/lib/validations/review";

const validReview = {
  rating: 4,
  title: "Solid experience",
  body: "Delivery was on time and the product matched the description.",
  experienceType: "DELIVERY",
  wouldRecommend: "true",
  tags: "fast-delivery, fair-price",
};

describe("submitReviewSchema", () => {
  it("accepts a valid review", () => {
    const parsed = submitReviewSchema.parse({
      ...validReview,
      businessSlug: "sample-kathmandu-threads",
    });
    expect(parsed.rating).toBe(4);
    expect(parsed.wouldRecommend).toBe(true);
    expect(parsed.tags).toEqual(["fast-delivery", "fair-price"]);
  });

  it("rejects body shorter than 20 characters", () => {
    const result = submitReviewSchema.safeParse({
      ...validReview,
      body: "Too short",
      businessSlug: "sample-kathmandu-threads",
    });
    expect(result.success).toBe(false);
  });

  it("rejects rating outside 1-5", () => {
    const result = submitReviewSchema.safeParse({
      ...validReview,
      rating: 6,
      businessSlug: "sample-kathmandu-threads",
    });
    expect(result.success).toBe(false);
  });

  it("treats empty experience type as optional", () => {
    const parsed = submitReviewSchema.parse({
      ...validReview,
      experienceType: "",
      businessSlug: "sample-kathmandu-threads",
    });
    expect(parsed.experienceType).toBeUndefined();
  });

  it("rejects more than five tags", () => {
    const result = submitReviewSchema.safeParse({
      ...validReview,
      tags: "tag1,tag2,tag3,tag4,tag5,tag6",
      businessSlug: "sample-kathmandu-threads",
    });
    expect(result.success).toBe(false);
  });

  it("parses wouldRecommend false from form string", () => {
    const parsed = submitReviewSchema.parse({
      ...validReview,
      wouldRecommend: "false",
      businessSlug: "sample-kathmandu-threads",
    });
    expect(parsed.wouldRecommend).toBe(false);
  });
});

describe("updateReviewSchema", () => {
  it("requires reviewId", () => {
    const result = updateReviewSchema.safeParse(validReview);
    expect(result.success).toBe(false);
  });
});
