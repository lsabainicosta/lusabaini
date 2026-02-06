import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getClientResultById,
  getClientResultBySlug,
  getClientResults,
} from "@/lib/queries";
import { createSlug } from "@/lib/utils";
import TransitionLink from "@/components/motion/TransitionLink";
import BackButton from "@/components/BackButton";
import { ArrowRight } from "lucide-react";
import SocialLinks from "@/components/SocialLinks";
import RelatedContentGallery from "@/components/work/RelatedContentGallery";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const results = await getClientResults();
  return results.map((result) => ({
    id: result.clientName ? createSlug(result.clientName) : result._id,
  }));
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params;

  // Try to find by slug first, then by _id
  let result = await getClientResultBySlug(id);
  if (!result) {
    result = await getClientResultById(id);
  }

  if (!result) {
    notFound();
  }

  // Get all results for navigation
  const allResults = await getClientResults();
  const currentIndex = allResults.findIndex((r) => r._id === result!._id);
  const nextResult =
    currentIndex >= 0 && currentIndex < allResults.length - 1
      ? allResults[currentIndex + 1]
      : null;

  const title = result.clientName || "Work";
  const description = result.description || "";
  const category = result.category || "";
  const year = new Date().getFullYear().toString(); // Default to current year, can be updated later
  const curatedRelatedContent = (result.relatedContent ?? []).filter((item) => {
    if (item._type === "relatedTextItem") {
      return Boolean(item.title?.trim() || item.body?.trim() || item.eyebrow?.trim());
    }

    const isVideo = item.mediaType === "video" || Boolean(item.video?.url);
    return isVideo ? Boolean(item.video?.url) : Boolean(item.image?.url);
  });

  return (
    <>
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
            <BackButton
              className="absolute top-6 left-6 z-10 rounded-lg bg-[#f9f3eb]/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-80 cursor-pointer"
              fallbackHref="/my-work"
            />

            {/* Navigation Arrow */}
            {nextResult && (
              <TransitionLink
                href={`/my-work/${nextResult.clientName ? createSlug(nextResult.clientName) : nextResult._id}`}
                className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-black transition-opacity hover:opacity-80"
                aria-label="Next project"
              >
                <ArrowRight className="h-5 w-5" />
              </TransitionLink>
            )}

            {/* Title and Description Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 md:p-12">
              <div className="max-w-3xl">
                <h1 className="mb-3 text-[clamp(2rem,8.4vw,3.3rem)] font-medium leading-[0.92] tracking-[-0.04em] text-white md:mb-4 md:text-6xl lg:text-7xl">
                  {title}
                </h1>
                {description && (
                  <p className="max-w-2xl text-base leading-[1.3] text-white/90 md:text-xl">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="w-full pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-start justify-between gap-8 md:gap-12 bg-white/35 border border-black/10 rounded-[1rem] px-10 py-6">
            {/* Category */}
            <div>
              <div className="text-sm font-medium text-black/60 mb-2">
                Category
              </div>
              <div className="text-2xl font-semibold text-black">
                {category || "—"}
              </div>
            </div>

            {/* Platforms/Socials */}
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

            {/* Year */}
            <div>
              <div className="text-sm font-medium text-black/60 mb-2">Year</div>
              <div className="text-2xl font-semibold text-black">{year}</div>
            </div>
          </div>
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
