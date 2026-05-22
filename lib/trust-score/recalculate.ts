import { prisma } from "@/lib/db";

import { calculateTrustScore } from "./calculate-trust-score";
import { gatherTrustScoreInputs } from "./gather-inputs";
import type { TrustScoreResult } from "./types";

export async function recalculateTrustScore(
  businessId: string,
): Promise<TrustScoreResult | null> {
  const input = await gatherTrustScoreInputs(businessId);
  if (!input) {
    return null;
  }

  const result = calculateTrustScore(input);

  await prisma.business.update({
    where: { id: businessId },
    data: {
      trustScore: result.score,
      trustScoreReasons: result.reasons,
      trustScoreUpdatedAt: new Date(),
    },
  });

  return result;
}
