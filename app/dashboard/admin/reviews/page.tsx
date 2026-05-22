import type { Metadata } from "next";
import Link from "next/link";

import { ModerationStatusBadge } from "@/components/admin/moderation-status-badge";
import { ReviewModerationActions } from "@/components/admin/review-moderation-actions";
import { getReviewsForModeration } from "@/server/queries/admin/reviews";

export const metadata: Metadata = {
  title: "Admin — Review moderation",
};

export default async function AdminReviewsPage() {
  const reviews = await getReviewsForModeration();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Review moderation queue</h2>
        <p className="text-muted mt-1 text-sm">
          Pending, under review, and flagged community reviews. Approve, reject,
          flag, or remove content that violates guidelines.
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="text-muted text-sm">No reviews in the moderation queue.</p>
      ) : (
        <ul className="list-none space-y-6 p-0">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/businesses/${review.businessSlug}`}
                    className="text-foreground font-semibold no-underline hover:text-primary"
                  >
                    {review.businessName}
                  </Link>
                  <p className="text-muted mt-1 text-sm">
                    {review.rating} ★ · {review.authorName ?? "Member"} (
                    {review.authorEmail}) ·{" "}
                    {review.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <ModerationStatusBadge status={review.status} />
              </div>
              {review.title ? (
                <p className="text-foreground mt-3 font-medium">{review.title}</p>
              ) : null}
              <p className="text-muted mt-2 text-sm leading-relaxed">
                {review.body}
              </p>
              <div className="mt-4">
                <ReviewModerationActions reviewId={review.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
