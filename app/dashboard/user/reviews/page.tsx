import type { Metadata } from "next";

import { UserReviewsList } from "@/components/dashboard/user-reviews-list";
import { getSessionUser } from "@/lib/auth/session";
import { getUserReviews } from "@/server/queries/reviews";

export const metadata: Metadata = {
  title: "My reviews",
};

export default async function UserReviewsPage() {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  const reviews = await getUserReviews(user.id, user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My reviews</h1>
        <p className="text-muted mt-2 text-sm">
          Reviews you have submitted and their moderation status.
        </p>
      </div>
      <UserReviewsList reviews={reviews} />
    </div>
  );
}
