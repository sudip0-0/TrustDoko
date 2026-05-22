"use client";

import { useActionState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
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
};

export function ClaimForm({ businessSlug, businessName }: ClaimFormProps) {
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
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="businessSlug" value={businessSlug} />

      <p className="text-muted text-sm leading-relaxed">{copy.forms.claimHelper}</p>

      {state.error ? <Alert variant="error">{state.error}</Alert> : null}

      <div>
        <label htmlFor="ownerName" className="text-foreground block text-sm font-medium">
          Owner name <span className="text-destructive">*</span>
        </label>
        <Input
          id="ownerName"
          name="ownerName"
          required
          maxLength={120}
          className="mt-1.5"
          aria-invalid={Boolean(state.fieldErrors?.ownerName)}
        />
        {state.fieldErrors?.ownerName ? (
          <p className="text-destructive mt-1 text-sm" role="alert">
            {state.fieldErrors.ownerName[0]}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ownerEmail" className="text-foreground block text-sm font-medium">
          Owner email <span className="text-destructive">*</span>
        </label>
        <Input
          id="ownerEmail"
          name="ownerEmail"
          type="email"
          required
          maxLength={200}
          className="mt-1.5"
          aria-invalid={Boolean(state.fieldErrors?.ownerEmail)}
        />
        {state.fieldErrors?.ownerEmail ? (
          <p className="text-destructive mt-1 text-sm" role="alert">
            {state.fieldErrors.ownerEmail[0]}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ownerPhone" className="text-foreground block text-sm font-medium">
          Owner phone (optional)
        </label>
        <Input
          id="ownerPhone"
          name="ownerPhone"
          type="tel"
          maxLength={30}
          className="mt-1.5"
        />
      </div>

      <div>
        <label htmlFor="method" className="text-foreground block text-sm font-medium">
          Verification method <span className="text-destructive">*</span>
        </label>
        <Select id="method" name="method" required defaultValue="" className="mt-1.5">
          <option value="" disabled>
            Select how you can verify ownership
          </option>
          {claimMethods.map((method) => (
            <option key={method} value={method}>
              {claimMethodLabels[method]}
            </option>
          ))}
        </Select>
        {state.fieldErrors?.method ? (
          <p className="text-destructive mt-1 text-sm" role="alert">
            {state.fieldErrors.method[0]}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="text-foreground block text-sm font-medium">
          Message <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          minLength={20}
          maxLength={2000}
          className="mt-1.5"
          placeholder={`Explain your relationship to ${businessName} and how TrustDoko can verify you operate this business.`}
          aria-invalid={Boolean(state.fieldErrors?.message)}
        />
        {state.fieldErrors?.message ? (
          <p className="text-destructive mt-1 text-sm" role="alert">
            {state.fieldErrors.message[0]}
          </p>
        ) : null}
      </div>

      <Alert variant="info" title="Documents">
        Supporting document upload is coming soon. Include registration details or
        official contact channels in your message.
      </Alert>

      <Button type="submit" disabled={isPending} aria-busy={isPending} className="w-full sm:w-auto">
        {isPending ? "Submitting…" : "Submit claim request"}
      </Button>
    </form>
  );
}
