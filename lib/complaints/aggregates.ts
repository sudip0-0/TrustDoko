import { ComplaintStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function recalculateBusinessComplaintCount(
  businessId: string,
): Promise<number> {
  const count = await prisma.complaint.count({
    where: {
      businessId,
      status: { not: ComplaintStatus.REJECTED },
    },
  });

  await prisma.business.update({
    where: { id: businessId },
    data: { complaintCount: count },
  });

  return count;
}
