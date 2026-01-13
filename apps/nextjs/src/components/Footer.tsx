"use client";

import { Instagram, Linkedin } from "lucide-react";
import type { CtaLink, FooterLink, NavLink, SocialLink } from "@/lib/queries";
import TransitionLink from "@/components/motion/TransitionLink";
import { Button } from "@/components/ui/button";

type Props = {
  brandLabel?: string;
  headlineStart?: string;
  headlineEmphasis?: string;
  headlineEnd?: string;
  description?: string;
  socials?: SocialLink[];
  navigationLinks?: NavLink[];
  legalLinks?: FooterLink[];
  cta?: CtaLink;
};

const defaultNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "My Work", href: "/my-work" },
];

const defaultLegalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
];

function SocialIcon({ icon }: { icon: SocialLink["icon"] }) {
  if (icon === "instagram") return <Instagram className="w-5 h-5" />;
  if (icon === "linkedin") return <Linkedin className="w-5 h-5" />;
  if (icon === "tiktok") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    );
  }
  if (icon === "youtube") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (icon === "facebook") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  // X (Twitter)
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function isExternalHref(href: string) {
  return /^(https?:\/\/|mailto:|tel:)/i.test(href);
}

function formatHeadlineEnd(end?: string) {
  const value = (end ?? "").trimEnd();
  if (!value) return "";
  if (/^\s/.test(end ?? "")) return end ?? "";
  // Don't add a space before punctuation like "." or ",".
  if (/^[,.;:!?)/\]]/.test(value)) return value;
  return ` ${value}`;
}

function FooterNavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const safeHref = href?.trim();
  if (!safeHref || safeHref === "#") return null;

  if (isExternalHref(safeHref)) {
    return (
      <a
        href={safeHref}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <TransitionLink href={safeHref} className={className}>
      {children}
    </TransitionLink>
  );
}

export default function Footer({
  brandLabel,
  headlineStart,
  headlineEmphasis,
  headlineEnd,
  description,
  socials,
  navigationLinks,
  legalLinks,
  cta,
}: Props) {
  const currentYear = new Date().getFullYear();
  const socialData = (socials ?? [])
    .filter((s) => (s?.href ?? "").trim() && (s.href ?? "").trim() !== "#")
    .slice(0, 3);

  const resolvedNavLinks = (navigationLinks ?? [])
    .filter((l) => l?.href && l?.label)
    .slice(0, 3);

  const resolvedLegalLinks = (legalLinks ?? [])
    .filter((l) => l?.href && l?.label)
    .slice(0, 3);

  const navLinks = resolvedNavLinks.length ? resolvedNavLinks : defaultNavLinks;
  const privacyHref = "/privacy-policy";
  const normalizedLegalLinks = [...resolvedLegalLinks];
  const hasPrivacyLink = normalizedLegalLinks.some(
    (l) => (l.href ?? "").trim() === privacyHref
  );

  if (!hasPrivacyLink) {
    normalizedLegalLinks.push(defaultLegalLinks[0]);
  }

  const bottomLegalLinks =
    normalizedLegalLinks.length > 0 ? normalizedLegalLinks : defaultLegalLinks;

  // Keep at most 3, but ensure Privacy Policy is visible.
  const safeBottomLegalLinks = (() => {
    if (bottomLegalLinks.length <= 3) return bottomLegalLinks;
    const firstThree = bottomLegalLinks.slice(0, 3);
    const privacyInFirstThree = firstThree.some(
      (l) => (l.href ?? "").trim() === privacyHref
    );
    if (privacyInFirstThree) return firstThree;
    return [...firstThree.slice(0, 2), defaultLegalLinks[0]];
  })();

  const titleStart = headlineStart || "Short-form that turns attention into";
  const titleEmphasis = headlineEmphasis || "customers";
  const titleEnd = headlineEnd || ".";
  const body =
    description ||
    "I create TikTok & Instagram content designed to convert views into booked calls and sales.";
  const formattedTitleEnd = formatHeadlineEnd(titleEnd);

  const ctaHref = cta?.href?.trim() || "/book-a-call";
  const ctaLabel = cta?.label?.trim() || "Book a call";

  return (
    <footer className="w-full mt-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl border border-black/10 bg-white/60 backdrop-blur-xl px-6 py-10 md:px-10 md:py-12">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 justify-between">
            {/* Copy */}
            <div className="flex flex-col gap-5 max-w-xl">
              <TransitionLink
                href="/"
                className="text-lg font-medium tracking-[-0.05em] text-black hover:opacity-70 transition-opacity font-sans"
              >
                {brandLabel || "lu sabaini"}
              </TransitionLink>

              <div className="flex flex-col gap-3">
                <h2 className="text-[34px] md:text-[40px] leading-[1.08] font-medium tracking-[-0.04em] text-black">
                  {titleStart}{" "}
                  <span className="italic font-serif">{titleEmphasis}</span>
                  {formattedTitleEnd}
                </h2>
                <p className="text-base md:text-lg text-black/60 font-sans leading-relaxed max-w-lg">
                  {body}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-8 lg:items-end">
              <Button
                asChild
                className="rounded-full bg-black text-white px-7 py-3 h-auto text-base font-medium hover:bg-black/90 transition-all border-none w-fit"
              >
                <FooterNavLink href={ctaHref}>{ctaLabel}</FooterNavLink>
              </Button>

              <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium tracking-tight text-black/70">
                {navLinks.map((l, i) => (
                  <FooterNavLink
                    key={`${l.href}-${i}`}
                    href={l.href}
                    className="hover:text-black transition-colors"
                  >
                    {l.label}
                  </FooterNavLink>
                ))}
              </nav>

              {socialData.length ? (
                <div className="flex items-center gap-3">
                  {socialData.map((s, idx) => (
                    <a
                      key={`${s.icon}-${idx}`}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label || s.icon}
                      className="w-10 h-10 rounded-full border border-black/10 bg-white/40 backdrop-blur-md flex items-center justify-center text-black hover:bg-white/70 transition-colors"
                    >
                      <SocialIcon icon={s.icon} />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 pt-6 border-t border-black/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-medium tracking-tight text-black/40">
            <p>
              © {currentYear} {brandLabel || "lu sabaini"}
            </p>
            {bottomLegalLinks.length ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {safeBottomLegalLinks.map((l, i) => (
                  <FooterNavLink
                    key={`${l.href}-${i}`}
                    href={l.href}
                    className="hover:text-black/70 transition-colors"
                  >
                    {l.label}
                  </FooterNavLink>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
