import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPageView from "@/components/legal/LegalPageView";
import { getLegalPageBySlug, getLegalPageSlugs } from "@/lib/queries";
import { buildPageMetadata, isLegalSlugIndexable } from "@/lib/seo";

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
    return buildPageMetadata({
      pathname: `/legal/${slug}`,
      title: "Legal Page",
      description: "Legal information page.",
      index: false,
      follow: true,
    });
  }

  const derivedTitle = [page.headlineStart, page.headlineEmphasis, page.headlineEnd]
    .filter(Boolean)
    .join(" ")
    .trim();
  const title = page.seoTitle?.trim() || derivedTitle || "Legal Page";
  const description =
    page.seoDescription?.trim() ||
    page.description?.trim() ||
    "Legal information page.";
  const isIndexable = isLegalSlugIndexable(slug);

  return buildPageMetadata({
    pathname: `/legal/${slug}`,
    title,
    description,
    index: isIndexable,
    follow: true,
  });
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;

  const page = await getLegalPageBySlug(slug);
  if (!page) notFound();

  return <LegalPageView page={page} />;
}
