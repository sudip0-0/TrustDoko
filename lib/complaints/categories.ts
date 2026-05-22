import { ComplaintCategory } from "@prisma/client";

/** Categories shown in the public submission form (excludes legacy MISLEADING_INFO). */
export const complaintCategories = [
  "NON_DELIVERY",
  "FAKE_PRODUCT",
  "REFUND_ISSUE",
  "POOR_SERVICE",
  "MISLEADING_PRICING",
  "NO_RESPONSE",
  "HARASSMENT",
  "DUPLICATE_BUSINESS",
  "OTHER",
] as const satisfies readonly ComplaintCategory[];

export type PublicComplaintCategory = (typeof complaintCategories)[number];

export const complaintCategoryLabels: Record<PublicComplaintCategory, string> = {
  NON_DELIVERY: "Product not delivered",
  FAKE_PRODUCT: "Fake product",
  REFUND_ISSUE: "Refund issue",
  POOR_SERVICE: "Poor service",
  MISLEADING_PRICING: "Misleading pricing",
  NO_RESPONSE: "No response",
  HARASSMENT: "Harassment or abuse",
  DUPLICATE_BUSINESS: "Duplicate or fake business",
  OTHER: "Other",
};

export function getComplaintCategoryLabel(
  category: ComplaintCategory,
): string {
  if (category in complaintCategoryLabels) {
    return complaintCategoryLabels[category as PublicComplaintCategory];
  }
  if (category === "MISLEADING_INFO") {
    return "Misleading information";
  }
  return category;
}
