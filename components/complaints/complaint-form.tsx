"use client";

import { useActionState, useState } from "react";

import { ModerationWarning } from "@/components/forms/moderation-warning";
import { ProofFileField } from "@/components/forms/proof-file-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormSection } from "@/components/ui/form-section";
import { Input, Select, Textarea } from "@/components/ui/input";
import { copy } from "@/lib/copy/messages";
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
  proofUploadEnabled?: boolean;
};

export function ComplaintForm({
  businessSlug,
  businessName,
  proofUploadEnabled = false,
}: ComplaintFormProps) {
  const [description, setDescription] = useState("");
  const [state, formAction, isPending] = useActionState(
    submitComplaintAction,
    initialState,
  );

  return (
    <Card className="scroll-mt-24">
      <CardContent className="py-6">
        <h2 className="text-xl font-semibold">Report a serious issue</h2>
        <p className="text-muted mt-1 text-sm leading-relaxed">
          {copy.forms.complaintHelper} Reporting about {businessName}.
        </p>

        {state.success && state.message ? (
          <Alert variant="success" className="mt-4">
            {state.message}
          </Alert>
        ) : null}

        {state.error ? (
          <Alert variant="error" className="mt-4">
            {state.error}
          </Alert>
        ) : null}

        {!state.success ? (
          <form
            action={formAction}
            encType={proofUploadEnabled ? "multipart/form-data" : undefined}
            className="mt-6 space-y-6"
          >
            <input type="hidden" name="businessSlug" value={businessSlug} />

            <FormSection
              title="Complaint details"
              description="Describe what happened. Include order or payment references in your description if helpful."
            >
              <div className="form-field">
                <label
                  htmlFor="category"
                  className="text-foreground block text-sm font-medium"
                >
                  Complaint type <span className="text-destructive">*</span>
                </label>
                <Select
                  id="category"
                  name="category"
                  required
                  defaultValue=""
                  aria-invalid={Boolean(state.fieldErrors?.category)}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {complaintCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {complaintCategoryLabels[cat]}
                    </option>
                  ))}
                </Select>
                {state.fieldErrors?.category ? (
                  <p className="text-destructive text-sm" role="alert">
                    {state.fieldErrors.category[0]}
                  </p>
                ) : null}
              </div>

              <div className="form-field">
                <label
                  htmlFor="description"
                  className="text-foreground block text-sm font-medium"
                >
                  Describe your issue <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  minLength={30}
                  maxLength={5000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you ordered, amounts paid (NPR), dates, and what the seller did or failed to do. Minimum 30 characters."
                  aria-invalid={Boolean(state.fieldErrors?.description)}
                />
                {state.fieldErrors?.description ? (
                  <p className="text-destructive text-sm" role="alert">
                    {state.fieldErrors.description[0]}
                  </p>
                ) : null}
              </div>

              <ModerationWarning body={description} />
            </FormSection>

            <FormSection title="When and how much">
              <div className="form-field">
                <label
                  htmlFor="experienceDate"
                  className="text-foreground block text-sm font-medium"
                >
                  When did this happen? <span className="text-destructive">*</span>
                </label>
                <Input
                  id="experienceDate"
                  name="experienceDate"
                  type="date"
                  required
                  max={new Date().toISOString().slice(0, 10)}
                  aria-invalid={Boolean(state.fieldErrors?.experienceDate)}
                />
                {state.fieldErrors?.experienceDate ? (
                  <p className="text-destructive text-sm" role="alert">
                    {state.fieldErrors.experienceDate[0]}
                  </p>
                ) : null}
              </div>

              <div className="form-field">
                <label
                  htmlFor="amountRange"
                  className="text-foreground block text-sm font-medium"
                >
                  Amount involved (optional)
                </label>
                <Select id="amountRange" name="amountRange" defaultValue="">
                  <option value="">Not specified</option>
                  {complaintAmountRanges.map((range) => (
                    <option key={range} value={range}>
                      {complaintAmountRangeLabels[range]}
                    </option>
                  ))}
                </Select>
              </div>
            </FormSection>

            <ProofFileField
              enabled={proofUploadEnabled}
              errors={state.fieldErrors?.proof}
            />

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card px-3 py-3 text-sm">
              <input
                id="allowAdminContact"
                type="checkbox"
                name="allowAdminContact"
                value="true"
                className="mt-1 size-4 rounded border-border"
              />
              <span>
                TrustDoko admins may contact me privately about this report. Your
                details are not shown on the public profile.
              </span>
            </label>

            <Button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? "Submitting…" : "Submit complaint"}
            </Button>
          </form>
        ) : null}
      </CardContent>
    </Card>
  );
}
