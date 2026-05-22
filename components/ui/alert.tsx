import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const variants = {
  info: "border-border bg-card text-foreground",
  success: "border-teal-200 bg-teal-50 text-teal-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  error: "border-red-200 bg-red-50 text-red-950",
} as const;

type AlertVariant = keyof typeof variants;

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
};

export function Alert({
  variant = "info",
  title,
  children,
  className,
  ...props
}: AlertProps) {
  const role = variant === "error" ? "alert" : "status";

  return (
    <div
      role={role}
      className={cn(
        "rounded-lg border px-4 py-3 text-sm leading-relaxed",
        variants[variant],
        className,
      )}
      {...props}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? "mt-1" : undefined}>{children}</div>
    </div>
  );
}
