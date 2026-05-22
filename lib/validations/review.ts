import { z } from "zod";

export const experienceTypes = [
  "PURCHASE",
  "DELIVERY",
  "CUSTOMER_SERVICE",
  "REFUND",
  "OTHER",
] as const;

export type ExperienceType = (typeof experienceTypes)[number];

const tagSchema = z
  .string()
  .trim()
  .min(2, "Tag must be at least 2 characters")
  .max(32, "Tag is too long")
  .regex(/^[a-zA-Z0-9-]+$/, "Tags may only use letters, numbers, and hyphens");

function parseTagsInput(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      typeof item === "string" ? item.split(",") : [],
    );
  }
  if (typeof value === "string" && value.trim()) {
    return value.split(",");
  }
  return [];
}

const reviewFieldsSchema = z.object({
  rating: z.coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  title: z.string().trim().max(120, "Title is too long").optional(),
  body: z
    .string()
    .trim()
    .min(20, "Review must be at least 20 characters")
    .max(5000, "Review is too long"),
  experienceType: z.enum(experienceTypes).optional(),
  experienceDate: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const date = new Date(value);
        return !Number.isNaN(date.getTime()) && date <= new Date();
      },
      { message: "Experience date cannot be in the future" },
    ),
  wouldRecommend: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .transform((value) => value === true || value === "true"),
  tags: z
    .preprocess(parseTagsInput, z.array(tagSchema).max(5, "Maximum 5 tags"))
    .optional()
    .default([]),
});

export const submitReviewSchema = reviewFieldsSchema.extend({
  businessSlug: z.string().trim().min(1, "Business is required"),
});

export const updateReviewSchema = reviewFieldsSchema.extend({
  reviewId: z.string().trim().min(1, "Review is required"),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;

export function parseReviewFormData(formData: FormData) {
  const wouldRecommendRaw = formData.get("wouldRecommend");
  return {
    rating: formData.get("rating"),
    title: formData.get("title") ?? undefined,
    body: formData.get("body"),
    experienceType: formData.get("experienceType") ?? undefined,
    experienceDate: formData.get("experienceDate") ?? undefined,
    wouldRecommend:
      wouldRecommendRaw === "true" || wouldRecommendRaw === "on"
        ? "true"
        : "false",
    tags: formData.getAll("tags").length
      ? formData.getAll("tags")
      : formData.get("tags"),
  };
}
