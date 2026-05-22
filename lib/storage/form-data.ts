const PROOF_FIELD_NAME = "proof";

/** Returns the proof file from FormData when present and non-empty. */
export function getProofFileFromFormData(formData: FormData): File | null {
  const value = formData.get(PROOF_FIELD_NAME);
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }
  return value;
}
