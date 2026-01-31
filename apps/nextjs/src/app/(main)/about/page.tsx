"use server";

import { getAboutPageContent } from "@/lib/queries";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutValues from "@/components/about/AboutValues";
import AboutJourney from "@/components/about/AboutJourney";
import AboutCta from "@/components/about/AboutCta";

export default async function AboutPage() {
  const content = await getAboutPageContent();

  return (
    <>
      <AboutHero
        badgeLabel={content?.badgeLabel}
        headlineStart={content?.headlineStart}
        headlineEmphasis={content?.headlineEmphasis}
        headlineEnd={content?.headlineEnd}
        description={content?.heroDescription}
        profileImage={content?.profileImage}
      />
      <AboutStory
        title={content?.storyTitle}
        content={content?.storyContent}
        image={content?.storyImage}
      />
      <AboutValues
        philosophyTitle={content?.philosophyTitle}
        philosophyContent={content?.philosophyContent}
        values={content?.values}
      />
      <AboutJourney
        title={content?.journeyTitle}
        items={content?.journeyItems}
      />
      <AboutCta
        headlineStart={content?.ctaHeadlineStart}
        headlineEmphasis={content?.ctaHeadlineEmphasis}
        headlineEnd={content?.ctaHeadlineEnd}
        description={content?.ctaDescription}
        ctaButton={content?.ctaButton}
      />
    </>
  );
}
