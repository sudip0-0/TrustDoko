import { TrustLabelBadge } from "@/components/business/trust-label-badge";
import { cn } from "@/lib/utils";
import type { TrustLabelDisplay } from "@/lib/trust-score";
import { trustScoreMeterColor } from "@/lib/trust-score/display-utils";

type TrustScoreDisplayProps = {
  trustScore: number;
  trustLabel?: TrustLabelDisplay;
  variant?: "compact" | "featured" | "inline";
  className?: string;
};

export function TrustScoreDisplay({
  trustScore,
  trustLabel,
  variant = "compact",
  className,
}: TrustScoreDisplayProps) {
  const meterPercent = Math.min(100, Math.max(0, trustScore));
  const meterColor = trustScoreMeterColor(trustScore);

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <span className="text-foreground text-sm font-semibold tabular-nums">
          Trust {trustScore}
          <span className="text-muted font-normal">/100</span>
        </span>
        {trustLabel ? <TrustLabelBadge trustLabel={trustLabel} /> : null}
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div
        className={cn("space-y-3", className)}
        role="group"
        aria-label={`Trust score ${trustScore} out of 100`}
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="text-foreground text-4xl font-bold tabular-nums">
            {trustScore}
            <span className="text-muted text-xl font-normal">/100</span>
          </p>
          {trustLabel ? <TrustLabelBadge trustLabel={trustLabel} /> : null}
        </div>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-muted/30"
          aria-hidden="true"
        >
          <div
            className={cn("h-full rounded-full transition-all", meterColor)}
            style={{ width: `${meterPercent}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("space-y-2", className)}
      role="group"
      aria-label={`Trust score ${trustScore} out of 100`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-foreground text-lg font-bold tabular-nums">
          {trustScore}
          <span className="text-muted text-sm font-normal">/100</span>
        </span>
        {trustLabel ? <TrustLabelBadge trustLabel={trustLabel} /> : null}
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted/30"
        aria-hidden="true"
      >
        <div
          className={cn("h-full rounded-full", meterColor)}
          style={{ width: `${meterPercent}%` }}
        />
      </div>
    </div>
  );
}
