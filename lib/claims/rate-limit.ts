import { prisma } from "@/lib/db";

const MAX_CLAIMS_PER_DAY = 3;
const WINDOW_HOURS = 24;

export async function isClaimRateLimited(userId: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000);

  const count = await prisma.businessClaim.count({
    where: {
      userId,
      createdAt: { gte: since },
    },
  });

  return count >= MAX_CLAIMS_PER_DAY;
}
