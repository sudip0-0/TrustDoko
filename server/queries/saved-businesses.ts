import { prisma } from "@/lib/db";

export type SavedBusinessListItem = {
  savedId: string;
  businessId: string;
  name: string;
  slug: string;
  city: string | null;
  trustScore: number;
  averageRating: number;
  reviewCount: number;
  savedAt: Date;
};

export async function getUserSavedBusinesses(
  userId: string,
  requesterId: string,
): Promise<SavedBusinessListItem[]> {
  if (userId !== requesterId) {
    throw new Error("Forbidden: cannot load another user's saved businesses");
  }

  const rows = await prisma.savedBusiness.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      business: {
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          trustScore: true,
          averageRating: true,
          reviewCount: true,
        },
      },
    },
  });

  return rows.map((row) => ({
    savedId: row.id,
    businessId: row.business.id,
    name: row.business.name,
    slug: row.business.slug,
    city: row.business.city,
    trustScore: row.business.trustScore,
    averageRating: row.business.averageRating,
    reviewCount: row.business.reviewCount,
    savedAt: row.createdAt,
  }));
}

export async function isBusinessSavedByUser(
  userId: string,
  businessId: string,
): Promise<boolean> {
  const row = await prisma.savedBusiness.findUnique({
    where: {
      userId_businessId: { userId, businessId },
    },
    select: { id: true },
  });
  return Boolean(row);
}
