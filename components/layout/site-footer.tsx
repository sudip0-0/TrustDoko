export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="text-muted mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} TrustDoko. Built for Nepal.</p>
        <p>Reviews · Complaints · Trust signals</p>
      </div>
    </footer>
  );
}
