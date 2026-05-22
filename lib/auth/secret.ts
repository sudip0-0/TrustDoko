/**
 * Auth.js requires a stable secret to encrypt/decrypt JWT session cookies.
 * AUTH_SECRET and NEXTAUTH_SECRET must be identical when both are set.
 */
export function getAuthSecret(): string {
  const authSecret = process.env.AUTH_SECRET?.trim();
  const nextAuthSecret = process.env.NEXTAUTH_SECRET?.trim();

  if (authSecret && nextAuthSecret && authSecret !== nextAuthSecret) {
    throw new Error(
      "AUTH_SECRET and NEXTAUTH_SECRET must match. Use the same value for both in .env",
    );
  }

  const secret = authSecret ?? nextAuthSecret;

  if (!secret || secret.includes("replace") || secret.length < 32) {
    throw new Error(
      "Set AUTH_SECRET in .env (32+ chars). Generate: openssl rand -base64 32",
    );
  }

  return secret;
}
