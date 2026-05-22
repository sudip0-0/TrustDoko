"use client";

import { useActionState } from "react";

import {
  complaintAmountRangeLabels,
  complaintAmountRanges,
} from "@/lib/validations/complaint";
import {
  complaintCategories,
  complaintCategoryLabels,
} from "@/lib/complaints/categories";
import {
  submitComplaintAction,
  type ComplaintActionState,
} from "@/server/actions/complaints";

const initialState: ComplaintActionState = {};

type ComplaintFormProps = {
  businessSlug: string;
  businessName: string;
};

export function ComplaintForm({ businessSlug, businessName }: ComplaintFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitComplaintAction,
    initialState,
  );

  return (
    <section
      id="report-issue"
      className="scroll-mt-24 rounded-xl border border-border bg-card p-6"
    >
      <h2 className="text-xl font-semibold">Report an issue</h2>
      <p className="text-muted mt-1 text-sm leading-relaxed">
        File a complaint about {businessName} for delivery problems, refunds,
        misleading pricing, or other serious issues. This is separate from
        writing a review.
      </p>

      {state.success ? (
        <p
          className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900"
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      {state.error ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      {!state.success ? (
        <form action={formAction} className="mt-6 space-y-5">
          <input type="hidden" name="businessSlug" value={businessSlug} />

          <div>
            <label htmlFor="category" className="text-foreground block text-sm font-medium">
              Complaint category <span className="text-red-600">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              defaultValue=""
            >
              <option value="" disabled>
                Select a category
              </option>
              {complaintCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {complaintCategoryLabels[cat]}
                </option>
              ))}
            </select>
            {state.fieldErrors?.category ? (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.category[0]}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="description" className="text-foreground block text-sm font-medium">
              What happened? <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              minLength={30}
              maxLength={5000}
              placeholder="Describe the issue in detail: what you ordered, what went wrong, and any steps you already took."
              className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            {state.fieldErrors?.description ? (
              <p className="mt-1 text-sm text-red-600">
                {state.fieldErrors.description[0]}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="experienceDate"
              className="text-foreground block text-sm font-medium"
            >
              When did this happen? <span className="text-red-600">*</span>
            </label>
            <input
              id="experienceDate"
              name="experienceDate"
              type="date"
              required
              max={new Date().toISOString().slice(0, 10)}
              className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
            {state.fieldErrors?.experienceDate ? (
              <p className="mt-1 text-sm text-red-600">
                {state.fieldErrors.experienceDate[0]}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="amountRange" className="text-foreground block text-sm font-medium">
              Amount involved (optional)
            </label>
            <select
              id="amountRange"
              name="amountRange"
              className="border-border bg-background mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              defaultValue=""
            >
              <option value="">Not specified</option>
              {complaintAmountRanges.map((range) => (
                <option key={range} value={range}>
                  {complaintAmountRangeLabels[range]}
                </option>
              ))}
            </select>
            {state.fieldErrors?.amountRange ? (
              <p className="mt-1 text-sm text-red-600">
                {state.fieldErrors.amountRange[0]}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="proof" className="text-foreground block text-sm font-medium">
              Proof (optional)
            </label>
            <input
              id="proof"
              name="proof"
              type="file"
              disabled
              className="text-muted mt-1.5 w-full cursor-not-allowed text-sm opacity-60"
            />
            <p className="text-muted mt-1 text-xs">
              File uploads will be available in a future update. You can describe
              evidence in your report for now.
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="allowAdminContact"
              value="true"
              className="mt-1"
            />
            <span>
              I allow TrustDoko admins to contact me about this report for
              follow-up. Your contact details are not shown publicly.
            </span>
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground w-full rounded-lg px-5 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60 sm:w-auto"
          >
            {isPending ? "Submitting…" : "Submit complaint"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
