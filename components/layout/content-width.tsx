import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContentWidthProps = {
  children: ReactNode;
  size?: "md" | "lg" | "xl";
  className?: string;
};

const widths = {
  md: "max-w-3xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
} as const;

export function ContentWidth({
  children,
  size = "xl",
  className,
}: ContentWidthProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-8 sm:px-6 lg:px-8",
        widths[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
