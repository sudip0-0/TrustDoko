export function BusinessProfileSkeleton() {
  return (
    <div
      className="animate-pulse space-y-6"
      aria-busy="true"
      aria-label="Loading business profile"
    >
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="bg-border h-8 w-3/4 max-w-md rounded" />
        <div className="bg-border mt-3 h-4 w-1/3 rounded" />
        <div className="mt-6 space-y-3">
          <div className="bg-border h-3 w-full max-w-lg rounded" />
          <div className="bg-border h-3 w-2/3 max-w-sm rounded" />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="bg-border h-10 rounded" />
          <div className="bg-border h-10 rounded" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card p-5"
            aria-hidden
          >
            <div className="bg-border h-3 w-24 rounded" />
            <div className="bg-border mt-3 h-8 w-16 rounded" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="bg-border h-5 w-32 rounded" />
        <div className="mt-4 space-y-3">
          <div className="bg-border h-16 rounded" />
          <div className="bg-border h-16 rounded" />
        </div>
      </div>
    </div>
  );
}
