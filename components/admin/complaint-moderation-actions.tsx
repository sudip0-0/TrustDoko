"use client";

import { useActionState } from "react";

import {
  moderateComplaintAction,
  type AdminComplaintActionState,
} from "@/server/actions/admin/complaints";

const initialState: AdminComplaintActionState = {};

type ComplaintModerationActionsProps = {
  complaintId: string;
  currentStatus: string;
};

export function ComplaintModerationActions({
  complaintId,
  currentStatus,
}: ComplaintModerationActionsProps) {
  const [state, formAction, pending] = useActionState(
    moderateComplaintAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <input type="hidden" name="complaintId" value={complaintId} />
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
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          name="status"
          value="UNDER_REVIEW"
          disabled={pending}
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-60"
        >
          Under review
        </button>
        <button
          type="submit"
          name="status"
          value="RESOLVED"
          disabled={pending}
          className="rounded-lg bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          Resolved
        </button>
        <button
          type="submit"
          name="status"
          value="UNRESOLVED"
          disabled={pending}
          className="rounded-lg border border-orange-300 px-3 py-1.5 text-sm font-medium text-orange-900 hover:bg-orange-50 disabled:opacity-60"
        >
          Unresolved
        </button>
        <button
          type="submit"
          name="status"
          value="REJECTED"
          disabled={pending}
          className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-50 disabled:opacity-60"
        >
          Reject
        </button>
      </div>
      <label className="block text-sm">
        <span className="text-muted font-medium">Private admin note</span>
        <textarea
          name="adminNote"
          rows={2}
          defaultValue=""
          placeholder="Internal note (not shown publicly)"
          className="border-border mt-1 w-full rounded-lg border px-3 py-2 text-sm"
        />
      </label>
      <p className="text-muted text-xs">Current status: {currentStatus}</p>
    </form>
  );
}
