import type { BusinessType } from "@prisma/client";

import type { UpdateBusinessProfileInput } from "@/lib/validations/business-profile";

/** Only allowlisted fields may be written by owner profile updates. */
export function buildOwnerUpdateData(parsed: UpdateBusinessProfileInput) {
  return {
    description: parsed.description,
    phone: parsed.phone,
    email: parsed.email,
    websiteUrl: parsed.websiteUrl,
    facebookUrl: parsed.facebookUrl,
    instagramUrl: parsed.instagramUrl,
    tiktokUrl: parsed.tiktokUrl,
    address: parsed.address,
    city: parsed.city,
    province: parsed.province,
    ...(parsed.businessType
      ? { businessType: parsed.businessType as BusinessType }
      : {}),
  };
}
