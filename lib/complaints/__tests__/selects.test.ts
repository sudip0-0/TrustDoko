import { describe, expect, it } from "vitest";

import {
  complaintDashboardSelect,
  complaintOwnerPanelSelect,
} from "@/lib/complaints/selects";

const privateFields = [
  "proofFileId",
  "proofFile",
  "userId",
  "user",
  "allowAdminContact",
  "adminNote",
] as const;

function collectKeys(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return [path, ...collectKeys(value as object, path)];
    }
    return [path];
  });
}

describe("complaint select privacy", () => {
  it("dashboard select omits private complaint fields", () => {
    const keys = collectKeys(complaintDashboardSelect);
    for (const field of privateFields) {
      expect(keys.some((k) => k === field || k.endsWith(`.${field}`))).toBe(
        false,
      );
    }
  });

  it("owner panel select omits proof and reporter identity", () => {
    const keys = collectKeys(complaintOwnerPanelSelect);
    for (const field of privateFields) {
      expect(keys.some((k) => k === field || k.endsWith(`.${field}`))).toBe(
        false,
      );
    }
  });
});
