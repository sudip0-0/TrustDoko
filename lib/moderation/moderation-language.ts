/**
 * Phrases that trigger moderation UI warnings (not legal findings).
 * Keep in sync with server moderation logic in review-status and complaint flows.
 */
export const MODERATION_TRIGGER_PHRASES = [
  "scam",
  "fraud",
  "fake product",
  "not delivered",
  "stole money",
  "harassment",
  "abuse",
  "fake business",
  "impersonation",
  "fake",
  "threat",
  "stolen",
] as const;

const singleWordPhrases = MODERATION_TRIGGER_PHRASES.filter((p) => !p.includes(" "));

const singleWordPattern = new RegExp(
  `\\b(${singleWordPhrases.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
  "i",
);

export function containsModerationTriggerLanguage(text: string): boolean {
  const normalized = text.trim();
  if (!normalized) {
    return false;
  }
  if (singleWordPattern.test(normalized)) {
    return true;
  }
  const lower = normalized.toLowerCase();
  return MODERATION_TRIGGER_PHRASES.some(
    (phrase) => phrase.includes(" ") && lower.includes(phrase),
  );
}
