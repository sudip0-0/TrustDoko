type ClaimPendingBannerProps = {
  businessName: string;
};

export function ClaimPendingBanner({ businessName }: ClaimPendingBannerProps) {
  return (
    <p
      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      role="status"
    >
      A claim for {businessName} is under review. You will be able to manage this
      profile after TrustDoko approves your request.
    </p>
  );
}
