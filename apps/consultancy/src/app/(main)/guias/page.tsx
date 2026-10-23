import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
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
        <div className="mt-14 space-y-24">
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
                {/* Mobile stacks image, info, checklist, purchase; desktop puts the checklist in its own row below. */}
                <article
                  id={guide.slug}
                  className="scroll-mt-24 flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-20"
                >
                  {guide.coverImage?.url ? (
                    <div className="relative order-1 lg:col-start-1 lg:row-start-1 lg:self-start">
                      <div className="absolute -inset-3 rounded-[2rem] bg-white/40 -rotate-2" />
                      <Image
                        src={guide.coverImage.url}
                        alt={guide.coverImage.alt || guide.title}
                        width={720}
                        height={720}
                        className="relative h-auto w-full rounded-3xl border border-black/10 object-cover shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]"
                      />
                    </div>
                  ) : null}

                  <div className="contents lg:col-start-2 lg:row-start-1 lg:flex lg:flex-col lg:justify-center">
                    <div className="order-2">
                      <h2 className="heading-2 text-foreground">{guide.title}</h2>
                      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                        {formatEuro(guide.price)}
                      </p>
                      {paragraphs.map((p, i) => (
                        <p key={i} className={i === 0 ? "mt-6 text-lead" : "mt-4 text-body"}>
                          {p}
                        </p>
                      ))}
                    </div>

                    <div className="order-4 border-t border-black/10 pt-8 lg:mt-8">
                      <GuideOrderForm
                        guideId={guide._id}
                        priceLabel={formatEuro(guide.price)}
                      />
                    </div>
                  </div>

                  {bullets.length > 0 ? (
                    <section className="order-3 border-t border-black/10 pt-10 lg:col-span-2 lg:row-start-2 lg:grid lg:grid-cols-[1fr_2fr] lg:gap-16">
                      <div>
                        <h3 className="heading-3 text-foreground">O que tem no guia</h3>
                        {listIntro ? <p className="mt-3 text-body">{listIntro}</p> : null}
                      </div>
                      <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:mt-0">
                        {bullets.map((b) => (
                          <li key={b} className="flex gap-3 text-body">
                            <Check className="mt-1 h-4 w-4 shrink-0 text-foreground" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
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
