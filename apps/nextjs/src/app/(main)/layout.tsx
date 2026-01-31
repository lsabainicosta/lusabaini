import PageTransition from "@/components/motion/PageTransition";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getShellContent } from "@/lib/queries";
import { TransitionProvider } from "@/components/motion/TransitionContext";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { siteSettings, footer } = await getShellContent();

  const mainNavigation = siteSettings?.mainNavigation;
  const ctaButton = siteSettings?.ctaButton;
  const socials = siteSettings?.socials;

  return (
    <TransitionProvider>
      <Header navLinks={mainNavigation} cta={ctaButton} />
      <PageTransition>
        <main className="relative min-h-screen w-full overflow-x-hidden pt-16">
          {children}
          <Footer
            brandLabel={footer?.brandLabel}
            headlineStart={footer?.headlineStart}
            headlineEmphasis={footer?.headlineEmphasis}
            headlineEnd={footer?.headlineEnd}
            description={footer?.description}
            socials={socials}
            navigationLinks={mainNavigation}
            legalLinks={footer?.legalLinks}
            cta={ctaButton}
          />
        </main>
      </PageTransition>
    </TransitionProvider>
  );
}
