import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const variants = {
  default: "border-border bg-muted/30 text-foreground",
  success: "border-green-200 bg-green-50 text-green-900",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  danger: "border-red-200 bg-red-50 text-red-900",
  info: "border-teal-200 bg-teal-50 text-teal-950",
  muted: "border-border bg-card text-muted",
} as const;

type StatusChipVariant = keyof typeof variants;

type StatusChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: StatusChipVariant;
};

export function StatusChip({
  variant = "default",
  className,
  children,
  ...props
}: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
