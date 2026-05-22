import Link from "next/link";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: { href: string; label: string };
  icon?: ReactNode;
};

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      {icon ? <div className="text-muted mb-4">{icon}</div> : null}
      <h3 className="text-foreground text-base font-semibold">{title}</h3>
      <p className="text-muted mt-2 max-w-md text-sm leading-relaxed">
        {description}
      </p>
      {action ? (
        <Link
          href={action.href}
          className="bg-primary text-primary-foreground mt-6 inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-medium no-underline hover:opacity-90"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
