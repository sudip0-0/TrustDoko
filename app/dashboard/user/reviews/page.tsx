import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
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
    <DashboardShell
      title="My reviews"
      description="Reviews you have submitted and their moderation status."
    >
      <UserReviewsList reviews={reviews} />
    </DashboardShell>
  );
}
