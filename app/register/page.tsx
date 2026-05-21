import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import { auth } from "@/lib/auth/auth.config";

export const metadata: Metadata = {
  title: "Create account",
};

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard/user");
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
        <p className="text-muted mt-2 text-sm">
          Join TrustDoko to leave reviews and report issues.
        </p>
        <div className="mt-8">
          <RegisterForm />
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
