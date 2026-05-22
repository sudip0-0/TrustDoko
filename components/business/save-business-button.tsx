"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
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
      <Button
        type="button"
        variant={saved ? "secondary" : "outline"}
        size="sm"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={saved}
        aria-busy={pending}
      >
        {pending ? "Saving…" : saved ? "Saved" : "Save business"}
      </Button>
      {message ? (
        <span className="text-muted text-xs" role="status">
          {message}
        </span>
      ) : null}
    </div>
  );
}
