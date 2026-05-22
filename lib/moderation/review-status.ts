import { ReviewStatus } from "@prisma/client";

const RISKY_PHRASES = [
  "scam",
  "fraud",
  "fake",
  "harassment",
  "abuse",
] as const;

function buildRiskyPattern(): RegExp {
  const pattern = RISKY_PHRASES.map((word) => `\\b${word}\\b`).join("|");
  return new RegExp(pattern, "i");
}

const riskyPattern = buildRiskyPattern();

export function containsRiskyReviewLanguage(text: string): boolean {
  return riskyPattern.test(text);
}

export function determineReviewStatus(
  title: string | null | undefined,
  body: string,
): ReviewStatus {
  const combined = `${title ?? ""} ${body}`.trim();
  if (containsRiskyReviewLanguage(combined)) {
    return ReviewStatus.PENDING;
  }
  return ReviewStatus.APPROVED;
}
