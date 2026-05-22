"use client";

import { useActionState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
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
      <Alert variant="success" className="mt-3">
        {state.message}
      </Alert>
    );
  }

  return (
    <form action={formAction} className="mt-3 space-y-3">
      <input type="hidden" name="complaintId" value={complaintId} />
      {state.error ? <Alert variant="error">{state.error}</Alert> : null}
      <label
        htmlFor={`response-${complaintId}`}
        className="text-foreground block text-sm font-medium"
      >
        Your public response
      </label>
      <Textarea
        id={`response-${complaintId}`}
        name="body"
        required
        rows={3}
        minLength={20}
        maxLength={3000}
        placeholder="Explain how you are addressing this complaint. Minimum 20 characters."
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
