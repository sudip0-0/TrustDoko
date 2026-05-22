import { describe, expect, it } from "vitest";

import { getUserComplaints } from "@/server/queries/complaints";

describe("getUserComplaints access control", () => {
  it("rejects cross-user complaint access", async () => {
    await expect(getUserComplaints("user-a", "user-b")).rejects.toThrow(
      /Forbidden/,
    );
  });
});
