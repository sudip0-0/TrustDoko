/**
 * Auth.js (NextAuth) configuration placeholder.
 * Implement session provider and callbacks in TD-0103.
 */

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
} as const;
