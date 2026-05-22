import { Badge } from "@/components/ui/badge";
import { formatModerationStatus } from "@/lib/copy/messages";
import { cn } from "@/lib/utils";

const statusVariants: Record<string, "warning" | "trustPositive" | "destructive" | "trustCaution" | "claimed" | "default"> = {
  PENDING: "warning",
  APPROVED: "trustPositive",
  REJECTED: "destructive",
  FLAGGED: "trustCaution",
  UNDER_REVIEW: "claimed",
  SUBMITTED: "warning",
  BUSINESS_RESPONDED: "claimed",
  RESOLVED: "trustPositive",
  UNRESOLVED: "trustCaution",
};

type ModerationStatusBadgeProps = {
  status: string;
  className?: string;
};

export function ModerationStatusBadge({
  status,
  className,
}: ModerationStatusBadgeProps) {
  const label = formatModerationStatus(status);
  const variant = statusVariants[status] ?? "default";

  return (
    <Badge
      variant={variant}
      className={cn(className)}
      aria-label={`Status: ${label}`}
    >
      {label}
    </Badge>
  );
}
