import { ClaimStatus, VerificationStatus } from "@prisma/client";

export type VerificationBadgeDisplay = {
  key: string;
  label: string;
  tone: "neutral" | "claimed" | "verified" | "premium";
  description: string;
};

/**
 * Single primary public badge from claim + verification state.
 * Priority: Trusted seller > Document > Social > Contact > Claimed > Unverified
 */
export function getVerificationBadgeDisplay(
  claimStatus: ClaimStatus | string,
  verificationStatus: VerificationStatus | string,
): VerificationBadgeDisplay {
  if (verificationStatus === VerificationStatus.TRUSTED_SELLER) {
    return {
      key: "TRUSTED_SELLER",
      label: "Trusted seller",
      tone: "premium",
      description: "Highest verification tier on TrustDoko.",
    };
  }
  if (verificationStatus === VerificationStatus.DOCUMENT_VERIFIED) {
    return {
      key: "DOCUMENT_VERIFIED",
      label: "Document verified",
      tone: "verified",
      description: "Business documents were reviewed by TrustDoko.",
    };
  }
  if (verificationStatus === VerificationStatus.SOCIAL_VERIFIED) {
    return {
      key: "SOCIAL_VERIFIED",
      label: "Social verified",
      tone: "verified",
      description: "Social presence was verified by TrustDoko.",
    };
  }
  if (verificationStatus === VerificationStatus.CONTACT_VERIFIED) {
    return {
      key: "CONTACT_VERIFIED",
      label: "Contact verified",
      tone: "verified",
      description: "Contact details were verified by TrustDoko.",
    };
  }
  if (claimStatus === ClaimStatus.CLAIMED) {
    return {
      key: "CLAIMED",
      label: "Claimed",
      tone: "claimed",
      description: "A business owner has claimed this profile.",
    };
  }
  return {
    key: "UNVERIFIED",
    label: "Unverified",
    tone: "neutral",
    description: "This business has not completed TrustDoko verification.",
  };
}

export const verificationBadgeLegend: VerificationBadgeDisplay[] = [
  {
    key: "UNVERIFIED",
    label: "Unverified",
    tone: "neutral",
    description: "No claim or verification on record.",
  },
  {
    key: "CLAIMED",
    label: "Claimed",
    tone: "claimed",
    description: "Owner claimed the profile; verification may still be in progress.",
  },
  {
    key: "CONTACT_VERIFIED",
    label: "Contact verified",
    tone: "verified",
    description: "Phone, email, or website contact was verified.",
  },
  {
    key: "DOCUMENT_VERIFIED",
    label: "Document verified",
    tone: "verified",
    description: "Supporting documents were reviewed.",
  },
  {
    key: "TRUSTED_SELLER",
    label: "Trusted seller",
    tone: "premium",
    description: "Top tier assigned by TrustDoko after sustained trust signals.",
  },
];
