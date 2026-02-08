import type { Metadata } from "next";
import { getAboutPageContent } from "@/lib/queries";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutValues from "@/components/about/AboutValues";
import { buildPageMetadata } from "@/lib/seo";

const ABOUT_TITLE = "About";
const ABOUT_DESCRIPTION =
  "Learn more about Luiza Sabaini Costa, her content philosophy, and the approach behind high-performing social media campaigns.";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutPageContent();
  const title = content?.seoTitle?.trim() || ABOUT_TITLE;
  const description = content?.seoDescription?.trim() || ABOUT_DESCRIPTION;
  return buildPageMetadata({
    pathname: "/about",
    title,
    description,
  });
}

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
