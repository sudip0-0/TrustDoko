import type { Prisma } from "@prisma/client";

import { getTrustScoreRangeForLabel } from "@/lib/trust-score/filters";
import type { TrustLabelKey } from "@/lib/trust-score/labels";
import type { BusinessListFilters } from "@/lib/validations/business-list";

export function buildBusinessWhere(
  filters: BusinessListFilters,
): Prisma.BusinessWhereInput {
  const where: Prisma.BusinessWhereInput = {};

  if (filters.q) {
    const q = filters.q;
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { category: { name: { contains: q, mode: "insensitive" } } },
      { websiteUrl: { contains: q, mode: "insensitive" } },
      { facebookUrl: { contains: q, mode: "insensitive" } },
      { instagramUrl: { contains: q, mode: "insensitive" } },
      { tiktokUrl: { contains: q, mode: "insensitive" } },
    ];
  }

  if (filters.category) {
    where.category = { slug: filters.category };
  }

  if (filters.city) {
    where.city = { equals: filters.city, mode: "insensitive" };
  }

  if (filters.businessType) {
    where.businessType = filters.businessType;
  }

  if (filters.verificationStatus) {
    where.verificationStatus = filters.verificationStatus;
  }

  if (filters.minRating !== undefined) {
    where.averageRating = { gte: filters.minRating };
    where.reviewCount = { gt: 0 };
  }

  if (filters.trustLabel) {
    const range = getTrustScoreRangeForLabel(
      filters.trustLabel as TrustLabelKey,
    );
    where.trustScore = { gte: range.min, lte: range.max };
  }

  return where;
}

export function hasActiveBusinessFilters(filters: BusinessListFilters): boolean {
  return Boolean(
    filters.q ||
      filters.category ||
      filters.city ||
      filters.businessType ||
      filters.verificationStatus ||
      filters.minRating !== undefined ||
      filters.trustLabel ||
      (filters.sort && filters.sort !== "trust"),
  );
}
