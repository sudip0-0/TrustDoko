import { ComplaintCategory, ComplaintSeverity } from "@prisma/client";

const HIGH_SEVERITY_CATEGORIES = new Set<ComplaintCategory>([
  ComplaintCategory.FAKE_PRODUCT,
  ComplaintCategory.HARASSMENT,
  ComplaintCategory.DUPLICATE_BUSINESS,
]);

const MEDIUM_SEVERITY_CATEGORIES = new Set<ComplaintCategory>([
  ComplaintCategory.NON_DELIVERY,
  ComplaintCategory.REFUND_ISSUE,
  ComplaintCategory.MISLEADING_INFO,
  ComplaintCategory.MISLEADING_PRICING,
  ComplaintCategory.NO_RESPONSE,
]);

export function getComplaintSeverity(
  category: ComplaintCategory,
): ComplaintSeverity {
  if (HIGH_SEVERITY_CATEGORIES.has(category)) {
    return ComplaintSeverity.HIGH;
  }
  if (MEDIUM_SEVERITY_CATEGORIES.has(category)) {
    return ComplaintSeverity.MEDIUM;
  }
  return ComplaintSeverity.LOW;
}
