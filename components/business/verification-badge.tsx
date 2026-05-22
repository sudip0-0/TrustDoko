import {
  getVerificationBadgeDisplay,
  type VerificationBadgeDisplay,
} from "@/lib/business/verification-display";
import { cn } from "@/lib/utils";

type VerificationBadgeProps = {
  claimStatus: string;
  verificationStatus: string;
  className?: string;
};

const toneStyles: Record<VerificationBadgeDisplay["tone"], string> = {
  neutral: "border-border bg-muted/50 text-muted-foreground",
  claimed: "border-blue-200 bg-blue-50/80 text-blue-900",
  verified: "border-teal-200 bg-teal-50/80 text-teal-900",
  premium: "border-violet-200 bg-violet-50/80 text-violet-900",
};

export function VerificationBadge({
  claimStatus,
  verificationStatus,
  className,
}: VerificationBadgeProps) {
  const display = getVerificationBadgeDisplay(claimStatus, verificationStatus);

  return (
    <span
      title={display.description}
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneStyles[display.tone],
        className,
      )}
    >
      {display.label}
    </span>
  );
}
