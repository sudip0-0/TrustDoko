"use client";

import { useActionState } from "react";

import {
  setBusinessVerificationAction,
  type VerificationActionState,
} from "@/server/actions/verification";

const initialState: VerificationActionState = {};

type SetVerificationFormProps = {
  businessId: string;
  currentStatus: string;
};

export function SetVerificationForm({
  businessId,
  currentStatus,
}: SetVerificationFormProps) {
  const [state, formAction, isPending] = useActionState(
    setBusinessVerificationAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="businessId" value={businessId} />
      <select
        name="verificationStatus"
        defaultValue={currentStatus}
        className="border-border rounded-lg border px-2 py-1 text-sm"
      >
        <option value="UNVERIFIED">Unverified</option>
        <option value="CONTACT_VERIFIED">Contact verified</option>
        <option value="DOCUMENT_VERIFIED">Document verified</option>
        <option value="SOCIAL_VERIFIED">Social verified</option>
        <option value="TRUSTED_SELLER">Trusted seller</option>
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg border border-border px-2 py-1 text-sm hover:bg-accent disabled:opacity-60"
      >
        Set
      </button>
      {state.message ? (
        <span className="text-xs text-green-800">{state.message}</span>
      ) : null}
      {state.error ? (
        <span className="text-xs text-destructive">{state.error}</span>
      ) : null}
    </form>
  );
}
