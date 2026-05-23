import Link from "next/link";

import { StatusChip } from "@/components/ui/status-chip";
import type { HomeComplaintSnapshot } from "@/server/queries/home";

type HomeComplaintSnapshotProps = {
  snapshot: HomeComplaintSnapshot;
};

export function HomeComplaintSnapshot({ snapshot }: HomeComplaintSnapshotProps) {
  const rows = [
    {
      label: "Under review",
      count: snapshot.underReview + snapshot.submitted,
      variant: "warning" as const,
    },
    {
      label: "Unresolved",
      count: snapshot.unresolved,
      variant: "danger" as const,
    },
    {
      label: "Resolved",
      count: snapshot.resolved,
      variant: "success" as const,
    },
  ];

  const total = rows.reduce((sum, row) => sum + row.count, 0);

  return (
    <aside className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold">Recent complaint activity</h2>
        <Link
          href="/businesses"
          className="text-primary shrink-0 text-xs font-semibold no-underline hover:underline"
        >
          Browse businesses
        </Link>
      </div>
      <p className="text-muted mt-1 text-xs leading-relaxed">
        Public status counts only. Individual reports and proof stay private.
      </p>

      {total === 0 ? (
        <p className="text-muted mt-4 text-sm">No complaints on record yet.</p>
      ) : (
        <ul className="mt-4 list-none space-y-3 p-0">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <StatusChip variant={row.variant}>{row.label}</StatusChip>
              <span className="text-foreground font-mono font-semibold tabular-nums">
                {row.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
