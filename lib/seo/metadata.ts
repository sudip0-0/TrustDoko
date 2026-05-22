import type { Metadata } from "next";

const DEFAULT_SITE_URL = "http://localhost:3000";

export const siteConfig = {
  name: "TrustDoko",
  title: "TrustDoko — Trust reviews for Nepali businesses",
  description:
    "Check reviews, complaints, and trust signals before you buy from online sellers in Nepal.",
  get url(): string {
    const fromEnv = process.env.NEXTAUTH_URL?.trim();
    if (fromEnv) {
      return fromEnv.replace(/\/$/, "");
    }
    return DEFAULT_SITE_URL;
  },
  ogImagePath: "/og-default.svg",
} as const;

type BuildMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "",
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const canonicalPath = path.startsWith("/") ? path : path ? `/${path}` : "";
  const url = `${siteConfig.url}${canonicalPath}`;
  const ogImage = `${siteConfig.url}${siteConfig.ogImagePath}`;

  return {
    title,
    description,
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "website",
      locale: "en_NP",
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: ogImage, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
