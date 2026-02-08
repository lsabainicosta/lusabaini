import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getClientResultById,
  getClientResultBySlug,
  getClientResults,
  resolveClientResultSlug,
} from "@/lib/queries";
import TransitionLink from "@/components/motion/TransitionLink";
import BackButton from "@/components/BackButton";
import { ArrowRight } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";
import RelatedContentGallery from "@/components/work/RelatedContentGallery";
import Reveal from "@/components/motion/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import { buildCanonicalUrl, buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

async function getWorkResultByParam(id: string) {
  let result = await getClientResultBySlug(id);
  if (!result) {
    result = await getClientResultById(id);
  }
  return result;
}

export async function generateStaticParams() {
  const results = await getClientResults();
  return results.map((result) => ({
    id: resolveClientResultSlug(result),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getWorkResultByParam(id);

  const canonicalId = result ? resolveClientResultSlug(result) : id;

  if (!result) {
    return buildPageMetadata({
      pathname: `/my-work/${id}`,
      title: "Case Study Not Found",
      description: "The requested case study could not be found.",
      index: false,
      follow: true,
    });
  }

  const clientName = result.clientName?.trim() || "Case Study";
  const metadataTitle =
    result.seoTitle?.trim() || `${clientName} Case Study`;
  const metadataDescription =
    result.seoDescription?.trim() ||
    result.description?.trim() ||
    `Explore strategy and campaign outcomes for ${clientName}.`;

  const openGraphImages = result.image?.url
    ? [
        {
          url: result.image.url,
          alt: result.image.alt || clientName,
        },
      ]
    : undefined;

  return buildPageMetadata({
    pathname: `/my-work/${canonicalId}`,
    title: metadataTitle,
    description: metadataDescription,
    openGraphType: "article",
    openGraphImages,
  });
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params;

  const result = await getWorkResultByParam(id);

  if (!result) {
    notFound();
  }

  // Get all results for navigation
  const allResults = await getClientResults();
  const currentIndex = allResults.findIndex((r) => r._id === result._id);
  const nextResult =
    currentIndex >= 0 && currentIndex < allResults.length - 1
      ? allResults[currentIndex + 1]
      : null;

  const title = result.clientName || "Work";
  const description = result.description || "";
  const category = result.category || "";
  const canonicalId = resolveClientResultSlug(result);
  const canonicalUrl = buildCanonicalUrl(`/my-work/${canonicalId}`);
  const year = new Date().getFullYear().toString(); // Default to current year, can be updated later
  const curatedRelatedContent = (result.relatedContent ?? []).filter((item) => {
    if (item._type === "relatedTextItem") {
      return Boolean(item.title?.trim() || item.body?.trim() || item.eyebrow?.trim());
    }

    const isVideo = item.mediaType === "video" || Boolean(item.video?.url);
    return isVideo ? Boolean(item.video?.url) : Boolean(item.image?.url);
  });
  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description:
      description || `Case study and social campaign outcomes for ${title}.`,
    url: canonicalUrl,
    creator: {
      "@type": "Person",
      name: "Luiza Sabaini Costa",
      url: buildCanonicalUrl("/"),
    },
    ...(category ? { genre: category } : {}),
    ...(result.image?.url
      ? {
          image: result.image.url,
        }
      : {}),
  };

  return (
    <>
      <JsonLd id="work-creativework-schema" data={creativeWorkSchema} />
      {/* Hero Section */}
      <section className="w-full pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative h-[500px] w-full overflow-hidden rounded-[2.5rem] border-4 border-white shadow-2xl">
            {/* Background Image/Video */}
            {result.video?.url ? (
              <video
                src={result.video.url}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : result.image?.url ? (
              <Image
                src={result.image.url}
                alt={result.image.alt || title}
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 1152px, 100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-black/10" />
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

            {/* Back Button */}
            <Reveal className="absolute top-6 left-6 z-10" delay={0.03} y={12} amount={0.2}>
              <BackButton
                className="rounded-lg bg-[#f9f3eb]/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80 cursor-pointer"
                fallbackHref="/my-work"
              />
            </Reveal>

            {/* Navigation Arrow */}
            {nextResult && (
              <Reveal className="absolute top-6 right-6 z-10" delay={0.08} y={12} amount={0.2}>
                <TransitionLink
                  href={`/my-work/${resolveClientResultSlug(nextResult)}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-black transition-opacity hover:opacity-80"
                  aria-label="Next project"
                >
                  <ArrowRight className="h-5 w-5" />
                </TransitionLink>
              </Reveal>
            )}

            {/* Title and Description Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 md:p-12">
              <div className="max-w-3xl">
                <Reveal delay={0.13} y={18} amount={0.2}>
                  <h1 className="mb-3 text-[clamp(2rem,8.4vw,3.3rem)] font-medium leading-[0.92] tracking-[-0.04em] text-white md:mb-4 md:text-6xl lg:text-7xl">
                    {title}
                  </h1>
                </Reveal>
                {description && (
                  <Reveal delay={0.2} y={20} amount={0.2}>
                    <p className="max-w-2xl text-base leading-[1.3] text-white/90 md:text-xl">
                      {description}
                    </p>
                  </Reveal>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="w-full pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal delay={0.08} y={20} amount={0.2}>
            <div className="flex flex-wrap items-start justify-between gap-8 md:gap-12 bg-white/35 border border-black/10 rounded-[1rem] px-10 py-6">
            {/* Category */}
              <Reveal delay={0.12} y={16} amount={0.2}>
                <div>
                  <div className="text-sm font-medium text-black/60 mb-2">
                    Category
                  </div>
                  <div className="text-2xl font-semibold text-black">
                    {category || "—"}
                  </div>
                </div>
              </Reveal>

              {/* Platforms/Socials */}
              <Reveal delay={0.17} y={16} amount={0.2}>
                <div>
                  <div className="text-sm font-medium text-black/60 mb-2">
                    See the work for this brand
                  </div>
                  {result.socials && result.socials.length > 0 ? (
                    <SocialLinks socials={result.socials} />
                  ) : (
                    <div className="text-black/40 italic">Link coming soon</div>
                  )}
                </div>
              </Reveal>

              {/* Year */}
              <Reveal delay={0.22} y={16} amount={0.2}>
                <div>
                  <div className="text-sm font-medium text-black/60 mb-2">Year</div>
                  <div className="text-2xl font-semibold text-black">{year}</div>
                </div>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>

      <RelatedContentGallery
        title={result.relatedContentHeading || "Related Content"}
        description={result.relatedContentDescription}
        items={curatedRelatedContent}
      />
    </>
  );
}
