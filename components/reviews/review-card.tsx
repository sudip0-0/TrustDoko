import type { ReviewListItem } from "@/server/queries/reviews";

import { ReviewHelpfulButton } from "./review-helpful-button";

type ReviewCardProps = {
  review: ReviewListItem;
  isLoggedIn: boolean;
  isOwner: boolean;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-NP", { dateStyle: "medium" }).format(date);
}

export function ReviewCard({ review, isLoggedIn, isOwner }: ReviewCardProps) {
  return (
    <li className="border-b border-border pb-5 last:border-0 last:pb-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-foreground font-medium">
            {review.rating} ★
            {review.title ? ` · ${review.title}` : ""}
          </p>
          {review.authorName ? (
            <p className="text-muted mt-1 text-xs">by {review.authorName}</p>
          ) : null}
        </div>
        <p className="text-muted text-xs">{formatDate(review.createdAt)}</p>
      </div>

      <p className="text-muted mt-3 text-sm leading-relaxed">{review.body}</p>

      {review.businessResponseBody ? (
        <div className="mt-4 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <p className="text-foreground text-xs font-semibold">Business response</p>
          <p className="text-muted mt-1 text-sm leading-relaxed">
            {review.businessResponseBody}
          </p>
        </div>
      ) : null}

      <dl className="text-muted mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {review.experienceType ? (
          <div>
            <dt className="sr-only">Experience</dt>
            <dd>{review.experienceType.replaceAll("_", " ").toLowerCase()}</dd>
          </div>
        ) : null}
        {review.experienceDate ? (
          <div>
            <dt className="sr-only">Experience date</dt>
            <dd>{formatDate(review.experienceDate)}</dd>
          </div>
        ) : null}
        <div>
          <dt className="sr-only">Recommendation</dt>
          <dd>{review.wouldRecommend ? "Would recommend" : "Would not recommend"}</dd>
        </div>
      </dl>

      {review.tags.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {review.tags.map((tag) => (
            <li
              key={tag}
              className="bg-muted/50 text-muted rounded-full px-2.5 py-0.5 text-xs"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <ReviewHelpfulButton
          reviewId={review.id}
          helpfulCount={review.helpfulCount}
          viewerHasVoted={review.viewerHasVoted}
          isLoggedIn={isLoggedIn}
        />
        {isOwner ? (
          <a
            href="#write-review"
            className="text-primary text-xs font-medium no-underline hover:underline"
          >
            Edit your review
          </a>
        ) : null}
      </div>
    </li>
  );
}
