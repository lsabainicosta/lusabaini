import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getThemeSettings } from "@/lib/queries";
import PwaRegister from "@/components/PwaRegister";

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
  themeColor: "#ff7edb",
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
  const match = /^#?([a-fA-F0-9]{6})$/.exec(hex.trim());
  if (!match) return hex;
  const num = parseInt(match[1], 16);
  const r = clampChannel((num >> 16) + shift);
  const g = clampChannel(((num >> 8) & 0xff) + shift);
  const b = clampChannel((num & 0xff) + shift);
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeSettings();

  const brandColor = theme?.brandColor?.trim() || "#ff7edb";
  const brandSoft = shiftHexColor(brandColor, 28);
  const brandStrong = shiftHexColor(brandColor, -35);
  const fontFamily =
    theme?.fontFamily?.trim() || "var(--font-geist-sans), sans-serif";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          ["--brand-color" as string]: brandColor,
          ["--brand-soft" as string]: brandSoft,
          ["--brand-strong" as string]: brandStrong,
          ["--font-app" as string]: fontFamily,
        }}
      >
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
