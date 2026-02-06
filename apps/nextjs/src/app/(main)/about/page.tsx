"use server";

import { getAboutPageContent } from "@/lib/queries";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutValues from "@/components/about/AboutValues";

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
    </>
  );
}
