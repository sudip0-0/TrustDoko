import Link from "next/link";

import type { HomeCategoryChip } from "@/server/queries/home";

type HomeCategoryChipsProps = {
  categories: HomeCategoryChip[];
};

export function HomeCategoryChips({ categories }: HomeCategoryChipsProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="type-h3">
        Browse by category
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/businesses?category=${category.slug}`}
            className="border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm font-medium no-underline transition-colors hover:border-primary/30 hover:bg-accent"
          >
            {category.name}
          </Link>
        ))}
        <Link
          href="/businesses"
          className="text-primary rounded-md px-3 py-2 text-sm font-semibold no-underline hover:underline"
        >
          All categories
        </Link>
      </div>
    </section>
  );
}
