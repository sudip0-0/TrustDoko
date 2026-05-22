import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ModerationStatusBadge } from "@/components/admin/moderation-status-badge";

type UserReviewItem = {
  id: string;
  rating: number;
  title: string | null;
  status: string;
  updatedAt: Date;
  business: { name: string; slug: string };
};

type UserReviewsListProps = {
  reviews: UserReviewItem[];
};

export function UserReviewsList({ reviews }: UserReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        title="No reviews yet"
        description="Share your experience with a Nepali online business to help others shop with more confidence."
        action={{ href: "/businesses", label: "Find a business to review" }}
      />
    );
  }

  return (
    <ul className="list-none space-y-4 p-0">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <Link
                href={`/businesses/${review.business.slug}#write-review`}
                className="text-foreground font-semibold no-underline hover:text-primary"
              >
                {review.business.name}
              </Link>
              <p className="text-muted mt-1 text-sm">
                {review.rating} ★
                {review.title ? ` · ${review.title}` : ""} · Updated{" "}
                {review.updatedAt.toLocaleDateString()}
              </p>
            </div>
            <ModerationStatusBadge status={review.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}
