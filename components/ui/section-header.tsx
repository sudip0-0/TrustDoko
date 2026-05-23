import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
};

export function SectionHeader({
  title,
  description,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <h2 className="type-h3">{title}</h2>
        {description ? <p className="type-body mt-1">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
