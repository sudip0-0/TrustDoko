const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000;

type AttemptRecord = {
  failures: number;
  windowStart: number;
};

const attemptsByEmail = new Map<string, AttemptRecord>();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isLoginRateLimited(email: string): boolean {
  const key = normalizeEmail(email);
  const now = Date.now();
  const record = attemptsByEmail.get(key);

  if (!record) {
    return false;
  }

  if (now - record.windowStart > WINDOW_MS) {
    attemptsByEmail.delete(key);
    return false;
  }

  return record.failures >= MAX_FAILURES;
}

export function recordLoginFailure(email: string): void {
  const key = normalizeEmail(email);
  const now = Date.now();
  const record = attemptsByEmail.get(key);

  if (!record || now - record.windowStart > WINDOW_MS) {
    attemptsByEmail.set(key, { failures: 1, windowStart: now });
    return;
  }

  record.failures += 1;
}

export function clearLoginFailures(email: string): void {
  attemptsByEmail.delete(normalizeEmail(email));
}

/** Test helper — resets in-memory state between tests. */
export function resetLoginRateLimitState(): void {
  attemptsByEmail.clear();
}
