"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import TransitionLink from "@/components/motion/TransitionLink";
import { EASE_OUT } from "@/components/motion/fade";
import { useContactModal } from "@/components/contact";

type NavLink = { href: string; label: string };

type Props = {
  navLinks?: NavLink[];
  cta?: { label?: string };
};

const defaultNavLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/my-work", label: "My Work" },
];

const Header = ({ navLinks, cta }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openModal } = useContactModal();
  const links = (navLinks?.length ? navLinks : defaultNavLinks).filter(
    (l) => l.href && l.label
  );
  const ctaLabel = cta?.label || "Get in touch";

  return (
    <motion.header 
      className="fixed inset-x-0 top-0 z-50 w-full bg-transparent"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
    >
      {/* Progressive Blur Layer */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none -z-10"
        style={{
          backdropFilter: "blur(20px)",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      />

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo Section */}
        <Logo />

        {/* Desktop Navigation & Actions Group */}
        <div className="flex items-center gap-8">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <TransitionLink
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-[-0.04em] text-black hover:opacity-60 transition-opacity font-sans"
              >
                {link.label}
              </TransitionLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              size="sm"
              onClick={openModal}
              className="hidden sm:inline-flex"
            >
              {ctaLabel}
            </Button>

            {/* Framer-style Menu Icon */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative flex h-6 w-6 flex-col items-center justify-center gap-[4px] md:hidden z-50 group"
              aria-label="Toggle Menu"
            >
              <div
                className={cn(
                  "h-[2px] w-[20px] rounded-full bg-black transition-all duration-300",
                  isMenuOpen && "translate-y-[3px] rotate-45"
                )}
              />
              <div
                className={cn(
                  "h-[2px] w-[20px] rounded-full bg-black transition-all duration-300",
                  isMenuOpen && "-translate-y-[3px] -rotate-45"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-(--brand-color)/95 backdrop-blur-xl transition-all duration-300 ease-in-out md:hidden",
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-start gap-6 px-6 pt-32 h-full">
          {links.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-[32px] font-medium tracking-[-0.04em] text-black hover:opacity-60 transition-opacity font-sans"
            >
              {link.label}
            </TransitionLink>
          ))}
          <Button
            type="button"
            size="lg"
            onClick={() => {
              setIsMenuOpen(false);
              openModal();
            }}
            className="mt-4 w-full"
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
