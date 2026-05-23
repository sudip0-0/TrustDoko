import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import { FormPageShell } from "@/components/ui/form-page-shell";
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
    <FormPageShell
      title="Create account"
      description="Join TrustDoko to leave reviews, save businesses, and report serious issues before others pay the wrong seller."
    >
      <RegisterForm />
    </FormPageShell>
  );
}
