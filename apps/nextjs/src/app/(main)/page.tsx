import type { Metadata } from "next";
import { getHomeSectionsContent, getShellContent } from "@/lib/queries";
import Hero from "@/components/Hero";
import BrandLogos from "@/components/BrandLogos";
import ClientResults from "@/components/ClientResults";
import JsonLd from "@/components/seo/JsonLd";
import { buildCanonicalUrl, buildPageMetadata, SITE_DESCRIPTION } from "@/lib/seo";

const HOME_TITLE = "Short-Form Content Strategy";
const HOME_DESCRIPTION = SITE_DESCRIPTION;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomeSectionsContent();
  const title = content?.hero?.seoTitle?.trim() || HOME_TITLE;
  const description = content?.hero?.seoDescription?.trim() || HOME_DESCRIPTION;
  return buildPageMetadata({
    pathname: "/",
    title,
    description,
  });
}

export default async function Home() {
  const [{ clientResults, hero, brandLogos }, shell] = await Promise.all([
    getHomeSectionsContent(),
    getShellContent(),
  ]);
  const homeDescription = hero?.seoDescription?.trim() || HOME_DESCRIPTION;

  const sameAsLinks = (shell.siteSettings?.socials ?? [])
    .map((social) => social.href?.trim())
    .filter((href): href is string => Boolean(href && /^https?:\/\//i.test(href)));

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Luiza Sabaini Costa",
    url: buildCanonicalUrl("/"),
    jobTitle: "Social Media Strategist and Short-Form Content Creator",
    description: homeDescription,
    ...(sameAsLinks.length ? { sameAs: sameAsLinks } : {}),
  };

  return (
    <>
      <JsonLd id="home-person-schema" data={personSchema} />
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
