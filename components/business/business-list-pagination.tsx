import Link from "next/link";

import { cn } from "@/lib/utils";

type BusinessListPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
};

function pageHref(page: number): string {
  return page <= 1 ? "/businesses" : `/businesses?page=${page}`;
}

export function BusinessListPagination({
  page,
  totalPages,
  total,
}: BusinessListPaginationProps) {
  if (totalPages <= 1) {
    return (
      <p className="text-muted text-center text-sm">
        Showing {total} business{total === 1 ? "" : "es"}
      </p>
    );
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) =>
      p === 1 ||
      p === totalPages ||
      (p >= page - 1 && p <= page + 1),
  );

  return (
    <nav
      className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
      aria-label="Business list pagination"
    >
      <p className="text-muted text-sm">
        Page {page} of {totalPages} · {total} businesses
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-1">
        <li>
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium no-underline hover:bg-accent"
            >
              Previous
            </Link>
          ) : (
            <span className="text-muted rounded-lg border border-transparent px-3 py-1.5 text-sm">
              Previous
            </span>
          )}
        </li>
        {pages.map((p, index) => {
          const prev = pages[index - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <li key={p} className="flex items-center gap-1">
              {showEllipsis ? (
                <span className="text-muted px-1 text-sm">…</span>
              ) : null}
              <Link
                href={pageHref(p)}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  "min-w-9 rounded-lg border px-3 py-1.5 text-center text-sm font-medium no-underline",
                  p === page
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-accent",
                )}
              >
                {p}
              </Link>
            </li>
          );
        })}
        <li>
          {page < totalPages ? (
            <Link
              href={pageHref(page + 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium no-underline hover:bg-accent"
            >
              Next
            </Link>
          ) : (
            <span className="text-muted rounded-lg border border-transparent px-3 py-1.5 text-sm">
              Next
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
