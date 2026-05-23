import Link from "next/link";

import { cn } from "@/lib/utils";

type QuickLinkProps = {
  href: string;
  label: string;
  count?: number | null;
  hint?: string;
  className?: string;
};

export function QuickLink({
  href,
  label,
  count = null,
  hint,
  className,
}: QuickLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group focus-visible:ring-ring flex min-h-[5.5rem] flex-col justify-between rounded-xl border border-border bg-card p-4 no-underline transition-[border-color,box-shadow] hover:border-primary/25 hover:shadow-sm focus-visible:ring-2 focus-visible:outline-none active:scale-[0.99] motion-reduce:active:scale-100",
        className,
      )}
    >
      <p className="text-foreground text-sm font-semibold">{label}</p>
      {count !== null && count !== undefined ? (
        <p className="text-foreground mt-2 font-mono text-2xl font-bold tabular-nums">
          {count}
        </p>
      ) : (
        <p className="text-muted mt-2 text-sm">{hint ?? "Manage"}</p>
      )}
    </Link>
  );
}
