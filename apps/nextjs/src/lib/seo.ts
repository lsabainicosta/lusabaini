import type { Metadata } from "next";

const LOCAL_FALLBACK_ORIGIN = "http://localhost:3000";
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

export const SITE_NAME = "Luiza Sabaini Costa";
export const SITE_DESCRIPTION =
  "Short-form video, strategy, and hands-on execution to help brands grow on social. Portfolio, services, and client results by Luiza Sabaini Costa.";

export const INDEXABLE_LEGAL_SLUGS = ["privacy-policy"] as const;

type PageMetadataInput = {
  pathname: string;
  title: string;
  description: string;
  index?: boolean;
  follow?: boolean;
  openGraphType?: "website" | "article";
  openGraphImages?: Array<{ url: string; alt?: string }>;
};

function isLocalHostname(hostname: string) {
  return (
    LOCAL_HOSTNAMES.has(hostname) ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  );
}

function parseConfiguredOrigin(rawValue?: string | null): URL | null {
  const value = rawValue?.trim();
  if (!value) return null;

  try {
    const parsed = /^(https?:)?\/\//i.test(value)
      ? new URL(value)
      : new URL(`https://${value}`);

    const protocol = isLocalHostname(parsed.hostname) ? "http:" : "https:";
    const host = parsed.port ? `${parsed.hostname}:${parsed.port}` : parsed.hostname;
    return new URL(`${protocol}//${host}`);
  } catch {
    return null;
  }
}

const canonicalOrigin =
  parseConfiguredOrigin(process.env.NEXT_PUBLIC_SITE_DOMAIN) ??
  new URL(LOCAL_FALLBACK_ORIGIN);

export function getCanonicalOrigin() {
  return new URL(canonicalOrigin.toString());
}

export function getMetadataBase() {
  return getCanonicalOrigin();
}

export function getCanonicalHostname() {
  return canonicalOrigin.hostname.toLowerCase();
}

export function buildCanonicalUrl(pathname = "/") {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(normalizedPath, canonicalOrigin).toString();
}

export function createRobots(
  index = true,
  follow = true
): NonNullable<Metadata["robots"]> {
  return {
    index,
    follow,
    googleBot: {
      index,
      follow,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export function buildPageMetadata({
  pathname,
  title,
  description,
  index = true,
  follow = true,
  openGraphType = "website",
  openGraphImages,
}: PageMetadataInput): Metadata {
  const canonicalUrl = buildCanonicalUrl(pathname);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: createRobots(index, follow),
    openGraph: {
      title,
      description,
      type: openGraphType,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      ...(openGraphImages?.length ? { images: openGraphImages } : {}),
    },
    twitter: {
      card: openGraphImages?.length ? "summary_large_image" : "summary",
      title,
      description,
      ...(openGraphImages?.length ? { images: openGraphImages } : {}),
    },
  };
}

export function isLegalSlugIndexable(slug: string) {
  const normalized = slug.trim().toLowerCase();
  return INDEXABLE_LEGAL_SLUGS.includes(
    normalized as (typeof INDEXABLE_LEGAL_SLUGS)[number]
  );
}
