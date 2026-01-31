"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { motion, useMotionValue, useTransform } from "motion/react";

type StoryInput = {
  url?: string;
  title?: string;
};

type Story = { src: string; type: "video" };

type StoryUserInfo = {
  username?: string;
  timeAgo?: string;
  profileImage?: {
    url?: string;
    alt?: string;
  };
};

const defaultStories: Story[] = [
  { src: "/videos/vid1.mp4", type: "video" },
  { src: "/videos/vid2.mp4", type: "video" },
  { src: "/videos/vid3.mp4", type: "video" },
];

const StoryMockup = ({ 
  stories,
  userInfo 
}: { 
  stories?: StoryInput[];
  userInfo?: StoryUserInfo;
}) => {
  const storyItems: Story[] = useMemo(() => {
    const fromSanity =
      stories?.map((s) => ({ src: s.url || "", type: "video" as const })) ?? [];
    const valid = fromSanity.filter((s) => Boolean(s.src));
    return valid.length ? valid : defaultStories;
  }, [stories]);

  // We keep the "active" story visible until the next story has loaded its first frame,
  // then crossfade. This avoids the 1-frame black flash that can happen on src swaps.
  const [activeIndex, setActiveIndex] = useState(0);
  // UI state (progress bars) should only advance once the new video is truly ready/visible.
  const [committedIndex, setCommittedIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [pendingReady, setPendingReady] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);

  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const pendingVideoRef = useRef<HTMLVideoElement | null>(null);
  const count = storyItems.length || 1;
  const safeActiveIndex = activeIndex % count;

  // Use motion values for ultra-smooth updates outside of React's render cycle
  const activeProgress = useMotionValue(0);
  const progressWidth = useTransform(activeProgress, (v) => `${v}%`);

  const requestTransition = (nextIndex: number) => {
    if (count <= 1) return;
    // Avoid stacking transitions if the user taps quickly.
    if (pendingIndex !== null) return;
    if (isPromoting) return;
    if (nextIndex === safeActiveIndex) return;
    setPendingReady(false);
    setPendingIndex(nextIndex);
    // Update UI immediately on interaction: jump progress bar to the target segment and start from 0.
    setCommittedIndex(nextIndex);
    activeProgress.set(0);
  };

  const handleNext = () => requestTransition((safeActiveIndex + 1) % count);
  const handlePrev = () =>
    requestTransition((safeActiveIndex - 1 + count) % count);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () =>
      setIsPageVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Keep progress bar segments stable (equal widths) to avoid reflow/jitter as metadata loads.
  const weights = useMemo(
    () => new Array(storyItems.length).fill(1),
    [storyItems.length]
  );

  useEffect(() => {
    let rafId: number;
    const getProgressVideo = () =>
      pendingIndex !== null ? pendingVideoRef.current : activeVideoRef.current;
    const currentVideo = getProgressVideo();

    if (!currentVideo) return;

    // If the phone mockup is off-screen or the tab is hidden, don't fight the browser.
    if (!isInView || !isPageVisible) {
      activeVideoRef.current?.pause();
      pendingVideoRef.current?.pause();
      activeProgress.set(0);
      return;
    }

    const updateProgress = () => {
      const v = getProgressVideo();
      if (v?.duration) {
        const current = (v.currentTime / v.duration) * 100;
        // This updates the motion value at 60+ FPS
        activeProgress.set(current);
      }
      rafId = requestAnimationFrame(updateProgress);
    };

    // Reset and play
    currentVideo.play().catch((err) => {
      // Browsers may pause/abort background video to save power; that's expected.
      if (err?.name === "AbortError") return;
      if (err?.name === "NotAllowedError") return;
      // Keep other unexpected errors visible during development.
      if (process.env.NODE_ENV !== "production") {
        console.warn("Video play failed:", err);
      }
    });

    // Start animation loop
    rafId = requestAnimationFrame(updateProgress);

    return () => {
      currentVideo.pause();
      cancelAnimationFrame(rafId);
    };
  }, [safeActiveIndex, pendingIndex, activeProgress, isInView, isPageVisible]);

  // Start preloading/playing the pending video (muted) so it can render its first frame.
  useEffect(() => {
    if (pendingIndex === null) return;
    const pendingVideo = pendingVideoRef.current;
    if (!pendingVideo) return;

    if (!isInView || !isPageVisible) return;

    pendingVideo.currentTime = 0;
    pendingVideo.play().catch((err) => {
      if (err?.name === "AbortError") return;
      if (err?.name === "NotAllowedError") return;
      if (process.env.NODE_ENV !== "production") {
        console.warn("Pending video play failed:", err);
      }
    });
  }, [pendingIndex, isInView, isPageVisible]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.3) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  return (
    <div className="relative w-[350px]">
      {/* CLIPPED STORY FRAME */}
      <div
        ref={containerRef}
        className="relative aspect-9/16 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-black cursor-pointer group"
        onClick={handleTap}
      >
        {/* Active video layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video
            ref={activeVideoRef}
            key={storyItems[safeActiveIndex]?.src}
            src={storyItems[safeActiveIndex]?.src}
            className="w-full h-full object-cover"
            playsInline
            muted
            loop={count <= 1}
            preload="auto"
            onLoadedData={(e) => {
              if (!isPromoting || pendingIndex === null) return;
              const pendingVideo = pendingVideoRef.current;
              if (pendingVideo) {
                e.currentTarget.currentTime = pendingVideo.currentTime;
              }
              e.currentTarget.play().catch(() => {});
              pendingVideoRef.current?.pause();
              setPendingIndex(null);
              setPendingReady(false);
              setIsPromoting(false);
            }}
            onEnded={(e) => {
              if (count <= 1) {
                // Keep a single story replaying forever.
                e.currentTarget.currentTime = 0;
                e.currentTarget.play().catch(() => {});
                return;
              }
              requestTransition((safeActiveIndex + 1) % count);
            }}
          />
        </div>

        {/* Pending video layer */}
        {pendingIndex !== null && (
          <motion.div
            className="absolute inset-0 z-1 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: pendingReady ? 1 : 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            onAnimationComplete={() => {
              if (!pendingReady || pendingIndex === null) return;
              setIsPromoting(true);
              setActiveIndex(pendingIndex);
            }}
          >
            <video
              ref={pendingVideoRef}
              key={storyItems[pendingIndex]?.src}
              src={storyItems[pendingIndex]?.src}
              className="w-full h-full object-cover"
              playsInline
              muted
              preload="auto"
              onLoadedData={() => setPendingReady(true)}
            />
          </motion.div>
        )}

        {/* Top UI */}
        <div className="absolute inset-x-0 top-0 p-4 flex flex-col gap-4 bg-linear-to-b from-black/60 to-transparent z-20">
          {/* Progress bars */}
          <div className="flex gap-1.5 w-full">
            {storyItems.map((_, index) => (
              <div
                key={index}
                className="h-[2px] bg-white/30 rounded-full overflow-hidden"
                style={{ flexGrow: weights[index] ?? 1, flexBasis: 0 }}
              >
                {index === committedIndex ? (
                  <motion.div
                    key={committedIndex}
                    className="h-full bg-white"
                    style={{ width: progressWidth }}
                  />
                ) : (
                  <div
                    className="h-full bg-white"
                    style={{ width: index < committedIndex ? "100%" : "0%" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* User info */}
          {(userInfo?.username || userInfo?.profileImage?.url) && (
            <div className="flex items-center gap-3">
              {userInfo.profileImage?.url && (
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full border-2 border-black bg-white overflow-hidden relative">
                    <Image
                      src={userInfo.profileImage.url}
                      alt={userInfo.profileImage.alt || userInfo.username || "Profile"}
                      fill
                      className="object-cover"
                      sizes="32px"
                      priority={false}
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                {userInfo.username && (
                  <span className="text-white text-sm font-semibold">
                    {userInfo.username}
                  </span>
                )}
                {userInfo.timeAgo && (
                  <span className="text-white/60 text-xs">{userInfo.timeAgo}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/40 to-transparent z-10 pointer-events-none" />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 z-30 pointer-events-none">
        <div className="p-4 bg-black rounded-2xl shadow-xl">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
      </div>
    </div>
  );
};

export default StoryMockup;
