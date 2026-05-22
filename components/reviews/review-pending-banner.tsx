import type { ViewerReview } from "@/server/queries/reviews";

type ReviewPendingBannerProps = {
  review: ViewerReview;
};

export function ReviewPendingBanner({ review }: ReviewPendingBannerProps) {
  if (review.status !== "PENDING") {
    return null;
  }

  return (
    <div
      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      role="status"
    >
      <p className="font-medium">Your review is pending moderation</p>
      <p className="mt-1 leading-relaxed">
        It is not visible publicly yet. Reviews with serious claims are checked
        before publication. You can edit your review below.
      </p>
    </div>
  );
}
