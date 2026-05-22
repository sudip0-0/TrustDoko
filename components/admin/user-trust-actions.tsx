"use client";

import { useActionState } from "react";

import {
  updateUserTrustLevelAction,
  type AdminUserActionState,
} from "@/server/actions/admin/users";

const initialState: AdminUserActionState = {};

type UserTrustActionsProps = {
  userId: string;
  currentTrustLevel: string;
};

export function UserTrustActions({
  userId,
  currentTrustLevel,
}: UserTrustActionsProps) {
  const [state, formAction, pending] = useActionState(
    updateUserTrustLevelAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="trustLevel"
        defaultValue={currentTrustLevel}
        className="border-border rounded-lg border px-2 py-1.5 text-sm"
      >
        <option value="NEW">NEW</option>
        <option value="VERIFIED">VERIFIED</option>
        <option value="TRUSTED">TRUSTED</option>
        <option value="FLAGGED">FLAGGED</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-60"
      >
        Update
      </button>
      {state.message ? (
        <span className="text-xs text-green-800">{state.message}</span>
      ) : null}
      {state.error ? (
        <span className="text-destructive text-xs">{state.error}</span>
      ) : null}
    </form>
  );
}
