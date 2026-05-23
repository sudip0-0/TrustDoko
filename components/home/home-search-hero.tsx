import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy/messages";

const popularSearches = [
  { label: "Mobile shops", href: "/businesses?category=electronics-mobile" },
  { label: "Online clothing", href: "/businesses?category=online-clothing" },
  { label: "Food delivery", href: "/businesses?category=food-cloud-kitchen" },
  { label: "Travel agencies", href: "/businesses?category=travel-tours" },
  { label: "Repair services", href: "/businesses?category=repair-services" },
] as const;

export function HomeSearchHero() {
  return (
    <section className="hero-grain relative overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative px-6 py-12 sm:px-10 sm:py-16">
        <p className="type-eyebrow">Search businesses in Nepal</p>
        <h1 className="type-display text-foreground mt-4 max-w-2xl">
          Read honest reviews. Share experiences. Resolve complaints.
        </h1>
        <p className="type-lead mt-5 max-w-xl">
          Check trust scores, complaint history, and verification before you pay
          online sellers, Instagram shops, and local service providers.
        </p>

        <form
          method="get"
          action="/businesses"
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch"
          role="search"
        >
          <label htmlFor="home-search" className="sr-only">
            Search businesses
          </label>
          <Input
            id="home-search"
            name="q"
            type="search"
            placeholder="Business name, city, category, or social handle…"
            className="min-h-12 flex-1 bg-card text-[0.9375rem]"
            autoComplete="off"
          />
          <Button type="submit" size="lg" className="shrink-0 sm:min-w-[8rem]">
            Search
          </Button>
        </form>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="type-caption font-medium">Popular:</span>
          {popularSearches.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="type-caption text-foreground rounded-md border border-border bg-background px-2.5 py-1 font-medium no-underline transition-colors hover:border-primary/30 hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <p className="type-caption mt-6 max-w-2xl">{copy.trust.disclaimer}</p>
      </div>
    </section>
  );
}
