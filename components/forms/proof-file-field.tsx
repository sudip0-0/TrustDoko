import { copy } from "@/lib/copy/messages";
import { PROOF_ACCEPT_ATTRIBUTE } from "@/lib/storage/constants";

type ProofFileFieldProps = {
  enabled: boolean;
  errors?: string[];
  id?: string;
};

export function ProofFileField({
  enabled,
  errors,
  id = "proof",
}: ProofFileFieldProps) {
  if (!enabled) {
    return (
      <p className="text-muted text-sm leading-relaxed">{copy.forms.proofComingSoon}</p>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="text-foreground block text-sm font-medium">
        Proof (optional)
      </label>
      <input
        id={id}
        name="proof"
        type="file"
        accept={PROOF_ACCEPT_ATTRIBUTE}
        className="border-border bg-background text-foreground mt-1.5 block w-full max-w-md rounded-lg border px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
        aria-invalid={Boolean(errors?.length)}
        aria-describedby={`${id}-hint`}
      />
      <p id={`${id}-hint`} className="text-muted mt-1.5 text-xs leading-relaxed">
        {copy.forms.proofHelper}
      </p>
      {errors?.length ? (
        <p className="text-destructive mt-1 text-sm" role="alert">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}
