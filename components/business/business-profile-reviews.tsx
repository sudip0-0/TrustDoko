import { ReviewCard } from "@/components/reviews/review-card";
import { ReviewListPagination } from "@/components/reviews/review-list-pagination";
import type { ReviewListItem } from "@/server/queries/reviews";

type BusinessProfileReviewsProps = {
  businessSlug: string;
  reviews: ReviewListItem[];
  reviewPage: number;
  reviewTotalPages: number;
  reviewTotal: number;
  viewerUserId?: string | null;
  isLoggedIn: boolean;
};

export function BusinessProfileReviews({
  businessSlug,
  reviews,
  reviewPage,
  reviewTotalPages,
  reviewTotal,
  viewerUserId,
  isLoggedIn,
}: BusinessProfileReviewsProps) {
  return (
    <section id="reviews" className="scroll-mt-24 rounded-xl border border-border bg-card p-6">
      <h2 className="text-xl font-semibold">Reviews</h2>
      <p className="text-muted mt-1 text-sm">
        Only approved reviews are shown publicly.
      </p>

      <div className="mt-4">
        <ReviewListPagination
          businessSlug={businessSlug}
          page={reviewPage}
          totalPages={reviewTotalPages}
          total={reviewTotal}
        />
      </div>

      {reviews.length === 0 ? (
        <p className="text-muted mt-6 text-sm">No approved reviews yet.</p>
      ) : (
        <ul className="mt-6 list-none space-y-4 p-0">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isLoggedIn={isLoggedIn}
              isOwner={viewerUserId === review.userId}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
