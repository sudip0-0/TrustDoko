import { beforeEach, describe, expect, it } from "vitest";

import {
  clearLoginFailures,
  isLoginRateLimited,
  recordLoginFailure,
  resetLoginRateLimitState,
} from "@/lib/auth/login-rate-limit";

describe("login rate limit", () => {
  beforeEach(() => {
    resetLoginRateLimitState();
  });

  it("allows login before threshold", () => {
    expect(isLoginRateLimited("user@example.com")).toBe(false);
  });

  it("blocks after repeated failures", () => {
    const email = "user@example.com";
    for (let i = 0; i < 10; i++) {
      recordLoginFailure(email);
    }
    expect(isLoginRateLimited(email)).toBe(true);
  });

  it("clears failures after successful login", () => {
    const email = "user@example.com";
    recordLoginFailure(email);
    clearLoginFailures(email);
    expect(isLoginRateLimited(email)).toBe(false);
  });
});
