import {
  getVerificationBadgeDisplay,
} from "@/lib/business/verification-display";
import { Badge, verificationToneToBadgeVariant } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type VerificationBadgeProps = {
  claimStatus: string;
  verificationStatus: string;
  className?: string;
};

export function VerificationBadge({
  claimStatus,
  verificationStatus,
  className,
}: VerificationBadgeProps) {
  const display = getVerificationBadgeDisplay(claimStatus, verificationStatus);

  return (
    <Badge
      variant={verificationToneToBadgeVariant(display.tone)}
      className={cn(className)}
      title={display.description}
      aria-label={`Verification: ${display.label}. ${display.description}`}
    >
      {display.label}
    </Badge>
  );
}
