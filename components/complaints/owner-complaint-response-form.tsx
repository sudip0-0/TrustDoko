"use client";

import { useActionState } from "react";

import {
  respondToComplaintAction,
  type ComplaintActionState,
} from "@/server/actions/complaints";

const initialState: ComplaintActionState = {};

type OwnerComplaintResponseFormProps = {
  complaintId: string;
};

export function OwnerComplaintResponseForm({
  complaintId,
}: OwnerComplaintResponseFormProps) {
  const [state, formAction, isPending] = useActionState(
    respondToComplaintAction,
    initialState,
  );

  if (state.success) {
    return (
      <p className="text-sm text-green-800" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-3 space-y-3">
      <input type="hidden" name="complaintId" value={complaintId} />
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <div>
        <label
          htmlFor={`response-${complaintId}`}
          className="text-foreground block text-sm font-medium"
        >
          Your response
        </label>
        <textarea
          id={`response-${complaintId}`}
          name="body"
          required
          rows={3}
          minLength={20}
          maxLength={3000}
          placeholder="Explain how you are addressing this complaint…"
          className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        {state.fieldErrors?.body ? (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.body[0]}</p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-60"
      >
        {isPending ? "Posting…" : "Post response"}
      </button>
    </form>
  );
}
