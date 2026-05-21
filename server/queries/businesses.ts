import { prisma } from "@/lib/db";
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
  category: { name: string; slug: string } | null;
};

export type BusinessListResult = {
  businesses: BusinessListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const businessListOrderBy = [
  { trustScore: "desc" as const },
  { reviewCount: "desc" as const },
  { name: "asc" as const },
];

export async function listBusinesses(
  page: number,
  pageSize: number = BUSINESS_LIST_PAGE_SIZE,
): Promise<BusinessListResult> {
  const total = await prisma.business.count();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const skip = (safePage - 1) * pageSize;

  const businesses = await prisma.business.findMany({
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
  };
}
