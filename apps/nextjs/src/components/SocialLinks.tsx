"use client";

import { Mail } from "lucide-react";
import {
  SiInstagram,
  SiLinkedin,
  SiTiktok,
  SiYoutube,
  SiFacebook,
  SiX,
} from "react-icons/si";
import type { SocialLink } from "@/lib/queries";
import { buildMailtoUrl } from "@/lib/utils";

type Props = {
  socials?: SocialLink[];
  className?: string;
  iconClassName?: string;
  buttonClassName?: string;
};

function SocialIcon({ icon }: { icon: SocialLink["icon"] }) {
  if (icon === "instagram") return <SiInstagram className="w-5 h-5" />;
  if (icon === "linkedin") return <SiLinkedin className="w-5 h-5" />;
  if (icon === "email") return <Mail className="w-5 h-5" />;
  if (icon === "tiktok") return <SiTiktok className="w-5 h-5" />;
  if (icon === "youtube") return <SiYoutube className="w-5 h-5" />;
  if (icon === "facebook") return <SiFacebook className="w-5 h-5" />;
  if (icon === "x") return <SiX className="w-5 h-5" />;
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
