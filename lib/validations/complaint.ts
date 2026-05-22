import { z } from "zod";

import { complaintCategories } from "@/lib/complaints/categories";

export const complaintAmountRanges = [
  "UNDER_1000",
  "AMOUNT_1000_5000",
  "AMOUNT_5000_20000",
  "OVER_20000",
  "PREFER_NOT_SAY",
] as const;

export type ComplaintAmountRangeValue = (typeof complaintAmountRanges)[number];

export const complaintAmountRangeLabels: Record<
  ComplaintAmountRangeValue,
  string
> = {
  UNDER_1000: "Under NPR 1,000",
  AMOUNT_1000_5000: "NPR 1,000 – 5,000",
  AMOUNT_5000_20000: "NPR 5,000 – 20,000",
  OVER_20000: "Over NPR 20,000",
  PREFER_NOT_SAY: "Prefer not to say",
};

const complaintFieldsSchema = z.object({
  category: z.enum(complaintCategories, {
    message: "Please select a complaint category",
  }),
  description: z
    .string()
    .trim()
    .min(30, "Description must be at least 30 characters")
    .max(5000, "Description is too long"),
  experienceDate: z
    .string()
    .min(1, "Experience date is required")
    .refine(
      (value) => {
        const date = new Date(value);
        return !Number.isNaN(date.getTime()) && date <= new Date();
      },
      { message: "Experience date cannot be in the future" },
    ),
  amountRange: z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined ? undefined : value,
    z.enum(complaintAmountRanges).optional(),
  ),
  allowAdminContact: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .transform((value) => value === true || value === "true"),
});

export const submitComplaintSchema = complaintFieldsSchema.extend({
  businessSlug: z.string().trim().min(1, "Business is required"),
});

export const respondToComplaintSchema = z.object({
  complaintId: z.string().trim().min(1, "Complaint is required"),
  body: z
    .string()
    .trim()
    .min(20, "Response must be at least 20 characters")
    .max(3000, "Response is too long"),
});

export const updateComplaintStatusSchema = z.object({
  complaintId: z.string().trim().min(1),
  status: z.enum([
    "SUBMITTED",
    "UNDER_REVIEW",
    "BUSINESS_RESPONDED",
    "RESOLVED",
    "UNRESOLVED",
    "REJECTED",
  ]),
});

export type SubmitComplaintInput = z.infer<typeof submitComplaintSchema>;
export type RespondToComplaintInput = z.infer<typeof respondToComplaintSchema>;

export function parseComplaintFormData(formData: FormData) {
  const allowAdminContactRaw = formData.get("allowAdminContact");
  return {
    category: formData.get("category"),
    description: formData.get("description"),
    experienceDate: formData.get("experienceDate"),
    amountRange: formData.get("amountRange") ?? undefined,
    allowAdminContact:
      allowAdminContactRaw === "true" || allowAdminContactRaw === "on"
        ? "true"
        : "false",
  };
}

export function buildComplaintSummary(description: string): string {
  const trimmed = description.trim();
  if (trimmed.length <= 120) {
    return trimmed;
  }
  return `${trimmed.slice(0, 117)}...`;
}
