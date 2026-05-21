export function BusinessListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-border bg-card p-5"
          aria-hidden
        >
          <div className="flex justify-between gap-2">
            <div className="bg-border h-5 w-2/3 rounded" />
            <div className="bg-border h-5 w-20 rounded-full" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="bg-border h-3 w-1/3 rounded" />
            <div className="bg-border h-3 w-1/4 rounded" />
            <div className="bg-border h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
