"use client";

import { useState, useTransition } from "react";

import { voteReviewHelpfulAction } from "@/server/actions/reviews";

type ReviewHelpfulButtonProps = {
  reviewId: string;
  helpfulCount: number;
  viewerHasVoted: boolean;
  isLoggedIn: boolean;
};

export function ReviewHelpfulButton({
  reviewId,
  helpfulCount,
  viewerHasVoted,
  isLoggedIn,
}: ReviewHelpfulButtonProps) {
  const [count, setCount] = useState(helpfulCount);
  const [voted, setVoted] = useState(viewerHasVoted);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleVote() {
    if (!isLoggedIn) {
      setError("Sign in to vote.");
      return;
    }
    if (voted) {
      return;
    }

    startTransition(async () => {
      const result = await voteReviewHelpfulAction(reviewId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setVoted(true);
      setCount((current) => current + 1);
      setError(null);
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleVote}
        disabled={!isLoggedIn || voted || isPending}
        className="border-border text-muted hover:border-primary hover:text-primary min-h-9 rounded-lg border px-3 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving…" : voted ? "Helpful" : "Mark helpful"} ({count})
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
