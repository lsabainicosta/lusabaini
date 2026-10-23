import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@lusabaini/ui/components/badge";
import { Button } from "@lusabaini/ui/components/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@lusabaini/ui/components/accordion";
import Reveal from "@lusabaini/ui/components/motion/Reveal";
import TransitionLink from "@lusabaini/ui/components/motion/TransitionLink";
import { ServiceIcon } from "@/components/ServiceIcon";
import { formatEuro, getGuides, getHomeContent } from "@/lib/queries";
import { buildPageMetadata, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await getHomeContent();
  return buildPageMetadata({
    pathname: "/",
    title: hero?.seoTitle || SITE_NAME,
    description: hero?.seoDescription || SITE_DESCRIPTION,
  });
}

export default async function HomePage() {
  const [{ hero, services, process, about, faq, testimonials }, guides] =
    await Promise.all([getHomeContent(), getGuides()]);

  const heroImageUrl = hero?.heroImage?.url || "/images/hero-netherlands.jpg";
  const isHeroImageLocal = !hero?.heroImage?.url;
  const heroImageAlt =
    hero?.heroImage?.alt ||
    "Ilustração da Holanda: casas de canal, moinho de vento e tulipas";

  return (
    <div className="mx-auto max-w-6xl px-6 pb-16">
      {/* Hero */}
      <section className="pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal>
            {hero?.badgeLabel ? (
              <Badge variant="secondary" className="mb-6">
                {hero.badgeLabel}
              </Badge>
            ) : null}
            <h1 className="heading-display text-foreground">
              {hero?.headlineStart || "Morar na Holanda com"}{" "}
              <span className="italic font-serif">
                {hero?.headlineEmphasis || "clareza"}
              </span>
              {hero?.headlineEnd || " e confiança"}
            </h1>
            <p className="mt-6 text-lead max-w-xl">
              {hero?.description ||
                "Orientação prática para brasileiros que querem se mudar ou viver na Holanda."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <TransitionLink href={hero?.primaryCta?.href || "/contato"}>
                  {hero?.primaryCta?.label || "Agendar conversa"}
                </TransitionLink>
              </Button>
              <Button asChild size="lg" variant="outline">
                <TransitionLink href={hero?.secondaryCta?.href || "/servicos"}>
                  {hero?.secondaryCta?.label || "Ver serviços"}
                </TransitionLink>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="hidden sm:block">
            <div className="relative mx-auto max-w-[420px] lg:max-w-none">
              <div className="absolute -inset-3 rounded-[2rem] bg-white/40 rotate-2" />
              <div className="relative overflow-hidden rounded-3xl border border-black/10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
                <Image
                  src={heroImageUrl}
                  alt={heroImageAlt}
                  width={720}
                  height={960}
                  priority
                  unoptimized={isHeroImageLocal}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services overview */}
      <section className="py-12 md:py-16">
        <Reveal>
          <h2 className="heading-2 text-foreground">
            {services?.headline || "Como posso te ajudar"}
          </h2>
          {services?.intro ? (
            <p className="mt-3 text-lead max-w-2xl">{services.intro}</p>
          ) : null}
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(services?.services ?? []).map((service, i) => (
            <Reveal key={`${service.title}-${i}`} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-black/10 bg-white/50 backdrop-blur-sm p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
                  <ServiceIcon icon={service.icon} />
                </div>
                <h3 className="heading-3 text-foreground">{service.title}</h3>
                <p className="mt-2 text-body">{service.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild variant="outline">
            <TransitionLink href="/servicos">Ver todos os serviços</TransitionLink>
          </Button>
        </div>
      </section>

      {/* Travel guides */}
      {guides.length > 0 ? (
        <section className="py-12 md:py-16">
          <Reveal>
            <h2 className="heading-2 text-foreground">Guias de viagem</h2>
            <p className="mt-3 text-lead max-w-2xl">
              Vai visitar a Holanda? Meus guias digitais reúnem os lugares que eu
              mesma indico para quem vem passear.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide, i) => (
              <Reveal key={guide._id} delay={i * 0.05}>
                <TransitionLink
                  href={`/guias#${guide.slug}`}
                  className="flex h-full items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white/50 p-6 hover:bg-white/70 transition-colors"
                >
                  <h3 className="heading-3 text-foreground">{guide.title}</h3>
                  <span className="shrink-0 text-sm font-medium text-foreground/60">
                    {formatEuro(guide.price)}
                  </span>
                </TransitionLink>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Process */}
      <section className="py-12 md:py-16">
        <Reveal>
          <h2 className="heading-2 text-foreground">
            {process?.headline || "Como funciona"}
          </h2>
          {process?.intro ? (
            <p className="mt-3 text-lead max-w-2xl">{process.intro}</p>
          ) : null}
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {(process?.steps ?? []).map((step, i) => (
            <Reveal key={`${step.title}-${i}`} delay={i * 0.06}>
              <div className="rounded-2xl border border-black/10 bg-white/40 p-6">
                <div className="text-sm font-medium text-foreground/40 tracking-wide">
                  0{i + 1}
                </div>
                <h3 className="mt-3 heading-3 text-foreground">{step.title}</h3>
                <p className="mt-2 text-body">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* About teaser */}
      <section className="py-12 md:py-16">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white/60 backdrop-blur-xl">
            <div className="grid md:grid-cols-[0.85fr_1.15fr] items-stretch">
              <div className="relative hidden md:block min-h-[320px]">
                <Image
                  src="/images/sobre-story.jpg"
                  alt="Ilustração de uma mulher trabalhando em um café holandês à beira de um canal"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="px-6 py-10 md:px-10 md:py-12 flex flex-col items-start justify-center">
                {about?.badgeLabel ? (
                  <Badge variant="secondary" className="mb-4">
                    {about.badgeLabel}
                  </Badge>
                ) : null}
                <h2 className="heading-2 text-foreground max-w-2xl">
                  {about?.headlineStart || "Eu vivi cada etapa dessa"}{" "}
                  <span className="italic font-serif">
                    {about?.headlineEmphasis || "jornada"}
                  </span>
                  {about?.headlineEnd || " na pele"}
                </h2>
                <p className="mt-4 text-lead max-w-xl">
                  {about?.teaser ||
                    "6 anos de Holanda, 3 cidades, 5 empregos — orientação de quem viveu cada etapa na pele."}
                </p>
                <Button asChild className="mt-6">
                  <TransitionLink href="/sobre">Conhecer a Luiza</TransitionLink>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 ? (
        <section className="py-12 md:py-16">
          <Reveal>
            <h2 className="heading-2 text-foreground">O que dizem</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={`${t.name}-${i}`} delay={i * 0.05}>
                <blockquote className="h-full rounded-2xl border border-black/10 bg-white/50 p-6 flex flex-col">
                  <p className="text-body flex-1">“{t.quote}”</p>
                  <footer className="mt-4">
                    <div className="font-medium text-foreground">{t.name}</div>
                    {t.role ? (
                      <div className="text-sm text-foreground/50">{t.role}</div>
                    ) : null}
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {(faq?.items?.length ?? 0) > 0 ? (
        <section className="py-12 md:py-16">
          <Reveal>
            <h2 className="heading-2 text-foreground mb-8">
              {faq?.headline || "Perguntas frequentes"}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faq!.items!.map((item, i) => (
                <AccordionItem key={`${item.question}-${i}`} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base md:text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-body">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </section>
      ) : null}

      {/* CTA */}
      <section className="py-12 md:py-16">
        <Reveal>
          <div className="rounded-3xl border border-black/10 bg-foreground text-background px-6 py-12 md:px-10 text-center">
            <h2 className="heading-2">Pronta para o próximo passo?</h2>
            <p className="mt-3 text-background/70 max-w-xl mx-auto text-lg">
              Conte onde você está na jornada — eu te ajudo a organizar o caminho
              com clareza.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8">
              <TransitionLink href="/contato">Agendar conversa</TransitionLink>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
