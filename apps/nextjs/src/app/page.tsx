"use server";

import { getHomeSectionsContent } from "@/lib/queries";
import Hero from "@/components/Hero";
import BrandLogos from "@/components/BrandLogos";
import Services from "@/components/Services";
import ClientResults from "@/components/ClientResults";

export default async function Home() {
  const { clientResults, hero, brandLogos, servicesSection } =
    await getHomeSectionsContent();

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
      />
      <BrandLogos introText={brandLogos?.introText} logos={brandLogos?.logos} />
      <Services
        badgeLabel={servicesSection?.badgeLabel}
        headlineStart={servicesSection?.headlineStart}
        headlineEmphasis={servicesSection?.headlineEmphasis}
        headlineEnd={servicesSection?.headlineEnd}
        items={servicesSection?.items}
      />
      <ClientResults results={clientResults} />
    </>
  );
}
