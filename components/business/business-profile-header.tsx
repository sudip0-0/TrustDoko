import { TrustScoreDisplay } from "@/components/business/trust-score-display";
import { VerificationBadge } from "@/components/business/verification-badge";
import { VerificationLegend } from "@/components/business/verification-legend";
import {
  formatBusinessType,
  formatClaimStatus,
  formatVerificationStatus,
} from "@/lib/business/display";
import { getVerificationBadgeDisplay } from "@/lib/business/verification-display";
import { copy } from "@/lib/copy/messages";
import { resolveTrustLabelForBusiness } from "@/lib/trust-score";
import type { ClaimStatus } from "@prisma/client";
import type { BusinessProfileData } from "@/server/queries/business-profile";

type BusinessProfileHeaderProps = {
  business: BusinessProfileData;
};

function formatLocation(
  city: string | null,
  province: string | null,
  address: string | null,
): string {
  const parts = [address, city, province].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Nepal";
}

export function BusinessProfileHeader({ business }: BusinessProfileHeaderProps) {
  const trustLabel = resolveTrustLabelForBusiness({
    trustScore: business.trustScore,
    claimStatus: business.claimStatus as ClaimStatus,
    trustScoreReasons: business.trustScoreReasons,
  });
  const verificationDisplay = getVerificationBadgeDisplay(
    business.claimStatus,
    business.verificationStatus,
  );

  return (
    <header className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/20 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {business.name}
            </h1>
            {business.category ? (
              <p className="text-muted mt-2 text-sm">{business.category.name}</p>
            ) : null}
            <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed">
              {copy.trust.beforeYouPay}
            </p>
          </div>
          <div className="w-full shrink-0 lg:max-w-xs">
            <TrustScoreDisplay
              trustScore={business.trustScore}
              trustLabel={trustLabel}
              variant="featured"
            />
            <div className="mt-3">
              <VerificationBadge
                claimStatus={business.claimStatus}
                verificationStatus={business.verificationStatus}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        {business.description ? (
          <p className="text-muted mb-6 max-w-3xl leading-relaxed">
            {business.description}
          </p>
        ) : null}

        <dl className="text-muted grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-foreground font-medium">Location</dt>
            <dd>{formatLocation(business.city, business.province, business.address)}</dd>
          </div>
          <div>
            <dt className="text-foreground font-medium">Business type</dt>
            <dd>{formatBusinessType(business.businessType)}</dd>
          </div>
          <div>
            <dt className="text-foreground font-medium">Verification</dt>
            <dd>
              {verificationDisplay.label}
              {verificationDisplay.key !== "UNVERIFIED"
                ? ` (${formatVerificationStatus(business.verificationStatus)})`
                : ""}
            </dd>
          </div>
          <div>
            <dt className="text-foreground font-medium">Profile status</dt>
            <dd>{formatClaimStatus(business.claimStatus)}</dd>
          </div>
          {business.phone ? (
            <div>
              <dt className="text-foreground font-medium">Phone</dt>
              <dd>{business.phone}</dd>
            </div>
          ) : null}
          {business.email ? (
            <div>
              <dt className="text-foreground font-medium">Email</dt>
              <dd>{business.email}</dd>
            </div>
          ) : null}
        </dl>

        {(business.websiteUrl ||
          business.facebookUrl ||
          business.instagramUrl ||
          business.tiktokUrl) && (
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {business.websiteUrl ? (
              <a
                href={business.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium no-underline hover:underline"
              >
                Website
              </a>
            ) : null}
            {business.facebookUrl ? (
              <a
                href={business.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium no-underline hover:underline"
              >
                Facebook
              </a>
            ) : null}
            {business.instagramUrl ? (
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium no-underline hover:underline"
              >
                Instagram
              </a>
            ) : null}
            {business.tiktokUrl ? (
              <a
                href={business.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium no-underline hover:underline"
              >
                TikTok
              </a>
            ) : null}
          </div>
        )}

        <VerificationLegend />
      </div>
    </header>
  );
}
