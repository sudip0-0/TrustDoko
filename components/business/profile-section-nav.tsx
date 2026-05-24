"use client";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "reviews", label: "Reviews" },
  { id: "report-issue", label: "Report" },
  { id: "about", label: "About" },
] as const;

export function ProfileSectionNav() {
  return (
    <nav
      className="border-border -mx-1 flex gap-2 overflow-x-auto border-b px-1 pb-3 lg:hidden"
      aria-label="On this page"
    >
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="text-muted border-border hover:bg-accent hover:text-foreground shrink-0 rounded-lg border px-3 py-1.5 text-sm font-medium no-underline"
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}
