const PROFILE_FIELDS = [
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
] as const;

export type ProfileCompletenessFields = {
  description: string | null;
  phone: string | null;
  email: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
};

export function computeProfileCompleteness(
  business: ProfileCompletenessFields,
): number {
  const filled = PROFILE_FIELDS.filter((field) => {
    const value = business[field];
    return typeof value === "string" && value.trim().length > 0;
  }).length;
  return filled / PROFILE_FIELDS.length;
}
