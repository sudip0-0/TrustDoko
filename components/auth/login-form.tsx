"use client";

import Link from "next/link";
import { useActionState } from "react";

import { FormField } from "@/components/auth/form-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy/messages";
import { loginAction, type AuthActionState } from "@/server/actions/auth";

const initialState: AuthActionState = {};

type LoginFormProps = {
  callbackUrl?: string;
};

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {callbackUrl ? (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      ) : null}

      {state.error ? (
        <Alert variant="error">{state.error}</Alert>
      ) : null}

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
        autoComplete="current-password"
        errors={state.fieldErrors?.password}
      />

      <p className="text-muted text-xs leading-relaxed">{copy.errors.signInRequired}</p>

      <Button type="submit" disabled={isPending} aria-busy={isPending} className="w-full">
        {isPending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-muted text-center text-sm">
        No account?{" "}
        <Link href="/register" className="text-primary font-medium no-underline hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
