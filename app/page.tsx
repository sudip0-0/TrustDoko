import type { Metadata } from "next";

import { ContentWidth } from "@/components/layout/content-width";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { copy } from "@/lib/copy/messages";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Trust reviews for Nepali businesses",
  description:
    "Check trust scores, community reviews, and complaint history before you pay online sellers across Nepal.",
  path: "/",
});

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
      <section className="hero-grain grid gap-10 overflow-hidden rounded-2xl border border-border bg-card px-6 py-12 shadow-sm sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end">
        <div>
          <p className="text-primary mb-4 text-xs font-semibold tracking-wide uppercase">
            Nepal-focused consumer protection
          </p>
          <h1 className="text-foreground max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
            Can you trust this business before you pay?
          </h1>
          <p className="text-muted mt-6 max-w-xl text-lg leading-relaxed">
            TrustDoko helps you check reviews, complaint history, and verification
            status before you buy from online sellers, Instagram shops, and local
            service providers in Nepal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/businesses" size="lg">
              Browse businesses
            </ButtonLink>
            <ButtonLink href="/about" variant="secondary" size="lg">
              How trust scores work
            </ButtonLink>
          </div>
        </div>

        <aside className="rounded-xl border border-border bg-background/80 p-6 backdrop-blur-sm">
          <p className="text-foreground text-sm font-semibold">Before you send NPR</p>
          <ul className="text-muted mt-4 space-y-3 text-sm leading-relaxed">
            <li className="flex gap-3">
              <span className="bg-primary/10 text-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                1
              </span>
              <span>Search the seller on TrustDoko before eSewa, Khalti, or bank transfer.</span>
            </li>
            <li className="flex gap-3">
              <span className="bg-primary/10 text-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                2
              </span>
              <span>Check trust score, recent complaints, and whether the profile is claimed.</span>
            </li>
            <li className="flex gap-3">
              <span className="bg-primary/10 text-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                3
              </span>
              <span>Share your own experience to help other shoppers in Nepal.</span>
            </li>
          </ul>
          <p className="text-muted mt-5 border-t border-border pt-4 text-xs leading-relaxed">
            {copy.trust.disclaimer}
          </p>
        </aside>
      </section>

      <section className="mt-16" aria-labelledby="pillars-heading">
        <h2 id="pillars-heading" className="text-foreground text-2xl font-bold">
          What you can check on TrustDoko
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          {pillars.map((item, index) => (
            <Card
              key={item.title}
              className={
                index === 0
                  ? "p-6 lg:col-span-5"
                  : index === 1
                    ? "p-6 lg:col-span-7"
                    : "p-6 lg:col-span-12 lg:max-w-2xl"
              }
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="how-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="how-heading" className="text-foreground text-2xl font-bold">
            How it works
          </h2>
          <p className="text-muted max-w-md text-sm leading-relaxed">
            A simple flow designed for shoppers checking Instagram sellers, online stores,
            and local service providers.
          </p>
        </div>
        <ol className="mt-8 grid list-none gap-4 p-0 md:grid-cols-3">
          {steps.map((item) => (
            <li
              key={item.step}
              className="rounded-xl border border-border bg-card p-6"
            >
              <span
                className="bg-primary text-primary-foreground inline-flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-bold"
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

      <section className="mt-16 rounded-xl border border-primary/20 bg-accent px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-foreground text-xl font-bold">
              Shopping from a social seller?
            </h2>
            <p className="text-muted mt-2 text-sm leading-relaxed">
              Search their business name before you send NPR via eSewa, Khalti, or bank
              transfer. {copy.trust.communityReported}
            </p>
          </div>
          <ButtonLink href="/businesses" variant="outline" className="shrink-0">
            Start browsing
          </ButtonLink>
        </div>
      </section>
    </ContentWidth>
  );
}
