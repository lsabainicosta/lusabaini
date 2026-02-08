import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { getContactPageContent } from "@/lib/queries";
import { buildPageMetadata } from "@/lib/seo";

const CONTACT_TITLE = "Contact";
const CONTACT_DESCRIPTION =
  "Reach out to Luiza Sabaini Costa for social media strategy, short-form content creation, and campaign collaborations.";
const CONTACT_HEADLINE = "Let's build your next growth campaign";
const CONTACT_INTRO =
  "Share your goals, timeline, and what success looks like for your brand. You'll typically get a response within 1-2 business days.";
const CONTACT_SUPPORTING_TEXT =
  "Services include short-form video production, social strategy, performance-driven content systems, and creator-led campaign support.";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContactPageContent();
  const title = content?.seoTitle?.trim() || CONTACT_TITLE;
  const description = content?.seoDescription?.trim() || CONTACT_DESCRIPTION;
  return buildPageMetadata({
    pathname: "/contact",
    title,
    description,
  });
}

export default async function ContactPage() {
  const content = await getContactPageContent();
  const headline = content?.headline?.trim() || CONTACT_HEADLINE;
  const intro = content?.intro?.trim() || CONTACT_INTRO;
  const supportingText = content?.supportingText?.trim() || CONTACT_SUPPORTING_TEXT;

  return (
    <section className="w-full pt-20 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-[2.5rem] border-4 border-white bg-white/70 p-6 shadow-2xl sm:p-8">
          <div className="mb-8 space-y-4">
            <h1 className="text-5xl font-medium tracking-[-0.04em] leading-[0.95] text-black sm:text-6xl">
              {headline}
            </h1>
            <p className="text-lg leading-relaxed text-black/65">
              {intro}
            </p>
            <p className="text-sm text-black/50">
              {supportingText}
            </p>
          </div>

          <ContactForm className="space-y-5" />
        </div>
      </div>
    </section>
  );
}
