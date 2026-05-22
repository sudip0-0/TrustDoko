import { z } from "zod";

import { ownerBusinessTypes } from "@/lib/business/owner-editable-fields";

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" ? null : v));

const optionalString = z
  .string()
  .trim()
  .max(500)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" ? null : v));

export const updateBusinessProfileSchema = z.object({
  businessId: z.string().trim().min(1),
  description: optionalString,
  phone: optionalString,
  email: z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined ? "" : value,
    z.union([z.literal(""), z.string().trim().email("Invalid email").max(200)]),
  ).transform((v) => (v === "" ? null : v)),
  websiteUrl: optionalUrl,
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  address: optionalString,
  city: optionalString,
  province: optionalString,
  businessType: z.enum(ownerBusinessTypes).optional(),
});

export type UpdateBusinessProfileInput = z.infer<
  typeof updateBusinessProfileSchema
>;

export function parseBusinessProfileFormData(formData: FormData) {
  return {
    businessId: formData.get("businessId"),
    description: formData.get("description") ?? undefined,
    phone: formData.get("phone") ?? undefined,
    email: formData.get("email") ?? undefined,
    websiteUrl: formData.get("websiteUrl") ?? undefined,
    facebookUrl: formData.get("facebookUrl") ?? undefined,
    instagramUrl: formData.get("instagramUrl") ?? undefined,
    tiktokUrl: formData.get("tiktokUrl") ?? undefined,
    address: formData.get("address") ?? undefined,
    city: formData.get("city") ?? undefined,
    province: formData.get("province") ?? undefined,
    businessType: formData.get("businessType") ?? undefined,
  };
}
