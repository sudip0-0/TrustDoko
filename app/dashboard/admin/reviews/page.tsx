import type { Metadata } from "next";
import Link from "next/link";

import { AdminProofLink } from "@/components/admin/admin-proof-link";
import { ModerationStatusBadge } from "@/components/admin/moderation-status-badge";
import { ReviewModerationActions } from "@/components/admin/review-moderation-actions";
import { EmptyState } from "@/components/dashboard/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { getReviewsForModeration } from "@/server/queries/admin/reviews";

export const metadata: Metadata = {
  title: "Admin - Review moderation",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminReviewsPage() {
  const reviews = await getReviewsForModeration();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Review moderation queue"
        description="Pending, under review, and flagged community reviews. Approve, reject, flag, or remove content that violates guidelines."
      />

      {reviews.length === 0 ? (
        <EmptyState
          title="Queue is clear"
          description="No reviews waiting for moderation right now."
        />
      ) : (
        <>
          <div className="border-border bg-card hidden overflow-x-auto rounded-xl border md:block">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Reviews waiting for admin moderation
              </caption>
              <thead className="bg-muted/30 text-muted text-xs tracking-wide uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Business
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Review
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Author
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Proof
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {reviews.map((review) => (
                  <tr key={review.id} className="align-top">
                    <td className="w-52 px-4 py-4">
                      <Link
                        href={`/businesses/${review.businessSlug}`}
                        className="text-foreground hover:text-primary font-semibold no-underline"
                      >
                        {review.businessName}
                      </Link>
                      <p className="text-muted mt-1 text-xs">
                        {formatDate(review.createdAt)}
                      </p>
                    </td>
                    <td className="max-w-md px-4 py-4">
                      <p className="text-foreground font-medium">
                        {review.rating} stars
                        {review.title ? ` - ${review.title}` : ""}
                      </p>
                      <p className="text-muted mt-1 line-clamp-3 leading-relaxed">
                        {review.body}
                      </p>
                    </td>
                    <td className="w-56 px-4 py-4">
                      <p className="text-foreground font-medium">
                        {review.authorName ?? "Member"}
                      </p>
                      <p className="text-muted mt-1 text-xs break-all">
                        {review.authorEmail}
                      </p>
                    </td>
                    <td className="w-36 px-4 py-4">
                      <ModerationStatusBadge status={review.status} />
                    </td>
                    <td className="w-28 px-4 py-4">
                      {review.proofFileId ? (
                        <AdminProofLink proofFileId={review.proofFileId} />
                      ) : (
                        <span className="text-muted text-xs">None</span>
                      )}
                    </td>
                    <td className="w-72 px-4 py-4">
                      <ReviewModerationActions reviewId={review.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="list-none space-y-4 p-0 md:hidden">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="border-border bg-card rounded-xl border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/businesses/${review.businessSlug}`}
                      className="text-foreground hover:text-primary font-semibold no-underline"
                    >
                      {review.businessName}
                    </Link>
                    <p className="text-muted mt-1 text-xs">
                      {review.rating} stars - {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <ModerationStatusBadge status={review.status} />
                </div>
                {review.title ? (
                  <p className="text-foreground mt-3 font-medium">
                    {review.title}
                  </p>
                ) : null}
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  {review.body}
                </p>
                <dl className="mt-3 grid gap-2 text-xs">
                  <div>
                    <dt className="text-foreground font-medium">Author</dt>
                    <dd className="text-muted break-all">
                      {review.authorName ?? "Member"} - {review.authorEmail}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-foreground font-medium">Proof</dt>
                    <dd>
                      {review.proofFileId ? (
                        <AdminProofLink proofFileId={review.proofFileId} />
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <ReviewModerationActions reviewId={review.id} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
