import Link from "next/link";

export default function BusinessDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <nav
        className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4 text-sm"
        aria-label="Business dashboard"
      >
        <Link
          href="/dashboard/business"
          className="text-muted rounded-lg px-3 py-1.5 font-medium no-underline hover:bg-muted/40 hover:text-foreground"
        >
          All businesses
        </Link>
      </nav>
      {children}
    </div>
  );
}
