"use client";

import { useActionState } from "react";

import { FormField } from "@/components/auth/form-field";
import { ProofFileField } from "@/components/forms/proof-file-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormSection } from "@/components/ui/form-section";
import { Select, Textarea } from "@/components/ui/input";
import { copy } from "@/lib/copy/messages";
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
  proofUploadEnabled?: boolean;
};

export function ReviewForm({
  businessSlug,
  businessName,
  viewerReview,
  proofUploadEnabled = false,
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

  const state =
    submitState.error || submitState.fieldErrors ? submitState : deleteState;

  return (
    <Card id="write-review" className="scroll-mt-24">
      <CardContent className="py-6">
        <h2 className="text-xl font-semibold">
          {isEdit ? "Edit your review" : "Write a review"}
        </h2>
        <p className="text-muted mt-1 text-sm leading-relaxed">
          {copy.forms.reviewHelper} Sharing for {businessName}.
        </p>

        {(submitState.success || deleteState.success) &&
        (submitState.message || deleteState.message) ? (
          <Alert variant="success" className="mt-4">
            {submitState.message ?? deleteState.message}
          </Alert>
        ) : null}

        {state.error ? (
          <Alert variant="error" className="mt-4">
            {state.error}
          </Alert>
        ) : null}

        <form
          action={submitAction}
          encType={proofUploadEnabled ? "multipart/form-data" : undefined}
          className="mt-6 space-y-5"
        >
          <input type="hidden" name="businessSlug" value={businessSlug} />
          {isEdit && viewerReview ? (
            <input type="hidden" name="reviewId" value={viewerReview.id} />
          ) : null}

          <FormSection title="Your rating" description="How would you rate your overall experience?">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <label
                  key={value}
                  className="border-border has-[:checked]:border-primary has-[:checked]:bg-primary/10 flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors hover:border-primary/40"
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
              <p className="text-destructive text-sm" role="alert">
                {state.fieldErrors.rating[0]}
              </p>
            ) : null}
          </FormSection>

          <FormSection title="Review details">
            <FormField
              id="title"
              label="Title (optional)"
              name="title"
              required={false}
              defaultValue={viewerReview?.title ?? ""}
              errors={state.fieldErrors?.title}
            />

            <div className="form-field">
              <label htmlFor="body" className="text-foreground block text-sm font-medium">
                Your review <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="body"
                name="body"
                required
                rows={5}
                defaultValue={viewerReview?.body ?? ""}
                placeholder="What went well or poorly? Mention delivery, product quality, payment method (eSewa/Khalti/bank), and communication."
                aria-invalid={Boolean(state.fieldErrors?.body)}
              />
              {state.fieldErrors?.body ? (
                <p className="text-destructive text-sm" role="alert">
                  {state.fieldErrors.body[0]}
                </p>
              ) : null}
            </div>
          </FormSection>

          <FormSection title="Experience context">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="form-field">
                <label
                  htmlFor="experienceType"
                  className="text-foreground block text-sm font-medium"
                >
                  Experience type
                </label>
                <Select
                  id="experienceType"
                  name="experienceType"
                  defaultValue={viewerReview?.experienceType ?? ""}
                >
                  <option value="">Select…</option>
                  {experienceTypes.map((type) => (
                    <option key={type} value={type}>
                      {experienceLabels[type]}
                    </option>
                  ))}
                </Select>
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

            <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm">
              <input
                type="checkbox"
                name="wouldRecommend"
                value="true"
                defaultChecked={viewerReview?.wouldRecommend ?? true}
                className="size-4 rounded border-border"
              />
              I would recommend this business
            </label>
          </FormSection>

          <ProofFileField
            enabled={proofUploadEnabled}
            errors={state.fieldErrors?.proof}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting
              ? "Saving…"
              : isEdit
                ? "Update review"
                : "Submit review"}
          </Button>
        </form>

        {isEdit && viewerReview ? (
          <form action={deleteAction} className="mt-4 border-t border-border pt-4">
            <input type="hidden" name="reviewId" value={viewerReview.id} />
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              aria-busy={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete your review"}
            </Button>
          </form>
        ) : null}
      </CardContent>
    </Card>
  );
}
