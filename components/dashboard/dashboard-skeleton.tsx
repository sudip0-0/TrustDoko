export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-md bg-muted/60" />
        <div className="h-4 w-72 max-w-full rounded-md bg-muted/40" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl border border-border bg-card"
          />
        ))}
      </div>
      <div className="h-48 rounded-xl border border-border bg-card" />
      <div className="h-64 rounded-xl border border-border bg-card" />
    </div>
  );
}
