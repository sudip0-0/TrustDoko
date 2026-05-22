type AdminProofLinkProps = {
  proofFileId: string | null | undefined;
};

export function AdminProofLink({ proofFileId }: AdminProofLinkProps) {
  if (!proofFileId) {
    return null;
  }

  return (
    <a
      href={`/api/admin/proof/${proofFileId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary inline-flex text-sm font-medium no-underline hover:underline"
    >
      View proof
    </a>
  );
}
