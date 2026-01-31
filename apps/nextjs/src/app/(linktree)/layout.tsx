import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links | Luiza Sabaini Costa",
  description: "Find all my links in one place - social media, contact, and more.",
};

export default function LinktreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
