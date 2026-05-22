"use client";

import { useActionState } from "react";

import { claimMethodLabels, claimMethods } from "@/lib/claims/method-labels";
import {
  submitClaimAction,
  type ClaimActionState,
} from "@/server/actions/claims";

const initialState: ClaimActionState = {};

type ClaimFormProps = {
  businessSlug: string;
  businessName: string;
};

export function ClaimForm({ businessSlug, businessName }: ClaimFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitClaimAction,
    initialState,
  );

  if (state.success) {
    return (
      <p
        className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900"
        role="status"
      >
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="businessSlug" value={businessSlug} />

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="ownerName" className="text-foreground block text-sm font-medium">
          Owner name <span className="text-red-600">*</span>
        </label>
        <input
          id="ownerName"
          name="ownerName"
          required
          maxLength={120}
          className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        {state.fieldErrors?.ownerName ? (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.ownerName[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ownerEmail" className="text-foreground block text-sm font-medium">
          Owner email <span className="text-red-600">*</span>
        </label>
        <input
          id="ownerEmail"
          name="ownerEmail"
          type="email"
          required
          maxLength={200}
          className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        {state.fieldErrors?.ownerEmail ? (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.ownerEmail[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ownerPhone" className="text-foreground block text-sm font-medium">
          Owner phone (optional)
        </label>
        <input
          id="ownerPhone"
          name="ownerPhone"
          type="tel"
          maxLength={30}
          className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div>
        <label htmlFor="method" className="text-foreground block text-sm font-medium">
          Verification method <span className="text-red-600">*</span>
        </label>
        <select
          id="method"
          name="method"
          required
          defaultValue=""
          className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="" disabled>
            Select how you can verify ownership
          </option>
          {claimMethods.map((method) => (
            <option key={method} value={method}>
              {claimMethodLabels[method]}
            </option>
          ))}
        </select>
        {state.fieldErrors?.method ? (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.method[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="text-foreground block text-sm font-medium">
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          minLength={20}
          maxLength={2000}
          placeholder={`Explain your relationship to ${businessName} and how you can verify ownership.`}
          className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        {state.fieldErrors?.message ? (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.message[0]}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="document" className="text-foreground block text-sm font-medium">
          Supporting document (optional)
        </label>
        <input
          id="document"
          name="document"
          type="file"
          disabled
          className="text-muted mt-1.5 w-full cursor-not-allowed text-sm opacity-60"
        />
        <p className="text-muted mt-1 text-xs">
          Document upload will be available in a future update.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-primary-foreground w-full rounded-lg px-5 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {isPending ? "Submitting…" : "Submit claim request"}
      </button>
    </form>
  );
}
