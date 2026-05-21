import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth/auth.config";

export const metadata: Metadata = {
  title: "Sign in",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard/user");
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl;

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
        <p className="text-muted mt-2 text-sm">
          Access your reviews, complaints, and dashboard.
        </p>
        <div className="mt-8">
          <LoginForm callbackUrl={callbackUrl} />
        </div>
      </div>
      <p className="text-muted mt-6 text-center text-sm">
        <Link href="/" className="no-underline hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
