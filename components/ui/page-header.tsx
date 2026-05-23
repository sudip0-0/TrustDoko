import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
  size?: "default" | "compact";
};

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
  size = "default",
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow-badge mb-3">{eyebrow}</p> : null}
        <h1 className={cn(size === "compact" ? "type-h2" : "type-h1")}>{title}</h1>
        {description ? (
          <div
            className={cn(
              "mt-3 space-y-2",
              size === "compact" ? "type-body" : "type-lead",
            )}
          >
            {typeof description === "string" ? <p>{description}</p> : description}
          </div>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
