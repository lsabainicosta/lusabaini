import type { Metadata } from "next";
import { getLinktreePageContent, getThemeSettings } from "@/lib/queries";
import LinktreeShareButton from "@/components/linktree/LinktreeShareButton";

export const metadata: Metadata = {
  title: "Links | Luiza Sabaini Costa",
  description:
    "Find all my links in one place - social media, contact, and more.",
};

export default async function LinktreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [content, theme] = await Promise.all([
    getLinktreePageContent(),
    getThemeSettings(),
  ]);

  const brandColor = theme?.brandColor || "#ff7edb";

  return (
    <div
      className="relative min-h-dvh w-full"
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

      {/* Share button */}
      <LinktreeShareButton
        name={content?.name}
        username={content?.username}
        profileImage={content?.profileImage}
      />

      <div className="relative mx-auto flex min-h-dvh max-w-[680px] flex-col items-center px-6 pb-12 pt-20 sm:pb-16 sm:pt-28">
        {children}
      </div>
    </div>
  );
}
