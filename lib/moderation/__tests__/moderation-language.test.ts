import { describe, expect, it } from "vitest";

import { containsModerationTriggerLanguage } from "@/lib/moderation/moderation-language";

describe("containsModerationTriggerLanguage", () => {
  it("detects serious multi-word phrases", () => {
    expect(containsModerationTriggerLanguage("Product not delivered yet")).toBe(
      true,
    );
    expect(containsModerationTriggerLanguage("Possible fraud on delivery")).toBe(
      true,
    );
  });

  it("detects single-word triggers with word boundaries", () => {
    expect(containsModerationTriggerLanguage("This seller is a scam")).toBe(true);
    expect(containsModerationTriggerLanguage("scamper around the store")).toBe(
      false,
    );
  });

  it("returns false for neutral text", () => {
    expect(
      containsModerationTriggerLanguage("Good packaging and fast delivery."),
    ).toBe(false);
  });
});
