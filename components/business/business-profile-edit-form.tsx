"use client";

import { useActionState } from "react";

import { ownerBusinessTypes } from "@/lib/business/owner-editable-fields";
import { formatBusinessType } from "@/lib/business/display";
import {
  updateBusinessProfileAction,
  type BusinessProfileActionState,
} from "@/server/actions/business-profile";
import type { BusinessForOwnerEdit } from "@/server/queries/business-owner";

const initialState: BusinessProfileActionState = {};

type BusinessProfileEditFormProps = {
  business: BusinessForOwnerEdit;
};

export function BusinessProfileEditForm({ business }: BusinessProfileEditFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateBusinessProfileAction,
    initialState,
  );

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">Edit profile</h2>
      <p className="text-muted mt-1 text-sm">
        Update contact and description fields. Name and trust scores cannot be
        changed here.
      </p>

      {state.success ? (
        <p className="mt-4 text-sm text-green-800" role="status">
          {state.message}
        </p>
      ) : null}
      {state.error ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="businessId" value={business.id} />

        <div>
          <label htmlFor="description" className="text-foreground block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={business.description ?? ""}
            className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="text-foreground block text-sm font-medium">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              defaultValue={business.phone ?? ""}
              className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-foreground block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={business.email ?? ""}
              className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="websiteUrl" className="text-foreground block text-sm font-medium">
            Website
          </label>
          <input
            id="websiteUrl"
            name="websiteUrl"
            defaultValue={business.websiteUrl ?? ""}
            className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="facebookUrl" className="text-foreground block text-sm font-medium">
              Facebook
            </label>
            <input
              id="facebookUrl"
              name="facebookUrl"
              defaultValue={business.facebookUrl ?? ""}
              className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="instagramUrl" className="text-foreground block text-sm font-medium">
              Instagram
            </label>
            <input
              id="instagramUrl"
              name="instagramUrl"
              defaultValue={business.instagramUrl ?? ""}
              className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="tiktokUrl" className="text-foreground block text-sm font-medium">
              TikTok
            </label>
            <input
              id="tiktokUrl"
              name="tiktokUrl"
              defaultValue={business.tiktokUrl ?? ""}
              className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="text-foreground block text-sm font-medium">
              City
            </label>
            <input
              id="city"
              name="city"
              defaultValue={business.city ?? ""}
              className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="province" className="text-foreground block text-sm font-medium">
              Province
            </label>
            <input
              id="province"
              name="province"
              defaultValue={business.province ?? ""}
              className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="text-foreground block text-sm font-medium">
            Address
          </label>
          <input
            id="address"
            name="address"
            defaultValue={business.address ?? ""}
            className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="businessType" className="text-foreground block text-sm font-medium">
            Business type
          </label>
          <select
            id="businessType"
            name="businessType"
            defaultValue={business.businessType}
            className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm"
          >
            {ownerBusinessTypes.map((type) => (
              <option key={type} value={type}>
                {formatBusinessType(type)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </section>
  );
}
