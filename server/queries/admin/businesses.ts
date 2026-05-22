import { prisma } from "@/lib/db";

export type AdminBusinessRow = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  claimStatus: string;
  verificationStatus: string;
  trustScore: number;
  reviewCount: number;
  complaintCount: number;
  createdAt: Date;
};

export async function getBusinessesForAdmin(): Promise<AdminBusinessRow[]> {
  const businesses = await prisma.business.findMany({
    orderBy: { name: "asc" },
    take: 100,
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      claimStatus: true,
      verificationStatus: true,
      trustScore: true,
      reviewCount: true,
      complaintCount: true,
      createdAt: true,
    },
  });

  return businesses;
}
