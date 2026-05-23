/** Trust-focused, Nepal-specific copy used across the app. */

export const copy = {
  brand: {
    tagline: "Trust reviews for Nepali businesses",
    nepal: "Built for shoppers and sellers across Nepal.",
  },
  trust: {
    disclaimer:
      "Trust scores reflect community-reported signals on TrustDoko — not a legal finding or guarantee of safety.",
    beforeYouPay: "Check trust signals before you pay or send money.",
    communityReported: "Based on moderated reviews and complaints from the community.",
  },
  errors: {
    signInRequired: "Sign in to continue. Your activity stays tied to your account.",
    signInFailed: "We could not sign you in. Check your email and password, then try again.",
    generic: "Something went wrong. Please try again in a moment.",
    notFound: "We could not find that page or business. Check the link or browse the directory.",
    forbidden: "You do not have permission to view or change this.",
    rateLimitReview:
      "Please wait a few minutes before submitting another review.",
    rateLimitComplaint:
      "You have reached today’s complaint limit. Try again tomorrow.",
  },
  forms: {
    reviewHelper:
      "Share an honest experience with a Nepali online seller or service. Reviews are moderated before they appear publicly.",
    complaintHelper:
      "Report serious issues such as non-delivery, fake products, or refund problems. This is separate from leaving a star review.",
    claimHelper:
      "Claim this profile if you operate the business. TrustDoko verifies claims before you can edit the profile or respond publicly.",
    proofComingSoon:
      "Photo proof uploads are coming soon. For now, describe your experience in detail.",
    proofHelper:
      "Optional: attach a receipt, chat screenshot, or PDF (JPEG, PNG, WebP, or PDF — max 5 MB). Proof is private and only visible to TrustDoko moderators.",
    proofInvalidType:
      "That file type is not supported. Use JPEG, PNG, WebP, or PDF.",
    proofTooLarge: "That file is too large. Maximum size is 5 MB.",
    proofEmpty: "The selected file is empty. Choose another file or continue without proof.",
    proofUploadFailed:
      "We could not upload your file. Try again in a moment or submit without proof.",
    proofStorageUnavailable:
      "File uploads are not available right now. You can still submit your report without proof.",
    proofHasFile: "Proof file attached (moderators only)",
    proofInvalidFilename:
      "That filename is not allowed. Use a short name ending in .jpg, .png, .webp, or .pdf.",
    proofMimeMismatch:
      "The file content does not match its type. Upload a genuine JPEG, PNG, WebP, or PDF.",
    proofMultipleFiles: "Upload one file at a time.",
    proofRateLimited:
      "You have uploaded too many files recently. Please wait before trying again.",
  },
  moderation: {
    warningTitle: "This may need careful review",
    warningBody:
      "We detected wording that needs moderation. Do not publish serious accusations as facts. Your submission may be checked before it appears publicly.",
    guidanceLink: "Read our trust and moderation guidance",
    pendingPublish: "This may be checked before publishing.",
    proofPrivateLabel: "Proof files are private",
    proofPrivateDetail:
      "We never share your files publicly. They are only used to review your report.",
  },
  empty: {
    businesses:
      "No businesses match your search yet. Try a different keyword or category.",
    reviews:
      "No reviews yet. Be the first to share your experience and help others shop with more confidence.",
    complaints:
      "No complaints filed. Report serious issues if something went wrong with an order or service.",
    saved:
      "No saved businesses yet. Save profiles you want to compare before you pay.",
    ownerBusinesses:
      "No claimed businesses yet. After admin approves your claim, you can manage the profile here.",
    notifications:
      "No recent activity yet. Submit a review, file a complaint, or claim a business to see updates here.",
  },
} as const;

export function formatModerationStatus(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Pending review",
    APPROVED: "Published",
    REJECTED: "Not published",
    FLAGGED: "Flagged",
    UNDER_REVIEW: "Under review",
    SUBMITTED: "Submitted",
    BUSINESS_RESPONDED: "Business responded",
    RESOLVED: "Resolved",
    UNRESOLVED: "Unresolved",
  };
  return labels[status] ?? status.replace(/_/g, " ").toLowerCase();
}
