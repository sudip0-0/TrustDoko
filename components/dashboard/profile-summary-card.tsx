import type { UserProfileSummary } from "@/server/queries/user-dashboard";

type ProfileSummaryCardProps = {
  profile: UserProfileSummary;
};

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">Profile</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-muted text-xs font-medium uppercase tracking-wide">
            Name
          </dt>
          <dd className="text-foreground mt-1 text-sm font-medium">
            {profile.name ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted text-xs font-medium uppercase tracking-wide">
            Email
          </dt>
          <dd className="text-foreground mt-1 text-sm">{profile.email}</dd>
        </div>
        <div>
          <dt className="text-muted text-xs font-medium uppercase tracking-wide">
            Member since
          </dt>
          <dd className="text-foreground mt-1 text-sm">
            {profile.memberSince.toLocaleDateString()}
          </dd>
        </div>
        <div>
          <dt className="text-muted text-xs font-medium uppercase tracking-wide">
            Trust level
          </dt>
          <dd className="text-foreground mt-1 text-sm">{profile.trustLevel}</dd>
        </div>
      </dl>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Reviews" value={profile.reviewCount} />
        <Stat label="Complaints" value={profile.complaintCount} />
        <Stat label="Saved" value={profile.savedCount} />
        <Stat label="Claims" value={profile.claimCount} />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted/30 px-3 py-2 text-center">
      <p className="text-foreground text-lg font-bold tabular-nums">{value}</p>
      <p className="text-muted text-xs">{label}</p>
    </div>
  );
}
