"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Alert } from "@/components/ui/alert";
import { containsModerationTriggerLanguage } from "@/lib/moderation/moderation-language";
import { copy } from "@/lib/copy/messages";

type ModerationWarningProps = {
  title?: string | null;
  body: string;
  className?: string;
};

export function ModerationWarning({ title, body, className }: ModerationWarningProps) {
  const show = useMemo(
    () => containsModerationTriggerLanguage(`${title ?? ""} ${body}`),
    [title, body],
  );

  if (!show) {
    return null;
  }

  return (
    <Alert variant="warning" className={className} title={copy.moderation.warningTitle}>
      <p>{copy.moderation.warningBody}</p>
      <Link
        href="/about"
        className="text-warning mt-2 inline-block text-sm font-semibold no-underline hover:underline"
      >
        {copy.moderation.guidanceLink}
      </Link>
    </Alert>
  );
}
