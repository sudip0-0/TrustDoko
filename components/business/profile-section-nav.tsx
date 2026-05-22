"use client";

const sections = [
  { id: "trust-score", label: "Trust score" },
  { id: "write-review", label: "Review" },
  { id: "reviews", label: "Reviews" },
  { id: "report-issue", label: "Report" },
] as const;

export function ProfileSectionNav() {
  return (
    <nav
      className="-mx-1 flex gap-2 overflow-x-auto border-b border-border px-1 pb-3 lg:hidden"
      aria-label="On this page"
    >
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="text-muted shrink-0 rounded-lg border border-border px-3 py-1.5 text-sm font-medium no-underline hover:bg-accent hover:text-foreground"
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}
