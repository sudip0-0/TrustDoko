import { z } from "zod";

import { claimMethods } from "@/lib/claims/method-labels";

export const submitClaimSchema = z.object({
  businessSlug: z.string().trim().min(1, "Business is required"),
  ownerName: z.string().trim().min(2, "Owner name is required").max(120),
  ownerEmail: z.string().trim().email("Valid email is required").max(200),
  ownerPhone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal("")),
  method: z.enum(claimMethods, {
    message: "Please select a verification method",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message is too long"),
});

export type SubmitClaimInput = z.infer<typeof submitClaimSchema>;

export function parseClaimFormData(formData: FormData) {
  return {
    ownerName: formData.get("ownerName"),
    ownerEmail: formData.get("ownerEmail"),
    ownerPhone: formData.get("ownerPhone") ?? undefined,
    method: formData.get("method"),
    message: formData.get("message"),
  };
}
