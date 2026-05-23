import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { FormPageShell } from "@/components/ui/form-page-shell";
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
    <FormPageShell
      title="Sign in"
      description="Access your reviews, saved businesses, and dashboard. Your activity helps protect shoppers across Nepal."
    >
      <LoginForm callbackUrl={callbackUrl} />
    </FormPageShell>
  );
}
