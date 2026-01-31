import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Privacy Policy | Lu Sabaini",
  description:
    "Privacy policy for Lu Sabaini's website, including analytics and contact form data usage.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="w-full pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative">
          <div className="max-w-3xl flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col items-start gap-8">
              <Badge className="px-4 py-1 bg-black/5 rounded-lg text-xs font-semibold uppercase tracking-wider text-black/60 border-transparent">
                Privacy policy
              </Badge>

              <div className="flex flex-col gap-4">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-medium tracking-[-0.04em] leading-[0.9] text-black">
                  Privacy <span className="italic font-serif">Policy</span>.
                </h1>
                <p className="text-xl text-black/60 font-sans leading-relaxed">
                  Last updated: January 2026
                </p>
                <p className="text-xl text-black/60 font-sans leading-relaxed">
                  This website is operated by Lu Sabaini. I value your privacy
                  and only collect information that is necessary to understand
                  how the website is used and to respond to messages you choose
                  to send.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="glass-card rounded-[2.5rem] p-4 sm:p-6 border border-black/10">
              <div className="relative overflow-hidden rounded-[2rem] bg-white/50 px-6 py-8 sm:px-8 sm:py-10">
                <div className="text-base sm:text-lg text-black/70 font-sans leading-relaxed space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-black">
                      Information I collect
                    </h2>

                    <div className="space-y-3">
                      <h3 className="text-xl sm:text-2xl font-medium tracking-[-0.03em] text-black">
                        1. Analytics (Google Analytics)
                      </h3>
                      <p>
                        This website uses Google Analytics to understand how
                        visitors use the site.
                      </p>
                      <p>Google Analytics may collect:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Pages visited</li>
                        <li>Time spent on pages</li>
                        <li>Device and browser type</li>
                        <li>Approximate location (country or city level)</li>
                      </ul>
                      <p>
                        This information is aggregated and anonymised. I use it
                        only to improve the website and its content.
                      </p>
                      <p>
                        Google Analytics may place cookies in your browser to
                        function properly.
                      </p>
                      <p>
                        You can learn how Google uses data here:{" "}
                        <a
                          href="https://policies.google.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 hover:opacity-80 transition-opacity"
                        >
                          https://policies.google.com/privacy
                        </a>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl sm:text-2xl font-medium tracking-[-0.03em] text-black">
                        2. Contact form
                      </h3>
                      <p>
                        If you submit a message through the contact form, I
                        collect the information you provide, such as:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Your name</li>
                        <li>Your email address</li>
                        <li>Your message</li>
                      </ul>
                      <p>
                        This information is used only to respond to your inquiry
                        and is not shared or sold.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-black">
                      Cookies
                    </h2>
                    <p>
                      This website uses cookies only for analytics purposes via
                      Google Analytics.
                    </p>
                    <p>
                      No cookies are used for advertising or tracking across
                      other websites.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-black">
                      External links
                    </h2>
                    <p>
                      This website contains links to third-party platforms such
                      as Instagram and TikTok.
                    </p>
                    <p>
                      I am not responsible for the privacy practices of those
                      platforms. Any interaction with them is subject to their
                      own privacy policies.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-black">
                      How your data is used
                    </h2>
                    <p>Your data is:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Used only for analytics and communication</li>
                      <li>Never sold</li>
                      <li>Never shared with third parties for marketing</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-black">
                      Data retention
                    </h2>
                    <p>
                      Analytics data is retained according to Google
                      Analytics&apos; default retention settings. Contact form
                      messages are kept only as long as necessary to respond.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-black">
                      Changes to this policy
                    </h2>
                    <p>
                      This privacy policy may be updated occasionally. Any
                      changes will be reflected on this page.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-black">
                      Contact
                    </h2>
                    <p>
                      If you have questions about this privacy policy, you can
                      contact me via the contact form or social links on this
                      website.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-(--brand-dark)/10 blur-[120px] rounded-full" />
        </div>
      </div>
    </section>
  );
}
