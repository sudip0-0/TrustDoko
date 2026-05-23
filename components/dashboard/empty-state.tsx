import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: { href: string; label: string };
  icon?: ReactNode;
  id?: string;
};

function DefaultIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-muted h-10 w-10"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    </svg>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  id = "empty-state-title",
}: EmptyStateProps) {
  return (
    <section
      role="region"
      aria-labelledby={id}
      className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card">
        {icon ?? <DefaultIcon />}
      </div>
      <h3 id={id} className="text-foreground text-base font-semibold">
        {title}
      </h3>
      <p className="text-muted mx-auto mt-2 max-w-md text-sm leading-relaxed">
        {description}
      </p>
      {action ? (
        <ButtonLink href={action.href} className="mt-6">
          {action.label}
        </ButtonLink>
      ) : null}
    </section>
  );
}
