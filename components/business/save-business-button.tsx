"use client";

import { useState, useTransition } from "react";

import { toggleSaveBusinessAction } from "@/server/actions/saved-businesses";

type SaveBusinessButtonProps = {
  businessId: string;
  initialSaved: boolean;
};

export function SaveBusinessButton({
  businessId,
  initialSaved,
}: SaveBusinessButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await toggleSaveBusinessAction(businessId);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      if (result.saved !== undefined) {
        setSaved(result.saved);
      }
      setMessage(result.message ?? null);
    });
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-60"
      >
        {pending ? "Saving…" : saved ? "Saved ✓" : "Save business"}
      </button>
      {message ? (
        <span className="text-muted text-xs" role="status">
          {message}
        </span>
      ) : null}
    </div>
  );
}
