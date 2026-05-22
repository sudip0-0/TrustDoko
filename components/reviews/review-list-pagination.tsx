import Link from "next/link";

import { cn } from "@/lib/utils";

type ReviewListPaginationProps = {
  businessSlug: string;
  page: number;
  totalPages: number;
  total: number;
};

export function ReviewListPagination({
  businessSlug,
  page,
  totalPages,
  total,
}: ReviewListPaginationProps) {
  if (totalPages <= 1) {
    return (
      <p className="text-muted text-sm">
        {total} approved review{total === 1 ? "" : "s"}
      </p>
    );
  }

  const base = `/businesses/${businessSlug}`;

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3"
      aria-label="Review pagination"
    >
      <p className="text-muted text-sm">
        Page {page} of {totalPages} · {total} reviews
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link
            href={`${base}?reviewPage=${page - 1}#reviews`}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium no-underline hover:bg-accent"
          >
            Previous
          </Link>
        ) : (
          <span className="text-muted rounded-lg border border-transparent px-3 py-1.5 text-sm">
            Previous
          </span>
        )}
        {page < totalPages ? (
          <Link
            href={`${base}?reviewPage=${page + 1}#reviews`}
            className={cn(
              "rounded-lg border border-border px-3 py-1.5 text-sm font-medium no-underline hover:bg-accent",
            )}
          >
            Next
          </Link>
        ) : (
          <span className="text-muted rounded-lg border border-transparent px-3 py-1.5 text-sm">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
