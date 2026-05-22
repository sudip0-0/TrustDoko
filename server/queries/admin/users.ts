import type { UserRole, UserTrustLevel } from "@prisma/client";

import { prisma } from "@/lib/db";

import { requireAdminQuery } from "./guard";

export type AdminUserRow = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  trustLevel: UserTrustLevel;
  reviewCount: number;
  complaintCount: number;
  createdAt: Date;
};

export async function getUsersForAdmin(): Promise<AdminUserRow[]> {
  await requireAdminQuery();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      trustLevel: true,
      createdAt: true,
      _count: { select: { reviews: true, complaints: true } },
    },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    trustLevel: u.trustLevel,
    reviewCount: u._count.reviews,
    complaintCount: u._count.complaints,
    createdAt: u.createdAt,
  }));
}
