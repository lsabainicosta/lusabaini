import type { Metadata } from "next";
import Reveal from "@lusabaini/ui/components/motion/Reveal";
import ContactForm from "@/components/ContactForm";
import { Button } from "@lusabaini/ui/components/button";
import { getContactOffer, getContactPageContent } from "@/lib/queries";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactPageContent();
  return buildPageMetadata({
    pathname: "/contato",
    title: data?.seoTitle || "Contato",
    description:
      data?.seoDescription ||
      "Entre em contato com Luiza Sabaini Costa para consultoria sobre morar na Holanda.",
  });
}

export default async function ContatoPage({
  searchParams,
}: {
  searchParams: Promise<{ tema?: string | string[] }>;
}) {
  const [data, offer, { tema }] = await Promise.all([
    getContactPageContent(),
    getContactOffer(),
    searchParams,
  ]);
  const initialTopics = [tema ?? []].flat().filter((t) => offer.topics.includes(t));

  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 md:pt-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h1 className="heading-1 text-foreground">
            {data?.headline || "Vamos conversar sobre a sua mudança"}
          </h1>
          {data?.intro ? <p className="mt-5 text-lead">{data.intro}</p> : null}
          {data?.supportingText ? (
            <p className="mt-4 text-body">{data.supportingText}</p>
          ) : null}
          {offer.bookingUrl ? (
            <div className="mt-8 rounded-3xl border border-black/10 bg-white/40 p-6">
              <h2 className="heading-3 text-foreground">Prefere conversar?</h2>
              <p className="mt-2 text-body">
                Agende uma conversa inicial gratuita de 15 a 20 minutos. A gente
                entende o seu momento e vê quantas horas fazem sentido.
              </p>
              <Button asChild className="mt-4">
                <a href={offer.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Agendar conversa gratuita
                </a>
              </Button>
            </div>
          ) : null}
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative rounded-3xl border border-black/10 bg-white/60 backdrop-blur-xl p-6 md:p-8">
            <ContactForm topics={offer.topics} initialTopics={initialTopics} />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
