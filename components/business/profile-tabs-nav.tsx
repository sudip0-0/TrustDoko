"use client";

import { cn } from "@/lib/utils";

export type ProfileTab = {
  id: string;
  label: string;
};

type ProfileTabsNavProps = {
  tabs: ProfileTab[];
  className?: string;
};

export function ProfileTabsNav({ tabs, className }: ProfileTabsNavProps) {
  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav
      className={cn(
        "flex gap-1 overflow-x-auto border-b border-border",
        className,
      )}
      aria-label="Business profile sections"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => scrollToSection(tab.id)}
          className="text-muted shrink-0 border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[active]:border-primary data-[active]:text-primary"
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
