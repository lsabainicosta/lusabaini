import type { Metadata, Viewport } from "next";
import { getLinktreePageContent, getThemeSettings } from "@/lib/queries";
import LinktreeShareButton from "@/components/linktree/LinktreeShareButton";
import { buildPageMetadata } from "@/lib/seo";
import "./linktree.css";

export async function generateMetadata(): Promise<Metadata> {
  const [theme, content] = await Promise.all([
    getThemeSettings(),
    getLinktreePageContent(),
  ]);
  const brandColor = theme?.brandColor || "#ff7edb";
  const title = content?.seoTitle?.trim() || "Socials and Direct Links";
  const description =
    content?.seoDescription?.trim() ||
    "Explore Luiza Sabaini Costa's social channels, featured links, and direct contact shortcuts in one place.";
  const baseMetadata = buildPageMetadata({
    pathname: "/socials",
    title,
    description,
  });

  return {
    ...baseMetadata,
    themeColor: [
      { color: brandColor },
      { color: brandColor, media: "(prefers-color-scheme: light)" },
      { color: brandColor, media: "(prefers-color-scheme: dark)" },
    ],
    colorScheme: "light",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Links",
    },
    other: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
    },
  };
}

function mixHexWithWhite(hex: string, brandWeight: number) {
  const match = /^#?([a-fA-F0-9]{6})$/.exec(hex.trim());
  if (!match) return "#f4edf1";

  const value = parseInt(match[1], 16);
  const r = (value >> 16) & 0xff;
  const g = (value >> 8) & 0xff;
  const b = value & 0xff;

  const mix = (channel: number) =>
    Math.round(channel * brandWeight + 255 * (1 - brandWeight));

  return `#${[mix(r), mix(g), mix(b)]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;
}

export async function generateViewport(): Promise<Viewport> {
  const theme = await getThemeSettings();
  const brandColor = theme?.brandColor || "#ff7edb";

  return {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: brandColor,
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
  const middleColor = mixHexWithWhite(brandColor, 0.4);
  const bottomColor = mixHexWithWhite(brandColor, 0.15);
  const pageGradient = `linear-gradient(180deg, ${brandColor} 0%, ${middleColor} 50%, ${bottomColor} 100%)`;

  return (
    <>
      {/* Keep root fallback color aligned with the page gradient for iOS Safari chrome. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html { 
              color-scheme: light;
              background-color: ${brandColor} !important;
              background-image: ${pageGradient} !important;
              background-repeat: no-repeat;
              background-size: 100% 100%;
              height: 100%;
            }
            body { 
              background-color: ${bottomColor} !important;
              background-image: ${pageGradient} !important;
              background-repeat: no-repeat;
              background-size: 100% 100%;
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
            "--linktree-gradient": pageGradient,
          } as React.CSSProperties
        }
      >
        {/* Top-only iOS Safari fallback paint for status/chrome area */}
        <div className="linktree-top-safe-fallback" aria-hidden />

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
