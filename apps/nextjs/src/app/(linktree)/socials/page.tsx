import { getLinktreePageContent } from "@/lib/queries";
import LinktreeAvatar from "@/components/linktree/LinktreeAvatar";
import LinktreeLinks from "@/components/linktree/LinktreeLinks";
import LinktreeSocials from "@/components/linktree/LinktreeSocials";

export default async function SocialsPage() {
  const content = await getLinktreePageContent();

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

      {/* Social icons */}
      <LinktreeSocials socials={content?.socials} className="mt-6" />

      {/* Links */}
      <LinktreeLinks links={content?.links} className="mt-8 w-full" />

      {/* Subtle branding */}
      {process.env.NEXT_PUBLIC_SITE_DOMAIN && (
        <a 
          href={`https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-16 text-xs text-slate-500/60 transition-opacity hover:opacity-100"
        >
          {process.env.NEXT_PUBLIC_SITE_DOMAIN}
        </a>
      )}
    </>
  );
}
