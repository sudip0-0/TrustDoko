export function formatVerificationStatus(status: string): string {
  const labels: Record<string, string> = {
    UNVERIFIED: "Unverified",
    CONTACT_VERIFIED: "Contact verified",
    DOCUMENT_VERIFIED: "Document verified",
    SOCIAL_VERIFIED: "Social verified",
  };
  return labels[status] ?? status;
}

export function formatClaimStatus(status: string): string {
  const labels: Record<string, string> = {
    UNCLAIMED: "Unclaimed profile",
    PENDING: "Claim pending",
    CLAIMED: "Claimed",
    REJECTED: "Claim rejected",
  };
  return labels[status] ?? status;
}

export function formatBusinessType(type: string): string {
  const labels: Record<string, string> = {
    ONLINE_ONLY: "Online only",
    PHYSICAL: "Physical store",
    HYBRID: "Online & physical",
  };
  return labels[type] ?? type;
}
