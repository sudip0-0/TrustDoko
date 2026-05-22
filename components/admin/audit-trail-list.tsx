import type { AdminAuditRow } from "@/server/queries/admin/audit";

type AuditTrailListProps = {
  logs: AdminAuditRow[];
};

export function AuditTrailList({ logs }: AuditTrailListProps) {
  if (logs.length === 0) {
    return (
      <p className="text-muted text-sm">No moderation actions recorded yet.</p>
    );
  }

  return (
    <ul className="list-none space-y-2 p-0">
      {logs.map((log) => (
        <li
          key={log.id}
          className="rounded-lg border border-border px-3 py-2 text-sm"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-medium">{log.action}</span>
            <time className="text-muted text-xs">
              {log.createdAt.toLocaleString()}
            </time>
          </div>
          <p className="text-muted mt-1 text-xs">
            {log.entityType} · {log.entityId.slice(0, 12)}…
            {log.actorEmail
              ? ` · ${log.actorName ?? "Admin"} (${log.actorEmail})`
              : " · system"}
          </p>
        </li>
      ))}
    </ul>
  );
}
