import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-900 border-amber-200",
  APPROVED: "bg-teal-50 text-teal-800 border-teal-200",
  REJECTED: "bg-red-50 text-red-800 border-red-200",
  FLAGGED: "bg-orange-50 text-orange-900 border-orange-200",
  UNDER_REVIEW: "bg-sky-50 text-sky-900 border-sky-200",
  SUBMITTED: "bg-amber-50 text-amber-900 border-amber-200",
  BUSINESS_RESPONDED: "bg-violet-50 text-violet-900 border-violet-200",
  RESOLVED: "bg-teal-50 text-teal-800 border-teal-200",
  UNRESOLVED: "bg-orange-50 text-orange-900 border-orange-200",
};

type ModerationStatusBadgeProps = {
  status: string;
  className?: string;
};

export function ModerationStatusBadge({
  status,
  className,
}: ModerationStatusBadgeProps) {
  const style =
    statusStyles[status] ?? "bg-muted/30 text-muted border-border";

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        style,
        className,
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
