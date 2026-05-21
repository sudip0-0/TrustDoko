import { TrustLabelBadge } from "@/components/business/trust-label-badge";
import {
  formatBusinessType,
  formatClaimStatus,
  formatVerificationStatus,
} from "@/lib/business/display";
import { getTrustLabelFromScore } from "@/lib/trust-score";
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
  const trustLabel = getTrustLabelFromScore(business.trustScore);

  return (
    <header className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{business.name}</h1>
          {business.category ? (
            <p className="text-muted mt-2 text-sm">{business.category.name}</p>
          ) : null}
        </div>
        <TrustLabelBadge trustLabel={trustLabel} />
      </div>

      {business.description ? (
        <p className="text-muted mt-4 max-w-3xl leading-relaxed">
          {business.description}
        </p>
      ) : null}

      <dl className="text-muted mt-6 grid gap-3 text-sm sm:grid-cols-2">
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
          <dd>{formatVerificationStatus(business.verificationStatus)}</dd>
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
              className="text-primary font-medium"
            >
              Website
            </a>
          ) : null}
          {business.facebookUrl ? (
            <a
              href={business.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium"
            >
              Facebook
            </a>
          ) : null}
          {business.instagramUrl ? (
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium"
            >
              Instagram
            </a>
          ) : null}
          {business.tiktokUrl ? (
            <a
              href={business.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium"
            >
              TikTok
            </a>
          ) : null}
        </div>
      )}
    </header>
  );
}
