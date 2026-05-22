import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth.config";

export const metadata: Metadata = {
  title: "Sign in",
};

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl =
    typeof params.callbackUrl === "string" &&
    params.callbackUrl.startsWith("/") &&
    !params.callbackUrl.startsWith("//")
      ? params.callbackUrl
      : undefined;

  const session = await auth();
  if (session?.user) {
    redirect(callbackUrl ?? "/dashboard/user");
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 sm:py-16">
      <Card>
        <CardContent className="py-8">
          <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            Access your reviews, saved businesses, and dashboard. Your activity helps
            protect shoppers across Nepal.
          </p>
          <div className="mt-8">
            <LoginForm callbackUrl={callbackUrl} />
          </div>
        </CardContent>
      </Card>
      <p className="text-muted mt-6 text-center text-sm">
        <Link href="/" className="no-underline hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
