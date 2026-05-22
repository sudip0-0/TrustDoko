"use client";

import { useActionState } from "react";

import { FormField } from "@/components/auth/form-field";
import { experienceTypes } from "@/lib/validations/review";
import {
  deleteReviewAction,
  submitReviewAction,
  updateReviewAction,
  type ReviewActionState,
} from "@/server/actions/reviews";
import type { ViewerReview } from "@/server/queries/reviews";

const initialState: ReviewActionState = {};

const experienceLabels: Record<(typeof experienceTypes)[number], string> = {
  PURCHASE: "Purchase",
  DELIVERY: "Delivery",
  CUSTOMER_SERVICE: "Customer service",
  REFUND: "Refund",
  OTHER: "Other",
};

type ReviewFormProps = {
  businessSlug: string;
  businessName: string;
  viewerReview?: ViewerReview | null;
};

export function ReviewForm({
  businessSlug,
  businessName,
  viewerReview,
}: ReviewFormProps) {
  const isEdit = Boolean(viewerReview);
  const [submitState, submitAction, isSubmitting] = useActionState(
    isEdit ? updateReviewAction : submitReviewAction,
    initialState,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteReviewAction,
    initialState,
  );

  const state = submitState.error || submitState.fieldErrors ? submitState : deleteState;

  return (
    <section
      id="write-review"
      className="scroll-mt-24 rounded-xl border border-border bg-card p-6"
    >
      <h2 className="text-xl font-semibold">
        {isEdit ? "Edit your review" : "Write a review"}
      </h2>
      <p className="text-muted mt-1 text-sm">
        Share your experience with {businessName}. Honest, specific reviews help
        others shop safely.
      </p>

      {(submitState.success || deleteState.success) && (submitState.message || deleteState.message) ? (
        <p
          className="mt-4 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800"
          role="status"
        >
          {submitState.message ?? deleteState.message}
        </p>
      ) : null}

      {state.error ? (
        <p
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <form action={submitAction} className="mt-6 space-y-4">
        <input type="hidden" name="businessSlug" value={businessSlug} />
        {isEdit && viewerReview ? (
          <input type="hidden" name="reviewId" value={viewerReview.id} />
        ) : null}

        <fieldset>
          <legend className="text-foreground mb-2 block text-sm font-medium">
            Rating <span className="text-red-600">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <label
                key={value}
                className="border-border has-[:checked]:border-primary has-[:checked]:bg-primary/5 flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border px-3 text-sm font-medium"
              >
                <input
                  type="radio"
                  name="rating"
                  value={String(value)}
                  defaultChecked={viewerReview?.rating === value}
                  required
                  className="sr-only"
                />
                {value} ★
              </label>
            ))}
          </div>
          {state.fieldErrors?.rating ? (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.rating[0]}</p>
          ) : null}
        </fieldset>

        <FormField
          id="title"
          label="Title (optional)"
          name="title"
          required={false}
          defaultValue={viewerReview?.title ?? ""}
          errors={state.fieldErrors?.title}
        />

        <div>
          <label htmlFor="body" className="text-foreground mb-1.5 block text-sm font-medium">
            Your review <span className="text-red-600">*</span>
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={5}
            defaultValue={viewerReview?.body ?? ""}
            placeholder="What went well or poorly? Include delivery, product quality, and communication."
            className="border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          {state.fieldErrors?.body ? (
            <p className="mt-1 text-sm text-red-600">{state.fieldErrors.body[0]}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="experienceType"
              className="text-foreground mb-1.5 block text-sm font-medium"
            >
              Experience type
            </label>
            <select
              id="experienceType"
              name="experienceType"
              defaultValue={viewerReview?.experienceType ?? ""}
              className="border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select…</option>
              {experienceTypes.map((type) => (
                <option key={type} value={type}>
                  {experienceLabels[type]}
                </option>
              ))}
            </select>
          </div>
          <FormField
            id="experienceDate"
            label="Experience date"
            name="experienceDate"
            type="date"
            required={false}
            defaultValue={
              viewerReview?.experienceDate
                ? viewerReview.experienceDate.toISOString().slice(0, 10)
                : ""
            }
            errors={state.fieldErrors?.experienceDate}
          />
        </div>

        <FormField
          id="tags"
          label="Tags (comma-separated, max 5)"
          name="tags"
          required={false}
          placeholder="fast-delivery, good-packaging"
          defaultValue={viewerReview?.tags.join(", ") ?? ""}
          errors={state.fieldErrors?.tags}
        />

        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="wouldRecommend"
            value="true"
            defaultChecked={viewerReview?.wouldRecommend ?? true}
            className="size-4 rounded border-border"
          />
          I would recommend this business
        </label>

        <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3">
          <p className="text-foreground text-sm font-medium">Proof upload</p>
          <p className="text-muted mt-1 text-xs">
            Photo or screenshot upload coming soon. You can still submit your
            review without proof for now.
          </p>
          <input type="file" disabled className="mt-2 w-full text-xs opacity-50" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground min-h-11 w-full rounded-lg px-4 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting
            ? "Saving…"
            : isEdit
              ? "Update review"
              : "Submit review"}
        </button>
      </form>

      {isEdit && viewerReview ? (
        <form action={deleteAction} className="mt-4 border-t border-border pt-4">
          <input type="hidden" name="reviewId" value={viewerReview.id} />
          <button
            type="submit"
            disabled={isDeleting}
            className="text-sm font-medium text-red-700 hover:underline disabled:opacity-60"
          >
            {isDeleting ? "Deleting…" : "Delete your review"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
