"use server";

import { getHomeSectionsContent } from "@/lib/queries";
import Hero from "@/components/Hero";
import BrandLogos from "@/components/BrandLogos";
import ClientResults from "@/components/ClientResults";

export default async function Home() {
  const { clientResults, hero, brandLogos } = await getHomeSectionsContent();

  return (
    <>
      <Hero
        headlineStart={hero?.headlineStart}
        headlineEmphasis={hero?.headlineEmphasis}
        headlineEnd={hero?.headlineEnd}
        description={hero?.description}
        primaryCta={hero?.primaryCta}
        secondaryCta={hero?.secondaryCta}
        carouselVideos={hero?.carouselVideos}
        storyUserInfo={hero?.storyUserInfo}
      />
      <BrandLogos introText={brandLogos?.introText} logos={brandLogos?.logos} />
      <ClientResults results={clientResults} />
    </>
  );
}
