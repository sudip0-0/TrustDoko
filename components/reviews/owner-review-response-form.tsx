"use client";

import { useActionState } from "react";

import {
  respondToReviewAction,
  type ReviewActionState,
} from "@/server/actions/reviews";

const initialState: ReviewActionState = {};

type OwnerReviewResponseFormProps = {
  reviewId: string;
};

export function OwnerReviewResponseForm({
  reviewId,
}: OwnerReviewResponseFormProps) {
  const [state, formAction, isPending] = useActionState(
    respondToReviewAction,
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
    <form action={formAction} className="mt-3 space-y-2">
      <input type="hidden" name="reviewId" value={reviewId} />
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <textarea
        name="body"
        required
        rows={3}
        minLength={20}
        maxLength={3000}
        placeholder="Post a public response to this review…"
        className="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
      />
      {state.fieldErrors?.body ? (
        <p className="text-sm text-red-600">{state.fieldErrors.body[0]}</p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent disabled:opacity-60"
      >
        {isPending ? "Posting…" : "Post response"}
      </button>
    </form>
  );
}
