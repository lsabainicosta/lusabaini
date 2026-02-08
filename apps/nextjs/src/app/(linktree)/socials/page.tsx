import { getLinktreePageContent } from "@/lib/queries";
import LinktreeAvatar from "@/components/linktree/LinktreeAvatar";
import LinktreeLinks from "@/components/linktree/LinktreeLinks";
import LinktreeSocials from "@/components/linktree/LinktreeSocials";
import { buildCanonicalUrl } from "@/lib/seo";

export default async function SocialsPage() {
  const content = await getLinktreePageContent();
  const siteUrl = buildCanonicalUrl("/");
  const siteHost = new URL(siteUrl).host;

  return (
    <>
      {/* Avatar */}
      <LinktreeAvatar image={content?.profileImage} name={content?.name} />

      {/* Name with verified badge */}
      {content?.name && (
        <div className="mt-4 flex items-center gap-1.5">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {content.name}
          </h1>
        </div>
      )}

      {/* Bio */}
      {content?.bio && (
        <p className="mt-1.5 max-w-xs text-center text-sm text-slate-700/80 sm:text-base">
          {content.bio}
        </p>
      )}

      <p className="mt-3 max-w-xs text-center text-xs text-slate-700/70 sm:text-sm">
        {content?.introText ||
          "A focused links page with my current social channels, featured work, and direct contact paths."}
      </p>

      {/* Social icons */}
      <LinktreeSocials socials={content?.socials} className="mt-6" />

      {/* Links */}
      <LinktreeLinks links={content?.links} className="mt-8 w-full" />

      {/* Subtle branding */}
      {siteHost && (
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-16 text-xs text-slate-500/60 transition-opacity hover:opacity-100"
        >
          {siteHost}
        </a>
      )}
    </>
  );
}
