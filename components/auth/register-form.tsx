"use client";

import Link from "next/link";
import { useActionState } from "react";

import { FormField } from "@/components/auth/form-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { registerAction, type AuthActionState } from "@/server/actions/auth";

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? <Alert variant="error">{state.error}</Alert> : null}

      <FormField
        id="name"
        label="Full name"
        name="name"
        autoComplete="name"
        errors={state.fieldErrors?.name}
      />
      <FormField
        id="email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        errors={state.fieldErrors?.email}
      />
      <FormField
        id="password"
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters. Use an email you check regularly — we may contact you about reports."
        errors={state.fieldErrors?.password}
      />

      <Button type="submit" disabled={isPending} aria-busy={isPending} className="w-full">
        {isPending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-muted text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium no-underline hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
