import { copy } from "@/lib/copy/messages";

const PROOF_FIELD_NAME = "proof";

export type ProofFormDataResult =
  | { ok: true; file: File | null }
  | { ok: false; error: string };

/** Returns the proof file from FormData; rejects multiple files. */
export function getProofFileFromFormData(formData: FormData): ProofFormDataResult {
  const all = formData.getAll(PROOF_FIELD_NAME);
  const files = all.filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length > 1) {
    return { ok: false, error: copy.forms.proofMultipleFiles };
  }

  if (files.length === 0) {
    return { ok: true, file: null };
  }

  return { ok: true, file: files[0]! };
}
