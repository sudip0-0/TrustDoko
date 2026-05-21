import {
  BusinessType,
  VerificationStatus,
} from "@prisma/client";
import { z } from "zod";

const trustLabelKeys = [
  "HIGHLY_TRUSTED",
  "TRUSTED",
  "MIXED",
  "RISKY",
  "HIGH_RISK",
] as const;

export const businessSortValues = [
  "trust",
  "rating",
  "reviews",
  "newest",
] as const;

export type BusinessListSort = (typeof businessSortValues)[number];

export const businessListFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).catch(1),
  q: z
    .string()
    .trim()
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional(),
  category: z.string().trim().optional(),
  city: z.string().trim().optional(),
  businessType: z.nativeEnum(BusinessType).optional().catch(undefined),
  verificationStatus: z.nativeEnum(VerificationStatus).optional().catch(undefined),
  minRating: z.coerce.number().min(1).max(5).optional().catch(undefined),
  trustLabel: z.enum(trustLabelKeys).optional().catch(undefined),
  sort: z.enum(businessSortValues).default("trust").catch("trust"),
});

export type BusinessListFilters = z.infer<typeof businessListFiltersSchema>;

export const BUSINESS_LIST_PAGE_SIZE = 12;

export function parseBusinessListFilters(
  source: Record<string, string | string[] | undefined>,
): BusinessListFilters {
  const get = (key: string): string | undefined => {
    const value = source[key];
    if (Array.isArray(value)) {
      return value[0];
    }
    return value;
  };

  return businessListFiltersSchema.parse({
    page: get("page"),
    q: get("q"),
    category: get("category"),
    city: get("city"),
    businessType: get("businessType"),
    verificationStatus: get("verificationStatus"),
    minRating: get("minRating"),
    trustLabel: get("trustLabel"),
    sort: get("sort"),
  });
}

export function buildBusinessListQueryString(
  filters: BusinessListFilters,
  page?: number,
): string {
  const params = new URLSearchParams();
  const targetPage = page ?? filters.page;

  if (targetPage > 1) {
    params.set("page", String(targetPage));
  }
  if (filters.q) {
    params.set("q", filters.q);
  }
  if (filters.category) {
    params.set("category", filters.category);
  }
  if (filters.city) {
    params.set("city", filters.city);
  }
  if (filters.businessType) {
    params.set("businessType", filters.businessType);
  }
  if (filters.verificationStatus) {
    params.set("verificationStatus", filters.verificationStatus);
  }
  if (filters.minRating !== undefined) {
    params.set("minRating", String(filters.minRating));
  }
  if (filters.trustLabel) {
    params.set("trustLabel", filters.trustLabel);
  }
  if (filters.sort && filters.sort !== "trust") {
    params.set("sort", filters.sort);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function buildBusinessListPath(
  filters: BusinessListFilters,
  page?: number,
): string {
  return `/businesses${buildBusinessListQueryString(filters, page)}`;
}

/** @deprecated Use businessListFiltersSchema */
export const businessListSearchSchema = businessListFiltersSchema.pick({
  page: true,
});
export type BusinessListSearch = Pick<BusinessListFilters, "page">;
