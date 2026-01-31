import { getLinktreePageContent, getThemeSettings } from "@/lib/queries";
import LinktreeAvatar from "@/components/linktree/LinktreeAvatar";
import LinktreeLinks from "@/components/linktree/LinktreeLinks";
import LinktreeSocials from "@/components/linktree/LinktreeSocials";
import LinktreeShareButton from "@/components/linktree/LinktreeShareButton";
import { BadgeCheck } from "lucide-react";

export default async function SocialsPage() {
  const [content, theme] = await Promise.all([
    getLinktreePageContent(),
    getThemeSettings(),
  ]);

  const brandColor = theme?.brandColor || "#ff7edb";

  return (
    <LinktreeShareButton
      name={content?.name}
      username={content?.username}
      profileImage={content?.profileImage}
    >
      <div
        className="relative min-h-screen w-full"
        style={{
          background: `linear-gradient(180deg, ${brandColor} 0%, color-mix(in srgb, ${brandColor} 40%, #ffffff) 50%, color-mix(in srgb, ${brandColor} 15%, #ffffff) 100%)`,
        }}
      >
        {/* Decorative background blur elements */}
        <div
          className="pointer-events-none absolute left-1/4 top-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ backgroundColor: brandColor }}
        />
        <div
          className="pointer-events-none absolute right-1/4 top-40 h-48 w-48 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: brandColor }}
        />

        <div className="relative mx-auto flex min-h-screen max-w-[680px] flex-col items-center px-6 pt-20 pb-12 sm:pt-28 sm:pb-16">
          {/* Avatar */}
          <LinktreeAvatar image={content?.profileImage} name={content?.name} />

          {/* Name with verified badge */}
          {content?.name && (
            <div className="mt-4 flex items-center gap-1.5">
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                {content.name}
              </h1>
              <BadgeCheck
                className="h-5 w-5 text-blue-500 sm:h-6 sm:w-6"
                aria-label="Verified"
              />
            </div>
          )}

          {/* Bio */}
          {content?.bio && (
            <p className="mt-1.5 max-w-xs text-center text-sm text-slate-700/80 sm:text-base">
              {content.bio}
            </p>
          )}

          {/* Social icons */}
          <LinktreeSocials socials={content?.socials} className="mt-6" />

          {/* Links */}
          <LinktreeLinks links={content?.links} className="mt-8 w-full" />

          {/* Subtle branding */}
          {process.env.NEXT_PUBLIC_SITE_DOMAIN && (
            <p className="mt-auto pt-16 text-xs text-slate-500/60">
              {process.env.NEXT_PUBLIC_SITE_DOMAIN}
            </p>
          )}
        </div>
      </div>
    </LinktreeShareButton>
  );
}
