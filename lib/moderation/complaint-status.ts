import { ComplaintCategory, ComplaintSeverity, ComplaintStatus } from "@prisma/client";

import { getComplaintSeverity } from "@/lib/complaints/severity";

const ESCALATION_PHRASES = [
  "fraud",
  "fake",
  "harassment",
  "abuse",
  "threat",
  "stolen",
] as const;

function buildEscalationPattern(): RegExp {
  const pattern = ESCALATION_PHRASES.map((word) => `\\b${word}\\b`).join("|");
  return new RegExp(pattern, "i");
}

const escalationPattern = buildEscalationPattern();

export function containsEscalationLanguage(text: string): boolean {
  return escalationPattern.test(text);
}

export function determineInitialComplaintStatus(
  category: ComplaintCategory,
  description: string,
): ComplaintStatus {
  const severity = getComplaintSeverity(category);
  if (
    severity === ComplaintSeverity.HIGH ||
    containsEscalationLanguage(description)
  ) {
    return ComplaintStatus.UNDER_REVIEW;
  }
  return ComplaintStatus.SUBMITTED;
}
