"use client";

import { Instagram, Linkedin, Mail } from "lucide-react";
import type { SocialLink } from "@/lib/queries";
import { buildMailtoUrl } from "@/lib/utils";

type Props = {
  socials?: SocialLink[];
  className?: string;
  iconClassName?: string;
  buttonClassName?: string;
};

function SocialIcon({ icon }: { icon: SocialLink["icon"] }) {
  if (icon === "instagram") return <Instagram className="w-5 h-5" />;
  if (icon === "linkedin") return <Linkedin className="w-5 h-5" />;
  if (icon === "email") return <Mail className="w-5 h-5" />;
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
  if (icon === "x") {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  // Fallback (should not happen with proper types)
  return <Mail className="w-5 h-5" />;
}

export default function SocialLinks({
  socials,
  className = "",
  buttonClassName = "w-10 h-10 rounded-full border border-black/10 bg-white/40 backdrop-blur-md flex items-center justify-center text-black hover:bg-white/70 transition-colors",
}: Props) {
  const socialData = (socials ?? [])
    .filter((s) => (s?.href ?? "").trim() && (s.href ?? "").trim() !== "#")
    .slice(0, 6);

  if (!socialData.length) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socialData.map((s, idx) => {
        // Enhance mailto links with subject and body if provided
        const href =
          s.icon === "email"
            ? buildMailtoUrl(s.href, s.emailSubject, s.emailBody)
            : s.href;

        return (
          <a
            key={`${s.icon}-${idx}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label || s.icon}
            className={buttonClassName}
          >
            <SocialIcon icon={s.icon} />
          </a>
        );
      })}
    </div>
  );
}

export { SocialIcon };
