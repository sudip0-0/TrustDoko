import type { UserProfileSummary } from "@/server/queries/user-dashboard";

type ProfileSummaryCardProps = {
  profile: UserProfileSummary;
};

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/20 px-6 py-4">
        <h2 className="text-base font-semibold">Your profile</h2>
        <p className="text-muted mt-1 text-sm">
          Account details and activity summary on TrustDoko.
        </p>
      </div>

      <dl className="grid gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
        <ProfileField label="Name" value={profile.name ?? "Not set"} />
        <ProfileField label="Email" value={profile.email} />
        <ProfileField
          label="Member since"
          value={profile.memberSince.toLocaleDateString()}
        />
        <ProfileField label="Trust level" value={profile.trustLevel} />
      </dl>

      <div className="grid grid-cols-2 divide-x divide-y divide-border border-t border-border sm:grid-cols-4 sm:divide-y-0">
        <Stat label="Reviews" value={profile.reviewCount} />
        <Stat label="Complaints" value={profile.complaintCount} />
        <Stat label="Saved" value={profile.savedCount} />
        <Stat label="Claims" value={profile.claimCount} />
      </div>
    </section>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd className="text-foreground mt-1 text-sm font-medium break-words">{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-4 py-4 text-center sm:px-6">
      <p className="type-metric text-foreground text-2xl">{value}</p>
      <p className="text-muted mt-1 text-xs font-medium">{label}</p>
    </div>
  );
}
