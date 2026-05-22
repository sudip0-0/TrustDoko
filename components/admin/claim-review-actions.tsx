"use client";

import { useActionState } from "react";

import {
  approveClaimAction,
  rejectClaimAction,
  type ClaimActionState,
} from "@/server/actions/claims";

const initialState: ClaimActionState = {};

type ClaimReviewActionsProps = {
  claimId: string;
};

export function ClaimReviewActions({ claimId }: ClaimReviewActionsProps) {
  const [approveState, approveAction, approvePending] = useActionState(
    approveClaimAction,
    initialState,
  );
  const [rejectState, rejectAction, rejectPending] = useActionState(
    rejectClaimAction,
    initialState,
  );

  const state =
    approveState.error || approveState.message ? approveState : rejectState;

  return (
    <div className="space-y-3">
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

      <form action={approveAction} className="flex flex-wrap items-end gap-2">
        <input type="hidden" name="claimId" value={claimId} />
        <input
          name="adminNote"
          placeholder="Optional note"
          className="border-border min-w-[12rem] flex-1 rounded-lg border px-2 py-1.5 text-sm"
        />
        <button
          type="submit"
          disabled={approvePending}
          className="rounded-lg bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          Approve
        </button>
      </form>

      <form action={rejectAction} className="flex flex-wrap items-end gap-2">
        <input type="hidden" name="claimId" value={claimId} />
        <input
          name="adminNote"
          placeholder="Rejection reason (optional)"
          className="border-border min-w-[12rem] flex-1 rounded-lg border px-2 py-1.5 text-sm"
        />
        <button
          type="submit"
          disabled={rejectPending}
          className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-50 disabled:opacity-60"
        >
          Reject
        </button>
      </form>
    </div>
  );
}
