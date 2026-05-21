import { prisma } from "@/lib/db";
import { buildBusinessWhere } from "@/lib/search/business-filters";
import type { BusinessListFilters } from "@/lib/validations/business-list";
import { BUSINESS_LIST_PAGE_SIZE } from "@/lib/validations/business-list";

const businessListSelect = {
  id: true,
  name: true,
  slug: true,
  city: true,
  province: true,
  averageRating: true,
  reviewCount: true,
  complaintCount: true,
  trustScore: true,
  verificationStatus: true,
  claimStatus: true,
  businessType: true,
  category: {
    select: { name: true, slug: true },
  },
} as const;

export type BusinessListItem = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  province: string | null;
  averageRating: number;
  reviewCount: number;
  complaintCount: number;
  trustScore: number;
  verificationStatus: string;
  claimStatus: string;
  businessType: string;
  category: { name: string; slug: string } | null;
};

export type BusinessListResult = {
  businesses: BusinessListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  filters: BusinessListFilters;
};

const businessListOrderBy = [
  { trustScore: "desc" as const },
  { reviewCount: "desc" as const },
  { name: "asc" as const },
];

export async function listBusinesses(
  filters: BusinessListFilters,
  pageSize: number = BUSINESS_LIST_PAGE_SIZE,
): Promise<BusinessListResult> {
  const where = buildBusinessWhere(filters);
  const total = await prisma.business.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, filters.page), totalPages);
  const skip = (safePage - 1) * pageSize;

  const businesses = await prisma.business.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: businessListOrderBy,
    select: businessListSelect,
  });

  return {
    businesses,
    page: safePage,
    pageSize,
    total,
    totalPages,
    filters: { ...filters, page: safePage },
  };
}

export type BusinessFilterOptions = {
  categories: { name: string; slug: string }[];
  cities: string[];
};

export async function getBusinessFilterOptions(): Promise<BusinessFilterOptions> {
  const [categories, cityRows] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
    prisma.business.findMany({
      where: { city: { not: null } },
      distinct: ["city"],
      select: { city: true },
      orderBy: { city: "asc" },
    }),
  ]);

  const cities = cityRows
    .map((row) => row.city)
    .filter((city): city is string => city !== null);

  return { categories, cities };
}
