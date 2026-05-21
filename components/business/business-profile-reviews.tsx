import type { BusinessProfileData } from "@/server/queries/business-profile";

type BusinessProfileReviewsProps = {
  business: BusinessProfileData;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-NP", {
    dateStyle: "medium",
  }).format(date);
}

export function BusinessProfileReviews({ business }: BusinessProfileReviewsProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-xl font-semibold">Reviews</h2>
      <p className="text-muted mt-1 text-sm">
        Only approved reviews are shown publicly.
      </p>

      {business.reviews.length === 0 ? (
        <p className="text-muted mt-6 text-sm">No approved reviews yet.</p>
      ) : (
        <ul className="mt-6 list-none space-y-4 p-0">
          {business.reviews.map((review) => (
            <li
              key={review.id}
              className="border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-foreground font-medium">
                  {review.rating} ★
                  {review.title ? ` · ${review.title}` : ""}
                </p>
                <p className="text-muted text-xs">{formatDate(review.createdAt)}</p>
              </div>
              {review.authorName ? (
                <p className="text-muted mt-1 text-xs">by {review.authorName}</p>
              ) : null}
              <p className="text-muted mt-2 text-sm leading-relaxed">{review.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
