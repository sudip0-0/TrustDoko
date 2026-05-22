"use client";

import { useActionState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  updateAccountAction,
  type AccountActionState,
} from "@/server/actions/account";

const initialState: AccountActionState = {};

type AccountSettingsFormProps = {
  name: string | null;
  email: string;
};

export function AccountSettingsForm({ name, email }: AccountSettingsFormProps) {
  const [state, formAction, pending] = useActionState(
    updateAccountAction,
    initialState,
  );

  return (
    <Card>
      <CardContent className="py-6">
        <h2 className="text-lg font-semibold">Account settings</h2>
        <p className="text-muted mt-1 text-sm">
          Update your display name. Email changes require support for now.
        </p>

        {state.message ? (
          <Alert variant="success" className="mt-4">
            {state.message}
          </Alert>
        ) : null}
        {state.error ? (
          <Alert variant="error" className="mt-4">
            {state.error}
          </Alert>
        ) : null}

        <form action={formAction} className="mt-6 max-w-md space-y-4">
          <div>
            <label htmlFor="name" className="text-foreground block text-sm font-medium">
              Display name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={name ?? ""}
              className="mt-1.5"
              aria-invalid={Boolean(state.fieldErrors?.name)}
            />
            {state.fieldErrors?.name ? (
              <p className="text-destructive mt-1 text-sm" role="alert">
                {state.fieldErrors.name[0]}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="email" className="text-foreground block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              disabled
              className="bg-muted/30 mt-1.5 cursor-not-allowed"
            />
          </div>
          <Button type="submit" disabled={pending} aria-busy={pending}>
            {pending ? "Saving…" : "Save settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
