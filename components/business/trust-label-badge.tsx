import { cn } from "@/lib/utils";
import type { TrustLabelDisplay } from "@/lib/trust-score";

const toneStyles: Record<TrustLabelDisplay["tone"], string> = {
  positive: "border-teal-200 bg-teal-50 text-teal-800",
  neutral: "border-amber-200 bg-amber-50 text-amber-900",
  caution: "border-orange-200 bg-orange-50 text-orange-900",
  negative: "border-red-200 bg-red-50 text-red-800",
};

type TrustLabelBadgeProps = {
  trustLabel: TrustLabelDisplay;
  className?: string;
};

export function TrustLabelBadge({ trustLabel, className }: TrustLabelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        toneStyles[trustLabel.tone],
        className,
      )}
    >
      {trustLabel.label}
    </span>
  );
}
