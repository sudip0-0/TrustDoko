import type { Metadata } from "next";
import Link from "next/link";

import { getSessionUser } from "@/lib/auth/session";
import { getUserReviews } from "@/server/queries/reviews";

export const metadata: Metadata = {
  title: "Your dashboard",
};

function formatStatus(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Pending moderation",
    APPROVED: "Published",
    REJECTED: "Rejected",
    FLAGGED: "Flagged",
    UNDER_REVIEW: "Under review",
  };
  return labels[status] ?? status;
}

export default async function UserDashboardPage() {
  const user = await getSessionUser();
  const reviews = user ? await getUserReviews(user.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your dashboard</h1>
        <p className="text-muted mt-2">
          Signed in as {user?.email} ({user?.role})
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Your reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-muted mt-3 text-sm">
            You have not written any reviews yet.{" "}
            <Link href="/businesses" className="text-primary no-underline hover:underline">
              Browse businesses
            </Link>
          </p>
        ) : (
          <ul className="mt-4 list-none space-y-3 p-0">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <Link
                  href={`/businesses/${review.business.slug}#write-review`}
                  className="text-foreground font-medium no-underline hover:text-primary"
                >
                  {review.business.name}
                </Link>
                <p className="text-muted mt-1 text-sm">
                  {review.rating} ★ · {formatStatus(review.status)}
                  {review.title ? ` · ${review.title}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Coming soon</h2>
        <ul className="text-muted mt-3 list-inside list-disc space-y-1 text-sm">
          <li>Your complaint reports</li>
          <li>Account settings</li>
        </ul>
      </section>
    </div>
  );
}
