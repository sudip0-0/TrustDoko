import { copy } from "@/lib/copy/messages";
import { PROOF_ACCEPT_ATTRIBUTE } from "@/lib/storage/constants";

type ProofFileFieldProps = {
  enabled: boolean;
  errors?: string[];
  id?: string;
};

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="text-primary h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 1a4.5 4.5 0 0 0-4.5 4.5V7H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 6V5.5a3 3 0 1 0-6 0V7h6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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
    <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-foreground text-sm font-medium">
          Add receipt or screenshot (optional)
        </label>
        <span className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold">
          <LockIcon />
          {copy.moderation.proofPrivateLabel}
        </span>
      </div>
      <input
        id={id}
        name="proof"
        type="file"
        accept={PROOF_ACCEPT_ATTRIBUTE}
        className="border-border bg-card text-foreground mt-3 block w-full rounded-lg border px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
        aria-invalid={Boolean(errors?.length)}
        aria-describedby={`${id}-hint`}
      />
      <p id={`${id}-hint`} className="text-muted mt-2 text-xs leading-relaxed">
        {copy.forms.proofHelper} {copy.moderation.proofPrivateDetail}
      </p>
      {errors?.length ? (
        <p className="text-destructive mt-2 text-sm" role="alert">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}
