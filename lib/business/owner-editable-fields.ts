import { BusinessType } from "@prisma/client";

export const ownerEditableFieldKeys = [
  "description",
  "phone",
  "email",
  "websiteUrl",
  "facebookUrl",
  "instagramUrl",
  "tiktokUrl",
  "address",
  "city",
  "province",
  "businessType",
] as const;

export type OwnerEditableFieldKey = (typeof ownerEditableFieldKeys)[number];

export const ownerBusinessTypes = [
  "ONLINE_ONLY",
  "PHYSICAL",
  "HYBRID",
] as const satisfies readonly BusinessType[];
