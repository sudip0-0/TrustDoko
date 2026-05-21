import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-border bg-card px-6 py-14 shadow-sm sm:px-10 sm:py-16">
        <p className="text-primary mb-4 text-sm font-semibold tracking-wide uppercase">
          Nepal-focused trust platform
        </p>
        <h1 className="text-foreground max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Can you trust this business?
        </h1>
        <p className="text-muted mt-6 max-w-2xl text-lg leading-relaxed">
          TrustDoko helps you check reviews, complaint history, and verification
          status before you buy from online sellers, social shops, and local
          service providers in Nepal.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/businesses"
            className="bg-primary text-primary-foreground inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold no-underline hover:opacity-90"
          >
            Browse businesses
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground no-underline hover:bg-accent"
          >
            Learn more
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-3">
        {[
          {
            title: "Verified reviews",
            description:
              "Read moderated reviews from real customers with transparent trust labels.",
          },
          {
            title: "Complaint history",
            description:
              "See unresolved issues and how businesses respond — before you pay.",
          },
          {
            title: "Business claims",
            description:
              "Owners can claim profiles, verify identity, and respond publicly.",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-muted mt-2 text-sm leading-relaxed">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <p className="text-muted mt-12 text-center text-sm">
        Foundation release — business directory and reviews coming soon.
      </p>
    </div>
  );
}
