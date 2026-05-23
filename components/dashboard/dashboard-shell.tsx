import type { ReactNode } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  subNav?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function DashboardShell({
  title,
  description,
  actions,
  subNav,
  children,
  className,
}: DashboardShellProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <PageHeader
        title={title}
        description={description}
        actions={actions}
        size="compact"
      />
      {subNav}
      {children}
    </div>
  );
}
