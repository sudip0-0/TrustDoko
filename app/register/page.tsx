import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6 sm:py-16">
      <Card>
        <CardContent className="py-8">
          <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            Join TrustDoko to leave reviews, save businesses, and report serious issues
            before others pay the wrong seller.
          </p>
          <div className="mt-8">
            <RegisterForm />
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
