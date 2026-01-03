import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";
import PageTransition from "@/components/motion/PageTransition";
import LenisScroll from "@/components/motion/LenisScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getShellContent, getThemeSettings } from "@/lib/queries";
import { TransitionProvider } from "@/components/motion/TransitionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luiza Sabaini Costa",
  description: "Portfolio and quick links to Luiza Sabaini Costa",
  applicationName: "Luiza Sabaini Costa",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  const [{ header, footer }, theme] = await Promise.all([
    getShellContent(),
    getThemeSettings(),
  ]);
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
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PwaRegister />
        <LenisScroll />
        <TransitionProvider>
          <Header navLinks={header?.navLinks} cta={header?.cta} />
          <PageTransition>
            <main className="relative min-h-screen w-full overflow-x-hidden pt-16">
              {children}
              <Footer
                brandLabel={footer?.brandLabel}
                headlineStart={footer?.headlineStart}
                headlineEmphasis={footer?.headlineEmphasis}
                headlineEnd={footer?.headlineEnd}
                description={footer?.description}
                socials={footer?.socials}
                navigationLinks={footer?.navigationLinks}
                legalLinks={footer?.legalLinks}
                cta={header?.cta}
              />
            </main>
          </PageTransition>
        </TransitionProvider>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
