import Image from "next/image";
import TransitionLink from "@/components/motion/TransitionLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import lulu from "@/assets/lulu.webp";

export default function NotFound() {
  return (
    <section className="w-full pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Copy */}
          <div className="flex flex-col items-start gap-8">
            <Badge className="px-4 py-1 bg-black/5 rounded-lg text-xs font-semibold uppercase tracking-wider text-black/60 border-transparent">
              404 — Not found
            </Badge>

            <div className="flex flex-col gap-4">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-medium tracking-[-0.04em] leading-[0.9] text-black">
                This page went{" "}
                <span className="italic font-serif">missing</span>.
              </h1>
              <p className="text-xl text-black/60 max-w-xl font-sans leading-relaxed">
                The link might be broken, or the page may have been moved. Let’s
                get you back to something good.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                asChild
                className="rounded-full bg-black text-white px-8 py-4 h-auto text-lg font-medium hover:bg-black/90 transition-all border-none"
              >
                <TransitionLink href="/">Back home</TransitionLink>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-8 py-4 h-auto text-lg font-medium border-black/15 shadow-none hover:bg-black/5"
              >
                <TransitionLink href="/my-work">See my work</TransitionLink>
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="glass-card rounded-[2.5rem] p-4 sm:p-6 border border-black/10">
              <div className="relative overflow-hidden rounded-[2rem] aspect-16/10 bg-black/5">
                <div className="absolute inset-0 bg-linear-to-br from-black/5 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border border-black/10 bg-white/60">
                      <Image
                        src={lulu}
                        alt="Luiza Sabaini Costa"
                        className="object-cover"
                        width={96}
                        height={96}
                        priority={false}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-medium tracking-[-0.06em] text-black">
                        404
                      </div>
                      <div className="text-sm text-black/50 font-sans">
                        Lost, but still looking good.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-(--brand-dark)/10 blur-[120px] rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
