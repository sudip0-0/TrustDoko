"use client";

import { useActionState } from "react";

import {
  FormField,
  FormSelectField,
  FormTextareaField,
} from "@/components/auth/form-field";
import { ProofFileField } from "@/components/forms/proof-file-field";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/ui/form-section";
import { copy } from "@/lib/copy/messages";
import { claimMethodLabels, claimMethods } from "@/lib/claims/method-labels";
import {
  submitClaimAction,
  type ClaimActionState,
} from "@/server/actions/claims";

const initialState: ClaimActionState = {};

type ClaimFormProps = {
  businessSlug: string;
  businessName: string;
  proofUploadEnabled?: boolean;
};

export function ClaimForm({
  businessSlug,
  businessName,
  proofUploadEnabled = false,
}: ClaimFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitClaimAction,
    initialState,
  );

  if (state.success) {
    return (
      <Alert variant="success" role="status">
        {state.message}
      </Alert>
    );
  }

  return (
    <form
      action={formAction}
      encType={proofUploadEnabled ? "multipart/form-data" : undefined}
      className="space-y-6"
    >
      <input type="hidden" name="businessSlug" value={businessSlug} />

      <p className="text-muted text-sm leading-relaxed">
        {copy.forms.claimHelper}
      </p>

      {state.error ? <Alert variant="error">{state.error}</Alert> : null}

      <FormSection
        title="Owner details"
        description="Use contact information TrustDoko admins can reach for verification."
      >
        <FormField
          id="ownerName"
          label="Owner name"
          name="ownerName"
          errors={state.fieldErrors?.ownerName}
        />
        <FormField
          id="ownerEmail"
          label="Owner email"
          name="ownerEmail"
          type="email"
          errors={state.fieldErrors?.ownerEmail}
        />
        <FormField
          id="ownerPhone"
          label="Owner phone"
          name="ownerPhone"
          type="tel"
          required={false}
        />
      </FormSection>

      <FormSection
        title="Verification request"
        description={`Explain your relationship to ${businessName} and how ownership can be confirmed.`}
      >
        <FormSelectField
          id="method"
          label="Verification method"
          name="method"
          placeholder="Select how you can verify ownership"
          errors={state.fieldErrors?.method}
        >
          {claimMethods.map((method) => (
            <option key={method} value={method}>
              {claimMethodLabels[method]}
            </option>
          ))}
        </FormSelectField>

        <FormTextareaField
          id="message"
          label="Message"
          name="message"
          rows={4}
          minLength={20}
          maxLength={2000}
          placeholder={`Explain your relationship to ${businessName} and how TrustDoko can verify you operate this business.`}
          errors={state.fieldErrors?.message}
        />
      </FormSection>

      <FormSection
        title="Supporting document"
        description="Attach business registration, PAN/VAT, or other ownership proof when available."
      >
        <ProofFileField
          enabled={proofUploadEnabled}
          errors={state.fieldErrors?.proof}
          id="claim-proof"
          label="Add business document (optional)"
        />
      </FormSection>

      <Button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="w-full sm:w-auto"
      >
        {isPending ? "Submitting…" : "Submit claim request"}
      </Button>
    </form>
  );
}
