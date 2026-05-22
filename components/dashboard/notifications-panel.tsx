import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { copy } from "@/lib/copy/messages";
import type { DashboardNotification } from "@/server/queries/user-dashboard";

type NotificationsPanelProps = {
  notifications: DashboardNotification[];
};

const typeLabels: Record<DashboardNotification["type"], string> = {
  review_approved: "Review published",
  business_replied: "Business replied",
  complaint_status: "Complaint update",
  claim_decision: "Claim update",
};

export function NotificationsPanel({ notifications }: NotificationsPanelProps) {
  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">Notifications</h2>
            <p className="text-muted mt-1 text-sm">
              Activity from your reviews, complaints, and claims. Email alerts are
              planned for a later release.
            </p>
          </div>
          <span className="text-muted rounded-full border border-border px-2.5 py-0.5 text-xs">
            Preview
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No recent activity"
              description={copy.empty.notifications}
              action={{ href: "/businesses", label: "Browse businesses" }}
            />
          </div>
        ) : (
          <ul className="mt-4 list-none space-y-3 p-0">
            {notifications.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-border px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-muted text-xs font-medium uppercase tracking-wide">
                    {typeLabels[item.type]}
                  </span>
                  <time className="text-muted text-xs">
                    {item.createdAt.toLocaleDateString()}
                  </time>
                </div>
                <p className="text-foreground mt-1 text-sm font-medium">
                  {item.title}
                </p>
                <p className="text-muted mt-1 text-sm">{item.body}</p>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-primary mt-2 inline-block text-sm font-medium no-underline hover:underline"
                  >
                    View details →
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
