"use client";

import { useActionState } from "react";

import {
  moderateReviewAction,
  type AdminReviewActionState,
} from "@/server/actions/admin/reviews";

const initialState: AdminReviewActionState = {};

type ReviewModerationActionsProps = {
  reviewId: string;
};

function ActionButton({
  action,
  label,
  variant,
  pending,
}: {
  action: string;
  label: string;
  variant: "primary" | "danger" | "neutral";
  pending: boolean;
}) {
  const classes =
    variant === "primary"
      ? "bg-teal-700 text-white hover:opacity-90"
      : variant === "danger"
        ? "border border-red-300 text-red-800 hover:bg-red-50"
        : "border border-border text-foreground hover:bg-muted/40";

  return (
    <button
      type="submit"
      name="action"
      value={action}
      disabled={pending}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-60 ${classes}`}
    >
      {label}
    </button>
  );
}

export function ReviewModerationActions({
  reviewId,
}: ReviewModerationActionsProps) {
  const [state, formAction, pending] = useActionState(
    moderateReviewAction,
    initialState,
  );

  return (
    <div className="space-y-2">
      {state.message ? (
        <p className="text-sm text-green-800" role="status">
          {state.message}
        </p>
      ) : null}
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <form action={formAction} className="flex flex-wrap gap-2">
        <input type="hidden" name="reviewId" value={reviewId} />
        <ActionButton
          action="approve"
          label="Approve"
          variant="primary"
          pending={pending}
        />
        <ActionButton
          action="under_review"
          label="Under review"
          variant="neutral"
          pending={pending}
        />
        <ActionButton
          action="flag"
          label="Flag"
          variant="neutral"
          pending={pending}
        />
        <ActionButton
          action="reject"
          label="Reject"
          variant="danger"
          pending={pending}
        />
        <ActionButton
          action="delete"
          label="Delete"
          variant="danger"
          pending={pending}
        />
      </form>
    </div>
  );
}
