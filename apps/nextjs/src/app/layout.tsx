import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";
import LenisScroll from "@/components/motion/LenisScroll";
import { Providers } from "@/components/Providers";
import { getThemeSettings } from "@/lib/queries";
import ConsentManagedAnalytics from "@/components/ConsentManagedAnalytics";
import {
  buildCanonicalUrl,
  createRobots,
  getMetadataBase,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Not used on initial render, prevents preload warning
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: "Luiza Sabaini Costa — Portfolio",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: buildCanonicalUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: buildCanonicalUrl("/"),
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: createRobots(true, true),
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      }
    : undefined,
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "transparent",
};

function clampChannel(value: number) {
  return Math.min(255, Math.max(0, value));
}

function shiftHexColor(hex: string, shift: number) {
  const match = /^#?([a-fA-F0-9]{6})([a-fA-F0-9]{2})?$/.exec(hex.trim());
  if (!match) return hex;
  const num = parseInt(match[1], 16);
  const r = clampChannel((num >> 16) + shift);
  const g = clampChannel(((num >> 8) & 0xff) + shift);
  const b = clampChannel((num & 0xff) + shift);
  const alpha = match[2]?.toLowerCase() ?? "";
  return `#${[r, g, b]
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}${alpha}`;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeSettings();
  const brandColor = theme?.brandColor || "#f9f3eb";
  const brandLight = shiftHexColor(brandColor, 28);
  const brandDark = shiftHexColor(brandColor, -35);
  const brandSoft = shiftHexColor(brandColor, 55);

  return (
    <html
      lang="en"
      style={{
        ["--brand-color" as string]: brandColor,
        ["--brand-light" as string]: brandLight,
        ["--brand-dark" as string]: brandDark,
        ["--brand-soft" as string]: brandSoft,
      }}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PwaRegister />
        <LenisScroll />
        <Providers>{children}</Providers>
        <ConsentManagedAnalytics />
      </body>
    </html>
  );
}
