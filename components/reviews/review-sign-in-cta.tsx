import Link from "next/link";

type ReviewSignInCtaProps = {
  businessSlug: string;
};

export function ReviewSignInCta({ businessSlug }: ReviewSignInCtaProps) {
  const callbackUrl = `/businesses/${businessSlug}#write-review`;

  return (
    <section
      id="write-review"
      className="scroll-mt-24 rounded-xl border border-dashed border-border bg-card px-6 py-8 text-center"
    >
      <h2 className="text-lg font-semibold">Share your experience</h2>
      <p className="text-muted mx-auto mt-2 max-w-md text-sm leading-relaxed">
        Sign in to write a review for this business. Your feedback helps others
        decide with confidence.
      </p>
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        className="bg-primary text-primary-foreground mt-6 inline-flex min-h-11 items-center rounded-lg px-5 py-2.5 text-sm font-semibold no-underline hover:opacity-90"
      >
        Sign in to write a review
      </Link>
    </section>
  );
}
