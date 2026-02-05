import type { Metadata } from "next";
import { getLinktreePageContent, getThemeSettings } from "@/lib/queries";
import LinktreeShareButton from "@/components/linktree/LinktreeShareButton";
import "./linktree.css";

export const metadata: Metadata = {
  title: "Links | Luiza Sabaini Costa",
  description:
    "Find all my links in one place - social media, contact, and more.",
};

export async function generateViewport() {
  const theme = await getThemeSettings();
  return {
    themeColor: theme?.brandColor || "#ff7edb",
    viewportFit: "cover",
  };
}

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
  const bottomColor = `color-mix(in srgb, ${brandColor} 15%, #ffffff)`;

  return (
    <>
      {/* iOS Safari Status Bar and Safe Area fixes - mirroring Linktree.com approach */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html { 
              background-color: ${brandColor} !important;
              height: 100%;
            }
            body { 
              background-color: transparent !important;
              min-height: 100%;
              margin: 0;
            }
          `,
        }}
      />
      <div
        className="linktree-container"
        style={
          {
            "--linktree-brand": brandColor,
            "--linktree-bottom": bottomColor,
          } as React.CSSProperties
        }
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

        <div className="linktree-content">
          {children}
        </div>
      </div>
    </>
  );
}
