import { describe, expect, it } from "vitest";

import { getUserReviews } from "../reviews";
import { getUserProfileSummary, getUserNotifications } from "../user-dashboard";
import { getUserSavedBusinesses } from "../saved-businesses";

describe("dashboard query access guards", () => {
  it("rejects cross-user review loads", async () => {
    await expect(getUserReviews("user-a", "user-b")).rejects.toThrow(
      /Forbidden.*reviews/i,
    );
  });

  it("returns null profile summary for mismatched requester", async () => {
    const result = await getUserProfileSummary("user-a", "user-b");
    expect(result).toBeNull();
  });

  it("returns no notifications for mismatched requester", async () => {
    const result = await getUserNotifications("user-a", "user-b");
    expect(result).toEqual([]);
  });

  it("rejects cross-user saved business loads", async () => {
    await expect(getUserSavedBusinesses("user-a", "user-b")).rejects.toThrow(
      /Forbidden.*saved businesses/i,
    );
  });
});
