import Link from "next/link";

type ComplaintSignInCtaProps = {
  businessSlug: string;
};

export function ComplaintSignInCta({ businessSlug }: ComplaintSignInCtaProps) {
  const callbackUrl = `/businesses/${businessSlug}#report-issue`;

  return (
    <section
      id="report-issue"
      className="scroll-mt-24 rounded-xl border border-dashed border-border bg-card px-6 py-8 text-center"
    >
      <h2 className="type-h3">Report a serious issue</h2>
      <p className="text-muted mx-auto mt-2 max-w-md text-sm leading-relaxed">
        Sign in to file a complaint separate from a review. Reports help TrustDoko
        track unresolved issues and under-review cases.
      </p>
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        className="bg-primary text-primary-foreground mt-6 inline-flex min-h-11 items-center rounded-lg px-5 py-2.5 text-sm font-semibold no-underline hover:opacity-90"
      >
        Sign in to report an issue
      </Link>
    </section>
  );
}
