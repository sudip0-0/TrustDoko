import Link from "next/link";

import type { HomeTrustMetrics } from "@/server/queries/home";

type HomeTrustMetricsProps = {
  metrics: HomeTrustMetrics;
};

export function HomeTrustMetricsBar({ metrics }: HomeTrustMetricsProps) {
  const items = [
    {
      label: "Listed businesses",
      value: metrics.businessCount.toLocaleString(),
      detail: "Across Nepal on TrustDoko",
    },
    {
      label: "Verified profiles",
      value: metrics.verifiedBusinessCount.toLocaleString(),
      detail: "Contact or document verified",
    },
    {
      label: "Average trust score",
      value: `${metrics.averageTrustScore}/100`,
      detail: "Community-reported signals",
    },
    {
      label: "Open complaints",
      value: metrics.openComplaintCount.toLocaleString(),
      detail: "Awaiting review or resolution",
    },
  ] as const;

  return (
    <section
      className="grid gap-3 rounded-lg border border-border bg-card sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Platform trust metrics"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="border-border px-5 py-4 sm:border-r sm:last:border-r-0 lg:border-b-0"
        >
          <p className="type-caption font-medium">{item.label}</p>
          <p className="type-metric text-foreground mt-1 text-2xl">{item.value}</p>
          <p className="type-caption mt-1">{item.detail}</p>
        </div>
      ))}
      <div className="border-t border-border px-5 py-3 sm:col-span-2 lg:col-span-4 lg:border-t">
        <Link
          href="/about"
          className="text-primary text-sm font-semibold no-underline hover:underline"
        >
          How trust scores work
        </Link>
      </div>
    </section>
  );
}
