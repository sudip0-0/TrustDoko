import { OwnerReviewResponseForm } from "@/components/reviews/owner-review-response-form";
import { canReplyToReview } from "@/lib/permissions/review";
import type { SessionUser } from "@/types/auth";
import {
  getApprovedReviewsForBusiness,
  type ReviewListItem,
} from "@/server/queries/reviews";

type OwnerReviewsPanelProps = {
  businessId: string;
  businessSlug: string;
  sessionUser: SessionUser;
  business: {
    claimedByUserId: string | null;
    claimStatus: string;
  };
};

function OwnerReviewRow({
  review,
  allowRespond,
}: {
  review: ReviewListItem;
  allowRespond: boolean;
}) {
  return (
    <li className="rounded-lg border border-border p-4">
      <p className="text-sm font-medium">
        {review.rating} ★ {review.title ? `· ${review.title}` : ""}
      </p>
      <p className="text-muted mt-1 text-xs">
        {review.authorName ?? "Community member"} ·{" "}
        {review.createdAt.toLocaleDateString()}
      </p>
      <p className="text-muted mt-2 text-sm leading-relaxed">{review.body}</p>
      {review.businessResponseBody ? (
        <div className="mt-3 rounded-md bg-muted/40 px-3 py-2 text-sm">
          <p className="text-muted text-xs font-medium">Your response</p>
          <p className="mt-1">{review.businessResponseBody}</p>
        </div>
      ) : allowRespond ? (
        <OwnerReviewResponseForm reviewId={review.id} />
      ) : null}
    </li>
  );
}

export async function OwnerReviewsPanel({
  businessId,
  businessSlug,
  sessionUser,
  business,
}: OwnerReviewsPanelProps) {
  const { reviews } = await getApprovedReviewsForBusiness(businessId, 1);
  const allowRespond = canReplyToReview(sessionUser, business);

  if (reviews.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Reviews</h2>
        <p className="text-muted mt-2 text-sm">No approved reviews yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">Reviews on your business</h2>
      <p className="text-muted mt-1 text-sm">
        Respond publicly to approved reviews.{" "}
        <a href={`/businesses/${businessSlug}#reviews`} className="text-primary">
          View on profile
        </a>
      </p>
      <ul className="mt-4 space-y-4">
        {reviews.map((review) => (
          <OwnerReviewRow
            key={review.id}
            review={review}
            allowRespond={allowRespond}
          />
        ))}
      </ul>
    </section>
  );
}
