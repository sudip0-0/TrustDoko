import { cn } from "@/lib/utils";
import { formatVerificationStatus } from "@/lib/business/display";

type VerificationBadgeProps = {
  verificationStatus: string;
  className?: string;
};

function getVerificationTone(status: string): "verified" | "unverified" {
  return status === "UNVERIFIED" ? "unverified" : "verified";
}

const toneStyles = {
  verified: "border-teal-200 bg-teal-50/80 text-teal-900",
  unverified: "border-border bg-muted/50 text-muted-foreground",
} as const;

export function VerificationBadge({
  verificationStatus,
  className,
}: VerificationBadgeProps) {
  const tone = getVerificationTone(verificationStatus);
  const label = formatVerificationStatus(verificationStatus);

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneStyles[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
