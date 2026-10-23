"use client";

import type { NavLink } from "@/lib/queries";
import TransitionLink from "@lusabaini/ui/components/motion/TransitionLink";
import { Button } from "@lusabaini/ui/components/button";

type Props = {
  brandLabel?: string;
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  description?: string;
  navigationLinks?: NavLink[];
  cta?: { label?: string; href?: string };
};

const defaultNavLinks: NavLink[] = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/servicos" },
  { label: "Sobre", href: "/sobre" },
  { label: "Guias", href: "/guias" },
];

function formatHeadlineEnd(end?: string) {
  const value = (end ?? "").trimEnd();
  if (!value) return "";
  if (/^\s/.test(end ?? "")) return end ?? "";
  if (/^[,.;:!?)/\]]/.test(value)) return value;
  return ` ${value}`;
}

export default function Footer({
  brandLabel,
  headlineStart,
  headlineEmphasis,
  headlineEnd,
  description,
  navigationLinks,
  cta,
}: Props) {
  const currentYear = new Date().getFullYear();

  const resolvedNavLinks = (navigationLinks ?? [])
    .filter((l) => l?.href && l?.label)
    .slice(0, 4);

  const navLinks = resolvedNavLinks.length ? resolvedNavLinks : defaultNavLinks;

  const titleStart = headlineStart || "Sua nova vida na";
  const titleEmphasis = headlineEmphasis || "Holanda";
  const titleEnd = headlineEnd || " começa com orientação clara.";
  const body =
    description ||
    "Consultoria prática para brasileiros que querem se mudar ou se estabelecer na Holanda.";
  const formattedTitleEnd = formatHeadlineEnd(titleEnd);

  const ctaLabel = cta?.label?.trim() || "Agendar conversa";
  const ctaHref = cta?.href || "/contato";

  return (
    <footer className="w-full mt-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-black/10 bg-white/60 backdrop-blur-xl px-6 py-10 md:px-10 md:py-12">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 justify-between">
            <div className="flex flex-col gap-5 max-w-xl">
              <TransitionLink
                href="/"
                className="text-lg font-medium tracking-[-0.05em] text-foreground hover:opacity-70 transition-opacity font-sans"
              >
                {brandLabel || "Luiza Sabaini"}
              </TransitionLink>

              <div className="flex flex-col gap-3">
                <h2 className="heading-2 text-foreground">
                  {titleStart}{" "}
                  <span className="italic font-serif">{titleEmphasis}</span>
                  {formattedTitleEnd}
                </h2>
                <p className="text-body font-sans max-w-lg">{body}</p>
              </div>
            </div>

            <div className="flex flex-col gap-8 lg:items-end">
              <Button asChild size="lg">
                <TransitionLink href={ctaHref}>{ctaLabel}</TransitionLink>
              </Button>

              <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium tracking-tight text-foreground/70">
                {navLinks.map((l, i) => (
                  <TransitionLink
                    key={`${l.href}-${i}`}
                    href={l.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </TransitionLink>
                ))}
                <TransitionLink
                  href="/contato"
                  className="hover:text-foreground transition-colors"
                >
                  Contato
                </TransitionLink>
              </nav>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-black/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-medium tracking-tight text-foreground/40">
            <p>
              © {currentYear} {brandLabel || "Luiza Sabaini Costa"}
            </p>
            <p>Consultoria para morar na Holanda</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
