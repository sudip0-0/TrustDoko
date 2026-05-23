import type { Metadata } from "next";

import { FadeInView } from "@/components/home/fade-in-view";
import { ButtonLink } from "@/components/ui/button";
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
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <FadeInView>
        <section className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow-badge mb-5">
              Nepal-focused consumer protection
            </p>
            <h1 className="text-foreground max-w-2xl text-4xl font-bold leading-[1.05] tracking-tighter sm:text-5xl md:text-6xl">
              Can you trust this business before you pay?
            </h1>
            <p className="text-muted mt-6 max-w-xl text-lg leading-relaxed">
              TrustDoko helps you check reviews, complaint history, and
              verification status before you buy from online sellers, Instagram
              shops, and local service providers in Nepal.
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

          <aside className="border-border/50 bg-card/80 rounded-2xl border p-6 shadow-diffusion backdrop-blur-sm sm:p-8">
            <p className="text-foreground text-sm font-semibold tracking-tight">
              Before you send NPR
            </p>
            <ul className="text-muted mt-5 space-y-4 text-sm leading-relaxed">
              <li className="flex gap-3">
                <span className="bg-primary/10 text-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                  1
                </span>
                <span>
                  Search the seller on TrustDoko before eSewa, Khalti, or bank
                  transfer.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="bg-primary/10 text-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                  2
                </span>
                <span>
                  Check trust score, recent complaints, and whether the profile
                  is claimed.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="bg-primary/10 text-primary mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                  3
                </span>
                <span>
                  Share your own experience to help other shoppers in Nepal.
                </span>
              </li>
            </ul>
            <p className="text-muted mt-6 border-t border-border/50 pt-5 text-xs leading-relaxed">
              {copy.trust.disclaimer}
            </p>
          </aside>
        </section>
      </FadeInView>

      <section className="mt-28" aria-labelledby="pillars-heading">
        <FadeInView delay={0.1}>
          <h2
            id="pillars-heading"
            className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl"
          >
            What you can check on TrustDoko
          </h2>
          <p className="text-muted mt-3 max-w-lg text-sm leading-relaxed">
            Real community intelligence before you commit your money.
          </p>
        </FadeInView>

        <div className="mt-10 grid gap-5 lg:grid-cols-12">
          {pillars.map((item, index) => (
            <FadeInView
              key={item.title}
              delay={0.15 + index * 0.1}
              className={
                index === 0
                  ? "lg:col-span-5"
                  : index === 1
                    ? "lg:col-span-7"
                    : "lg:col-span-12 lg:max-w-2xl"
              }
            >
              <div
                className={
                  index === 2
                    ? "bg-black/[0.03] rounded-[calc(1.25rem+1.5px)] border border-black/5"
                    : "bg-black/[0.03] rounded-[calc(2rem+1.5px)] border border-black/5"
                }
              >
                <div
                  className={
                    index === 2
                      ? "rounded-[calc(1.25rem-0.375rem)] bg-card p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                      : "rounded-[calc(2rem-0.375rem)] bg-card p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] sm:p-8"
                  }
                >
                  <h3 className="text-foreground text-xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-muted mt-2 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>
      </section>

      <section className="mt-28" aria-labelledby="how-heading">
        <FadeInView delay={0.1}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="how-heading"
                className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl"
              >
                How it works
              </h2>
              <p className="text-muted mt-3 max-w-md text-sm leading-relaxed">
                A simple flow designed for shoppers checking Instagram sellers,
                online stores, and local service providers.
              </p>
            </div>
          </div>
        </FadeInView>

        <ol className="mt-10 grid list-none gap-5 p-0 md:grid-cols-3">
          {steps.map((item, index) => (
            <FadeInView key={item.step} delay={0.15 + index * 0.1}>
              <li className="bg-black/[0.03] rounded-[calc(2rem+1.5px)] border border-black/5">
                <div className="rounded-[calc(2rem-0.375rem)] bg-card p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] sm:p-8">
                  <span
                    className="bg-primary text-primary-foreground inline-flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm font-bold"
                    aria-hidden="true"
                  >
                    {item.step}
                  </span>
                  <h3 className="text-foreground mt-5 text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-muted mt-2 text-sm leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </li>
            </FadeInView>
          ))}
        </ol>
      </section>

      <FadeInView delay={0.2}>
        <section className="mt-28 rounded-[calc(2rem+1.5px)] bg-black/[0.03] border border-primary/10">
          <div className="rounded-[calc(2rem-0.375rem)] bg-gradient-to-br from-accent to-white p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] sm:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-xl">
                <h2 className="text-foreground text-2xl font-bold tracking-tight">
                  Shopping from a social seller?
                </h2>
                <p className="text-muted mt-3 text-sm leading-relaxed">
                  Search their business name before you send NPR via eSewa,
                  Khalti, or bank transfer. {copy.trust.communityReported}
                </p>
              </div>
              <ButtonLink
                href="/businesses"
                variant="outline"
                className="shrink-0"
              >
                Start browsing
              </ButtonLink>
            </div>
          </div>
        </section>
      </FadeInView>
    </div>
  );
}
