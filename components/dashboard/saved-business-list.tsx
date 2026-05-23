"use client";

import Link from "next/link";
import { useActionState } from "react";

import { EmptyState } from "@/components/dashboard/empty-state";
import {
  removeSavedBusinessAction,
  type SavedBusinessActionState,
} from "@/server/actions/saved-businesses";
import type { SavedBusinessListItem } from "@/server/queries/saved-businesses";

const initialState: SavedBusinessActionState = {};

type SavedBusinessListProps = {
  items: SavedBusinessListItem[];
};

export function SavedBusinessList({ items }: SavedBusinessListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No saved businesses yet"
        description="Save businesses you want to compare later. Use the save button on any business profile."
        action={{ href: "/businesses", label: "Browse businesses" }}
      />
    );
  }

  return (
    <ul className="list-none space-y-4 p-0">
      {items.map((item) => (
        <SavedBusinessRow key={item.savedId} item={item} />
      ))}
    </ul>
  );
}

function SavedBusinessRow({ item }: { item: SavedBusinessListItem }) {
  const [state, formAction, pending] = useActionState(
    removeSavedBusinessAction,
    initialState,
  );

  return (
    <li className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={`/businesses/${item.slug}`}
            className="text-foreground type-h3 no-underline hover:text-primary"
          >
            {item.name}
          </Link>
          <p className="text-muted mt-1 text-sm">
            {item.city ?? "Nepal"} · Trust {item.trustScore}/100 ·{" "}
            {item.reviewCount > 0
              ? `${item.averageRating.toFixed(1)} ★`
              : "No reviews yet"}
          </p>
          <p className="text-muted mt-1 text-xs">
            Saved {item.savedAt.toLocaleDateString()}
          </p>
        </div>
        <form action={formAction}>
          <input type="hidden" name="savedId" value={item.savedId} />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-60"
          >
            Remove
          </button>
        </form>
      </div>
      {state.message ? (
        <p className="text-muted mt-2 text-xs">{state.message}</p>
      ) : null}
      {state.error ? (
        <p className="text-destructive mt-2 text-xs">{state.error}</p>
      ) : null}
    </li>
  );
}
