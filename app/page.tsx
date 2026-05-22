import Link from "next/link";

import { ContentWidth } from "@/components/layout/content-width";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { copy } from "@/lib/copy/messages";

const pillars = [
  {
    title: "Community reviews",
    description:
      "Read moderated reviews from real customers before you transfer money or pay on delivery.",
  },
  {
    title: "Complaint history",
    description:
      "See unresolved delivery, refund, and fraud reports — and whether the business responded.",
  },
  {
    title: "Verified claims",
    description:
      "Business owners can claim profiles, verify contact details, and reply publicly on TrustDoko.",
  },
] as const;

const steps = [
  {
    step: "1",
    title: "Search a seller",
    body: "Find online shops, social sellers, and service providers listed across Nepal.",
  },
  {
    step: "2",
    title: "Read trust signals",
    body: "Compare trust score, reviews, complaints, and verification badges in one place.",
  },
  {
    step: "3",
    title: "Decide with confidence",
    body: "Use community evidence alongside your own judgment — especially before prepaying.",
  },
] as const;

export default function HomePage() {
  return (
    <ContentWidth className="py-12 sm:py-16">
      <section className="hero-grain relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-14 shadow-sm sm:px-10 sm:py-16">
        <p className="text-primary mb-4 text-sm font-semibold tracking-wide uppercase">
          Nepal-focused consumer protection
        </p>
        <h1 className="text-foreground max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Can you trust this business before you pay?
        </h1>
        <p className="text-muted mt-6 max-w-2xl text-lg leading-relaxed">
          TrustDoko helps you check reviews, complaint history, and verification
          status before you buy from online sellers, Instagram shops, and local
          service providers in Nepal.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/businesses" size="lg">
            Browse businesses
          </ButtonLink>
          <ButtonLink href="/about" variant="secondary" size="lg">
            How trust scores work
          </ButtonLink>
        </div>
        <p className="text-muted mt-8 max-w-xl text-sm leading-relaxed">
          {copy.trust.disclaimer}
        </p>
      </section>

      <section className="mt-16" aria-labelledby="pillars-heading">
        <h2 id="pillars-heading" className="text-foreground text-2xl font-bold">
          What you can check on TrustDoko
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {pillars.map((item) => (
            <Card key={item.title} className="p-6">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="how-heading">
        <h2 id="how-heading" className="text-foreground text-2xl font-bold">
          How it works
        </h2>
        <ol className="mt-8 grid list-none gap-6 p-0 sm:grid-cols-3">
          {steps.map((item) => (
            <li
              key={item.step}
              className="rounded-xl border border-border bg-card p-6"
            >
              <span
                className="bg-primary text-primary-foreground inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                aria-hidden="true"
              >
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 rounded-xl border border-primary/20 bg-accent px-6 py-8 text-center sm:px-10">
        <h2 className="text-foreground text-xl font-bold">
          Shopping from a social seller?
        </h2>
        <p className="text-muted mx-auto mt-2 max-w-lg text-sm leading-relaxed">
          Search their business name before you send NPR via eSewa, Khalti, or bank
          transfer. {copy.trust.communityReported}
        </p>
        <Link
          href="/businesses"
          className="text-primary mt-4 inline-block text-sm font-semibold no-underline hover:underline"
        >
          Start browsing →
        </Link>
      </section>
    </ContentWidth>
  );
}
