"use client";

import { useActionState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
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
      <Alert variant="success" className="mt-3">
        {state.message}
      </Alert>
    );
  }

  return (
    <form action={formAction} className="mt-3 space-y-3">
      <input type="hidden" name="reviewId" value={reviewId} />
      {state.error ? (
        <Alert variant="error">{state.error}</Alert>
      ) : null}
      <label htmlFor={`review-response-${reviewId}`} className="text-foreground block text-sm font-medium">
        Your public response
      </label>
      <Textarea
        id={`review-response-${reviewId}`}
        name="body"
        required
        rows={3}
        minLength={20}
        maxLength={3000}
        placeholder="Explain how you addressed this customer's experience. Minimum 20 characters."
        aria-invalid={Boolean(state.fieldErrors?.body)}
      />
      {state.fieldErrors?.body ? (
        <p className="text-destructive text-sm" role="alert">
          {state.fieldErrors.body[0]}
        </p>
      ) : null}
      <Button type="submit" variant="secondary" size="sm" disabled={isPending} aria-busy={isPending}>
        {isPending ? "Posting…" : "Post response"}
      </Button>
    </form>
  );
}
