"use server";

import ProfileHeader from "@/components/ProfileHeader";
import SocialButtons from "@/components/SocialButtons";
import Footer from "@/components/Footer";
import { getHomepageContent } from "@/lib/queries";

export default async function Home() {
  const { profileHeader, socialLinks = [] } = await getHomepageContent();

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background orbs */}
      <div
        aria-hidden
        className="pointer-events-none fixed -left-10 -top-16 z-0 h-64 w-64 animate-blob rounded-full opacity-40 blur-3xl md:h-80 md:w-80"
        style={{ backgroundColor: "var(--brand-color, #ff7edb)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -right-16 top-10 z-0 h-72 w-72 animate-blob animation-delay-2000 rounded-full opacity-35 blur-3xl md:h-96 md:w-96"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--brand-color, #ff7edb) 80%, #c4b5fd)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -bottom-16 left-24 z-0 h-64 w-64 animate-blob animation-delay-4000 rounded-full opacity-30 blur-3xl md:h-80 md:w-80"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--brand-color, #ff7edb) 65%, #facc15)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-0 pb-10 pt-0 sm:px-4 sm:pt-8 sm:pb-12 lg:max-w-7xl lg:gap-14 lg:px-8 lg:pb-16">
        <ProfileHeader
          name={profileHeader?.name}
          image={profileHeader?.image}
          buttons={profileHeader?.buttons}
        />
        <SocialButtons links={socialLinks} />
        <Footer />
      </div>
    </main>
  );
}
