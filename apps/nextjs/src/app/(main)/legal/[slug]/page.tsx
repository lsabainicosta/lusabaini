import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPageView from "@/components/legal/LegalPageView";
import { getLegalPageBySlug, getLegalPageSlugs } from "@/lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getLegalPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLegalPageBySlug(slug);

  if (!page) {
    return {
      title: "Legal Page | Lu Sabaini",
      description: "Legal information page.",
    };
  }

  const title = [page.headlineStart, page.headlineEmphasis, page.headlineEnd]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    title: title ? `${title} | Lu Sabaini` : "Legal Page | Lu Sabaini",
    description: page.description?.trim() || "Legal information page.",
  };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;

  const page = await getLegalPageBySlug(slug);
  if (!page) notFound();

  return <LegalPageView page={page} />;
}
