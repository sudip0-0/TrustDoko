"use client";

import { useEffect, useMemo, useState } from "react";

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
  const sectionIds = useMemo(() => tabs.map((tab) => tab.id), [tabs]);
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");

  useEffect(() => {
    if (tabs.length === 0) {
      return;
    }

    const hash = window.location.hash.replace("#", "");
    if (hash && sectionIds.includes(hash)) {
      setActiveId(hash);
    }

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveId(visible.target.id);
          window.history.replaceState(null, "", `#${visible.target.id}`);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds, tabs.length]);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
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
          aria-current={activeId === tab.id ? "true" : undefined}
          data-active={activeId === tab.id ? true : undefined}
          className="text-muted shrink-0 border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[active]:border-primary data-[active]:text-primary"
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
