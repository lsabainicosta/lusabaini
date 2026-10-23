import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { Badge } from "@lusabaini/ui/components/badge";
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
          Os lugares que eu indico para quem vem visitar a Holanda, reunidos em
          guias digitais para você aproveitar a viagem sem perder horas
          pesquisando.
        </p>
      </Reveal>

      {guides.length === 0 ? (
        <p className="mt-12 text-body">Nenhum guia disponível no momento.</p>
      ) : (
        <div className="mt-12 space-y-10">
          {guides.map((guide) => {
            // Blank lines split blocks; a block of "•" lines is the checklist,
            // and the paragraph right before it is the checklist's intro.
            const blocks = (guide.description ?? "")
              .split(/\n\s*\n/)
              .map((b) => b.split("\n").map((l) => l.trim()).filter(Boolean))
              .filter((b) => b.length > 0);
            const isList = (b?: string[]) => !!b && b.every((l) => l.startsWith("•"));
            const listIndex = blocks.findIndex((b) => isList(b));
            const bullets =
              listIndex >= 0 ? blocks[listIndex].map((l) => l.replace(/^•\s*/, "")) : [];
            const listIntro = listIndex > 0 ? blocks[listIndex - 1].join(" ") : null;
            const paragraphs = blocks
              .filter((_, i) => i !== listIndex && !(listIntro && i === listIndex - 1))
              .map((b) => b.join(" "));

            return (
              <Reveal key={guide._id} amount={0.1}>
                {/* Mobile stacks image, info, checklist, purchase; desktop puts the checklist in a full-width row below. */}
                <article
                  id={guide.slug}
                  className="scroll-mt-24 flex flex-col gap-8 rounded-3xl border border-black/10 bg-white/60 backdrop-blur-xl p-6 md:p-10 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:gap-14"
                >
                  {guide.coverImage?.url ? (
                    <div className="relative order-1 lg:col-start-1 lg:row-start-1 lg:self-start">
                      <div className="absolute -inset-2 rounded-[1.75rem] bg-white/50 -rotate-2" />
                      <Image
                        src={guide.coverImage.url}
                        alt={guide.coverImage.alt || guide.title}
                        width={600}
                        height={600}
                        className="relative h-auto w-full rounded-2xl border border-black/10 object-cover shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]"
                      />
                    </div>
                  ) : null}

                  <div className="contents lg:col-start-2 lg:row-start-1 lg:flex lg:flex-col lg:gap-8">
                    <div className="order-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">PDF</Badge>
                        <Badge variant="secondary">Envio por e-mail</Badge>
                      </div>
                      <h2 className="mt-4 heading-2 text-foreground">{guide.title}</h2>
                      {paragraphs.map((p, i) => (
                        <p key={i} className={i === 0 ? "mt-4 text-lead" : "mt-4 text-body"}>
                          {p}
                        </p>
                      ))}
                    </div>

                    <div className="order-4 rounded-2xl border border-black/10 bg-white/70 p-6">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="heading-3 text-foreground">Garanta o seu guia</span>
                        <span className="text-2xl font-semibold tracking-tight text-foreground">
                          {formatEuro(guide.price)}
                        </span>
                      </div>
                      <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/60">
                        <li>1. Faça o pedido</li>
                        <li>2. Pague via PayPal</li>
                        <li>3. Receba em até 48h</li>
                      </ol>
                      <div className="mt-6">
                        <GuideOrderForm
                          guideId={guide._id}
                          priceLabel={formatEuro(guide.price)}
                        />
                      </div>
                    </div>
                  </div>

                  {bullets.length > 0 ? (
                    <div className="order-3 rounded-2xl border border-black/10 bg-white/50 p-6 md:p-8 lg:col-span-2 lg:row-start-2">
                      <h3 className="heading-3 text-foreground">O que tem no guia</h3>
                      {listIntro ? <p className="mt-2 text-body">{listIntro}</p> : null}
                      <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                        {bullets.map((b) => (
                          <li key={b} className="flex gap-3 text-body">
                            <Check className="mt-1 h-4 w-4 shrink-0 text-foreground" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
