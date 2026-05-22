"use client";

import Link from "next/link";

import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { copy } from "@/lib/copy/messages";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-12">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <Alert variant="error">
        {copy.errors.generic} If this keeps happening, sign out and try again, or
        return to your dashboard overview.
      </Alert>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="bg-primary text-primary-foreground min-h-11 rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Try again
        </button>
        <ButtonLink href="/dashboard/user" variant="secondary">
          Your dashboard
        </ButtonLink>
        <Link href="/" className="text-muted min-h-11 inline-flex items-center text-sm">
          Home
        </Link>
      </div>
    </div>
  );
}
