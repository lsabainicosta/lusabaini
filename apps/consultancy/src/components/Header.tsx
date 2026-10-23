"use client";

import { useState } from "react";
import { cn } from "@lusabaini/ui/lib/utils";
import { Button } from "@lusabaini/ui/components/button";
import Logo from "@/components/Logo";
import TransitionLink from "@lusabaini/ui/components/motion/TransitionLink";

type NavLink = { href: string; label: string };

type Props = {
  navLinks?: NavLink[];
  cta?: { label?: string; href?: string };
};

const defaultNavLinks: NavLink[] = [
  { href: "/", label: "Início" },
  { href: "/servicos", label: "Serviços" },
  { href: "/sobre", label: "Sobre" },
  { href: "/guias", label: "Guias" },
];

const Header = ({ navLinks, cta }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = (navLinks?.length ? navLinks : defaultNavLinks).filter(
    (l) => l.href && l.label
  );
  const ctaLabel = cta?.label || "Agendar conversa";
  const ctaHref = cta?.href || "/contato";

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 w-full border-b border-black/10"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        backgroundColor: "var(--brand-color)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <TransitionLink
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-[-0.04em] text-foreground hover:opacity-60 transition-opacity font-sans"
              >
                {link.label}
              </TransitionLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button size="sm" asChild className="hidden sm:inline-flex">
              <TransitionLink href={ctaHref}>{ctaLabel}</TransitionLink>
            </Button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative flex h-6 w-6 flex-col items-center justify-center gap-[4px] md:hidden z-50 group"
              aria-label="Abrir menu"
            >
              <div
                className={cn(
                  "h-[2px] w-[20px] rounded-full bg-foreground transition-all duration-300",
                  isMenuOpen && "translate-y-[3px] rotate-45"
                )}
              />
              <div
                className={cn(
                  "h-[2px] w-[20px] rounded-full bg-foreground transition-all duration-300",
                  isMenuOpen && "-translate-y-[3px] -rotate-45"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 transition-all duration-300 ease-in-out md:hidden",
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          backgroundColor: "var(--brand-color)",
        }}
      >
        <div className="flex flex-col items-start gap-6 px-6 pt-32 h-full">
          {links.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-3xl font-medium tracking-[-0.04em] text-foreground hover:opacity-60 transition-opacity font-sans"
            >
              {link.label}
            </TransitionLink>
          ))}
          <Button size="lg" asChild className="mt-4 w-full">
            <TransitionLink href={ctaHref} onClick={() => setIsMenuOpen(false)}>
              {ctaLabel}
            </TransitionLink>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
