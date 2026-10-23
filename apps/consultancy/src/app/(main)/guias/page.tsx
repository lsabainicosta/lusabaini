import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@lusabaini/ui/components/motion/Reveal";
import GuideOrderForm from "@/components/GuideOrderForm";
import { formatEuro, getGuides } from "@/lib/queries";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    pathname: "/guias",
    title: "Guias de viagem",
    description:
      "Guias digitais de viagem pela Holanda, com as dicas de quem mora aqui.",
  });
}

export default async function GuiasPage() {
  const guides = await getGuides();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 md:pt-24">
      <Reveal>
        <h1 className="heading-1 text-foreground">Guias de viagem</h1>
        <p className="mt-5 text-lead max-w-2xl">
          Guias digitais em PDF com os lugares que eu indico para quem vem
          visitar a Holanda. Você faz o pedido, paga via PayPal e recebe o guia
          no seu e-mail em até 48 horas.
        </p>
      </Reveal>

      {guides.length === 0 ? (
        <p className="mt-12 text-body">Nenhum guia disponível no momento.</p>
      ) : (
        <div className="mt-12 space-y-8">
          {guides.map((guide) => (
            <Reveal key={guide._id}>
              <article
                id={guide.slug}
                className="scroll-mt-24 grid gap-8 rounded-3xl border border-black/10 bg-white/60 backdrop-blur-xl p-6 md:p-8 lg:grid-cols-[0.8fr_1.2fr]"
              >
                {guide.coverImage?.url ? (
                  <Image
                    src={guide.coverImage.url}
                    alt={guide.coverImage.alt || guide.title}
                    width={600}
                    height={750}
                    className="h-auto w-full rounded-2xl border border-black/10 object-cover"
                  />
                ) : null}
                <div>
                  <h2 className="heading-2 text-foreground">{guide.title}</h2>
                  <p className="mt-2 text-lg font-medium text-foreground/70">
                    {formatEuro(guide.price)}
                  </p>
                  {guide.description ? (
                    <p className="mt-4 text-body whitespace-pre-line">
                      {guide.description}
                    </p>
                  ) : null}
                  <div className="mt-8">
                    <GuideOrderForm guideId={guide._id} />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
