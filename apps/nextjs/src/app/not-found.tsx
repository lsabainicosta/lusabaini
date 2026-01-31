import Image from "next/image";
import TransitionLink from "@/components/motion/TransitionLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getNotFoundPageContent } from "@/lib/queries";
import { sanityImageLoader } from "@/lib/sanityImageLoader";

import lulu from "@/assets/lulu.webp";

export default async function NotFound() {
  const content = await getNotFoundPageContent();

  const badgeLabel = content?.badgeLabel || "404 — Not found";
  const headlineStart = content?.headlineStart || "This page went";
  const headlineEmphasis = content?.headlineEmphasis;
  const headlineEnd = content?.headlineEnd;
  const description =
    content?.description ||
    "The link might be broken, or the page may have been moved. Let's get you back to something good.";
  const primaryButtonLabel = content?.primaryButton?.label || "Back home";
  const primaryButtonHref = content?.primaryButton?.href || "/";
  const secondaryButtonLabel = content?.secondaryButton?.label || "See my work";
  const secondaryButtonHref = content?.secondaryButton?.href || "/my-work";
  const profileImageUrl = content?.profileImage?.url;
  const profileImageAlt = content?.profileImage?.alt || "Luiza Sabaini Costa";
  const errorNumber = content?.errorNumber || "404";
  const errorSubtitle = content?.errorSubtitle || "Lost, but still looking good.";

  // Use Sanity image if available, otherwise fallback to local image
  const imageSrc = profileImageUrl || lulu;
  const imageAlt = profileImageUrl ? profileImageAlt : "Luiza Sabaini Costa";

  return (
    <section className="w-full pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Copy */}
          <div className="flex flex-col items-start gap-8">
            <Badge className="px-4 py-1 bg-black/5 rounded-lg text-xs font-semibold uppercase tracking-wider text-black/60 border-transparent">
              {badgeLabel}
            </Badge>

            <div className="flex flex-col gap-4">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-medium tracking-[-0.04em] leading-[0.9] text-black">
                {headlineStart}{" "}
                <span className="italic font-serif">{headlineEmphasis}</span>
                {headlineEnd ? ` ${headlineEnd}` : ""}
              </h1>
              <p className="text-xl text-black/60 max-w-xl font-sans leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button asChild>
                <TransitionLink href={primaryButtonHref}>
                  {primaryButtonLabel}
                </TransitionLink>
              </Button>
              <Button asChild variant="outline">
                <TransitionLink href={secondaryButtonHref}>
                  {secondaryButtonLabel}
                </TransitionLink>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="glass-card rounded-[2.5rem] p-4 sm:p-6 border border-black/10">
              <div className="relative overflow-hidden rounded-[2rem] aspect-16/10 bg-black/5">
                <div className="absolute inset-0 bg-linear-to-br from-black/5 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border border-black/10 bg-white/60">
                      <Image
                        loader={profileImageUrl ? sanityImageLoader : undefined}
                        src={imageSrc}
                        alt={imageAlt}
                        className="object-cover"
                        width={96}
                        height={96}
                        priority={false}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-medium tracking-[-0.06em] text-black">
                        {errorNumber}
                      </div>
                      <div className="text-sm text-black/50 font-sans">
                        {errorSubtitle}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-(--brand-dark)/10 blur-[120px] rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
