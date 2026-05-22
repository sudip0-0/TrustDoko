import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const variants = {
  default: "border-border bg-muted/30 text-foreground",
  trustPositive: "border-teal-200 bg-teal-50 text-teal-900",
  trustNeutral: "border-amber-200 bg-amber-50 text-amber-950",
  trustCaution: "border-orange-200 bg-orange-50 text-orange-950",
  trustNegative: "border-red-200 bg-red-50 text-red-900",
  verified: "border-teal-200 bg-teal-50 text-teal-900",
  claimed: "border-sky-200 bg-sky-50 text-sky-900",
  premium: "border-violet-200 bg-violet-50 text-violet-900",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  destructive: "border-red-200 bg-red-50 text-red-900",
} as const;

type BadgeVariant = keyof typeof variants;

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  children: ReactNode;
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function trustToneToBadgeVariant(
  tone: "positive" | "neutral" | "caution" | "negative",
): BadgeVariant {
  const map = {
    positive: "trustPositive",
    neutral: "trustNeutral",
    caution: "trustCaution",
    negative: "trustNegative",
  } as const;
  return map[tone];
}

export function verificationToneToBadgeVariant(
  tone: "neutral" | "claimed" | "verified" | "premium",
): BadgeVariant {
  const map = {
    neutral: "default",
    claimed: "claimed",
    verified: "verified",
    premium: "premium",
  } as const;
  return map[tone];
}
