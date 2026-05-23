import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";

import {
  clearLoginFailures,
  isLoginRateLimited,
  recordLoginFailure,
} from "./login-rate-limit";
import { verifyPassword } from "./password";
import { getAuthSecret } from "./secret";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase();

        if (isLoginRateLimited(normalizedEmail)) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user?.passwordHash) {
          recordLoginFailure(normalizedEmail);
          return null;
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
          recordLoginFailure(normalizedEmail);
          return null;
        }

        clearLoginFailures(normalizedEmail);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === "string" && token.role) {
        session.user.id = token.id;
        session.user.role = token.role as UserRole;
        if (typeof token.email === "string") {
          session.user.email = token.email;
        }
        if (typeof token.name === "string") {
          session.user.name = token.name;
        }
      }
      return session;
    },
  },
  secret: getAuthSecret(),
  trustHost: true,
});
