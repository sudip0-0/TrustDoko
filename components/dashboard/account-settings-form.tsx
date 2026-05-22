"use client";

import { useActionState } from "react";

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
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">Account settings</h2>
      <p className="text-muted mt-1 text-sm">
        Update your display name. Email changes require support for now.
      </p>

      {state.message ? (
        <p className="mt-4 text-sm text-green-800" role="status">
          {state.message}
        </p>
      ) : null}
      {state.error ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <form action={formAction} className="mt-6 max-w-md space-y-4">
        <label className="block text-sm">
          <span className="text-foreground font-medium">Display name</span>
          <input
            name="name"
            type="text"
            required
            defaultValue={name ?? ""}
            className="border-border mt-1 w-full rounded-lg border px-3 py-2"
          />
          {state.fieldErrors?.name ? (
            <span className="text-destructive mt-1 block text-xs">
              {state.fieldErrors.name[0]}
            </span>
          ) : null}
        </label>
        <label className="block text-sm">
          <span className="text-foreground font-medium">Email</span>
          <input
            type="email"
            value={email}
            readOnly
            disabled
            className="border-border bg-muted/30 mt-1 w-full cursor-not-allowed rounded-lg border px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save settings"}
        </button>
      </form>
    </section>
  );
}
