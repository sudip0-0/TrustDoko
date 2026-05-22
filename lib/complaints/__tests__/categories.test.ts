import { describe, expect, it } from "vitest";

import {
  complaintCategories,
  complaintCategoryLabels,
} from "@/lib/complaints/categories";

const expectedCategories: { key: (typeof complaintCategories)[number]; label: string }[] =
  [
    { key: "NON_DELIVERY", label: "Product not delivered" },
    { key: "FAKE_PRODUCT", label: "Fake product" },
    { key: "REFUND_ISSUE", label: "Refund issue" },
    { key: "POOR_SERVICE", label: "Poor service" },
    { key: "MISLEADING_PRICING", label: "Misleading pricing" },
    { key: "NO_RESPONSE", label: "No response" },
    { key: "HARASSMENT", label: "Harassment or abuse" },
    { key: "DUPLICATE_BUSINESS", label: "Duplicate or fake business" },
    { key: "OTHER", label: "Other" },
  ];

describe("complaintCategories", () => {
  it("exposes all nine public categories", () => {
    expect(complaintCategories).toHaveLength(9);
    for (const { key } of expectedCategories) {
      expect(complaintCategories).toContain(key);
    }
  });

  it("maps user-facing labels for each category", () => {
    for (const { key, label } of expectedCategories) {
      expect(complaintCategoryLabels[key]).toBe(label);
    }
  });
});
