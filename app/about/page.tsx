export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">About TrustDoko</h1>
      <p className="text-muted mt-4 leading-relaxed">
        TrustDoko is building a public trust layer for Nepali businesses —
        combining reviews, complaints, verification, and transparent trust
        scores.
      </p>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold">Trust scores</h2>
        <p className="text-muted leading-relaxed">
          Each business receives a score from 0 to 100 based on community
          signals: approved review ratings and volume, complaint reports (with
          extra weight for open or high-severity items), verification tier,
          owner response rate, profile completeness, account age, and recent
          rating trends. Scores are not legal judgments and do not guarantee an
          outcome for any purchase.
        </p>
        <ul className="text-muted list-disc space-y-2 pl-5 leading-relaxed">
          <li>
            <strong className="text-foreground">Highly Trusted</strong> — 80+
            with strong positive signals
          </li>
          <li>
            <strong className="text-foreground">Trusted</strong> — 65–79
          </li>
          <li>
            <strong className="text-foreground">Mixed Reputation</strong> — 45–64
          </li>
          <li>
            <strong className="text-foreground">Risky</strong> — 25–44
          </li>
          <li>
            <strong className="text-foreground">High Risk</strong> — below 25
          </li>
          <li>
            <strong className="text-foreground">Under Review</strong> — claim,
            review, or complaint moderation still in progress; the numeric score
            may change when data is finalized
          </li>
        </ul>
        <p className="text-muted text-sm leading-relaxed">
          Business profiles list the main factors that influenced the latest
          score so you can see why a label was applied.
        </p>
      </section>
    </div>
  );
}
