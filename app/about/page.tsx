import { ContentWidth } from "@/components/layout/content-width";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { copy } from "@/lib/copy/messages";

const labels = [
  { name: "Highly Trusted", range: "80+", detail: "Strong positive community signals" },
  { name: "Trusted", range: "65–79", detail: "Generally positive track record" },
  { name: "Mixed Reputation", range: "45–64", detail: "Balance of praise and concerns" },
  { name: "Risky", range: "25–44", detail: "Notable negative signals" },
  { name: "High Risk", range: "Below 25", detail: "Serious community concerns" },
  {
    name: "Under Review",
    range: "—",
    detail: "Claim, reviews, or complaints still being moderated",
  },
] as const;

export default function AboutPage() {
  return (
    <ContentWidth size="md" className="py-12 sm:py-16">
      <PageHeader
        eyebrow="Transparency"
        title="About TrustDoko"
        description="A public trust layer for Nepali shoppers — combining reviews, complaints, verification, and clear trust scores before you pay online sellers or social shops."
      />

      <section className="mt-10 space-y-4" aria-labelledby="mission-heading">
        <h2 id="mission-heading" className="text-xl font-semibold">
          Why we built this
        </h2>
        <p className="text-muted leading-relaxed">
          Many Nepalis buy from Instagram pages, Facebook shops, and small websites
          without a reliable place to see complaint history or whether a business
          responds to customers. TrustDoko collects community-reported signals in one
          profile so you can make a more informed choice — especially before sending
          NPR in advance.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="scores-heading">
        <h2 id="scores-heading" className="text-xl font-semibold">
          How trust scores work
        </h2>
        <p className="text-muted mt-4 leading-relaxed">
          Each business receives a score from 0 to 100 based on approved review
          ratings, complaint reports (with extra weight for open or serious issues),
          verification tier, owner responses, profile completeness, and recent trends.
        </p>
        <p className="text-muted mt-4 text-sm leading-relaxed">{copy.trust.disclaimer}</p>

        <ul className="mt-8 grid list-none gap-3 p-0 sm:grid-cols-2">
          {labels.map((item) => (
            <li key={item.name}>
              <Card>
                <CardContent className="py-4">
                  <p className="text-foreground font-semibold">{item.name}</p>
                  <p className="text-primary text-sm tabular-nums">{item.range}</p>
                  <p className="text-muted mt-1 text-sm">{item.detail}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </ContentWidth>
  );
}
