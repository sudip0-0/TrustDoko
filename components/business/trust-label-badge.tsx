import { Badge, trustToneToBadgeVariant } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TrustLabelDisplay } from "@/lib/trust-score";

type TrustLabelBadgeProps = {
  trustLabel: TrustLabelDisplay;
  className?: string;
};

export function TrustLabelBadge({ trustLabel, className }: TrustLabelBadgeProps) {
  return (
    <Badge
      variant={trustToneToBadgeVariant(trustLabel.tone)}
      className={cn(className)}
      aria-label={`Trust label: ${trustLabel.label}`}
    >
      {trustLabel.label}
    </Badge>
  );
}
