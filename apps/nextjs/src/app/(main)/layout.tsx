import PageTransition from "@/components/motion/PageTransition";
import TransitionShell from "@/components/motion/TransitionShell";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
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
  const legalLinks = footer?.legalLinks ?? [];
  const cookiePolicyHref =
    legalLinks.find((link) => /cookie/i.test(link.label) || /cookie/i.test(link.href))
      ?.href ?? "/legal/cookie-policy";

  return (
    <TransitionProvider exitDurationMs={420}>
      <Header navLinks={mainNavigation} cta={ctaButton} />
      <PageTransition>
        <TransitionShell>
          <main className="relative min-h-screen w-full overflow-x-hidden pt-[calc(4rem+env(safe-area-inset-top))]">
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
        </TransitionShell>
      </PageTransition>
      <CookieBanner policyHref={cookiePolicyHref} />
    </TransitionProvider>
  );
}
