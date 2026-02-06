"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
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

const TRANSITION_MS = 180;
const PRELOAD_AHEAD_SEC = 0.25;
const TAP_MAX_MOVE_PX = 14;
const TAP_MAX_DURATION_MS = 350;
const PREV_ZONE_RATIO = 0.35;
const NEXT_ZONE_RATIO = 0.65;

const StoryMockup = ({
  stories,
  userInfo,
}: {
  stories?: StoryInput[];
  userInfo?: StoryUserInfo;
}) => {
  const storyItems: Story[] = useMemo(() => {
    const fromSanity =
      stories?.map((s) => ({ src: s.url || "", type: "video" as const })) ??
      [];
    const valid = fromSanity.filter((s) => Boolean(s.src));
    return valid.length ? valid : defaultStories;
  }, [stories]);

  const count = storyItems.length || 1;
  const initialSecondIndex = count > 1 ? 1 : 0;

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const [slotIndices, setSlotIndices] = useState<[number, number]>([
    0,
    initialSecondIndex,
  ]);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [targetSlot, setTargetSlot] = useState<0 | 1 | null>(null);
  const [pendingVisible, setPendingVisible] = useState(false);

  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);
  const slotReadyRef = useRef<[boolean, boolean]>([false, false]);
  const preloaderVideosRef = useRef<HTMLVideoElement[]>([]);
  const progressRafRef = useRef<number | null>(null);
  const transitionTokenRef = useRef(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const tapStartRef = useRef<{
    x: number;
    y: number;
    t: number;
    pointerId: number;
  } | null>(null);

  const [isInView, setIsInView] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const activeProgress = useMotionValue(0);
  const progressWidth = useTransform(activeProgress, (v) => `${v}%`);

  const getVideoRef = useCallback(
    (slot: 0 | 1) => (slot === 0 ? videoRefA : videoRefB),
    []
  );

  const setSlotIndex = useCallback((slot: 0 | 1, index: number) => {
    setSlotIndices((prev) => {
      if (prev[slot] === index) return prev;
      const next: [number, number] = [prev[0], prev[1]];
      next[slot] = index;
      slotReadyRef.current[slot] = false;
      return next;
    });
  }, []);

  const getVideoProgress = useCallback((video: HTMLVideoElement | null) => {
    if (!video) return 0;
    if (!Number.isFinite(video.duration) || video.duration <= 0) return 0;
    const value = (video.currentTime / video.duration) * 100;
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, value));
  }, []);

  const maybeStartPendingFor = useCallback(
    (slot: 0 | 1, index: number, token: number) => {
      if (!isInView || !isPageVisible) return;
      if (pendingVisible) return;
      if (slotIndices[slot] !== index) return;
      if (transitionTokenRef.current !== token) return;

      const pendingVideo = getVideoRef(slot).current;
      if (!pendingVideo) return;

      const isReady = pendingVideo.readyState >= 2 || slotReadyRef.current[slot];
      if (!isReady) return;

      pendingVideo.play().catch((err) => {
        if (err?.name === "AbortError") return;
        if (err?.name === "NotAllowedError") return;
        if (process.env.NODE_ENV !== "production") {
          console.warn("Pending video play failed:", err);
        }
      });

      const startedAt = performance.now();
      const revealWhenMoving = () => {
        if (transitionTokenRef.current !== token) return;
        if (pendingVisible) return;
        if (pendingVideo.currentTime > 0.01) {
          setPendingVisible(true);
          return;
        }
        if (performance.now() - startedAt > 1200) {
          // Abort stale/blocked transitions instead of revealing a blank layer.
          setTargetSlot(null);
          setTargetIndex(null);
          setPendingVisible(false);
          return;
        }
        window.requestAnimationFrame(revealWhenMoving);
      };
      window.requestAnimationFrame(revealWhenMoving);
    },
    [isInView, isPageVisible, pendingVisible, slotIndices, getVideoRef]
  );

  const requestTransition = useCallback(
    (nextIndex: number) => {
      if (count <= 1) return;
      if (targetIndex !== null) return;
      if (nextIndex === activeIndex) return;

      const nextSlot = (1 - activeSlot) as 0 | 1;
      const token = transitionTokenRef.current + 1;
      transitionTokenRef.current = token;
      setTargetIndex(nextIndex);
      setTargetSlot(nextSlot);
      setPendingVisible(false);
      setSlotIndex(nextSlot, nextIndex);
      maybeStartPendingFor(nextSlot, nextIndex, token);
    },
    [
      count,
      targetIndex,
      activeIndex,
      activeSlot,
      setSlotIndex,
      maybeStartPendingFor,
    ]
  );

  const maybeStartPending = useCallback(() => {
    if (targetSlot === null || targetIndex === null) return;
    maybeStartPendingFor(targetSlot, targetIndex, transitionTokenRef.current);
  }, [targetSlot, targetIndex, maybeStartPendingFor]);

  useEffect(() => {
    if (!pendingVisible || targetSlot === null || targetIndex === null) return;

    const oldSlot = activeSlot;
    const newSlot = targetSlot;
    const newIndex = targetIndex;

    const timer = window.setTimeout(() => {
      const oldVideo = getVideoRef(oldSlot).current;
      const newVideo = getVideoRef(newSlot).current;

      if (progressRafRef.current !== null) {
        window.cancelAnimationFrame(progressRafRef.current);
        progressRafRef.current = null;
      }
      oldVideo?.pause();

      const nextProgress = getVideoProgress(newVideo);

      setActiveSlot(newSlot);
      setActiveIndex(newIndex);
      transitionTokenRef.current += 1;
      setTargetSlot(null);
      setTargetIndex(null);
      setPendingVisible(false);
      activeProgress.set(nextProgress);

      newVideo?.play().catch(() => {});
    }, TRANSITION_MS);

    return () => window.clearTimeout(timer);
  }, [
    pendingVisible,
    targetSlot,
    targetIndex,
    activeSlot,
    getVideoRef,
    getVideoProgress,
    activeProgress,
  ]);

  useEffect(() => {
    if (count <= 1) return;
    const nextIndex = (activeIndex + 1) % count;
    const inactiveSlot = (1 - activeSlot) as 0 | 1;
    setSlotIndex(inactiveSlot, nextIndex);

    const preloadVideo = getVideoRef(inactiveSlot).current;
    if (preloadVideo) {
      preloadVideo.load();
    }
  }, [count, activeIndex, activeSlot, setSlotIndex, getVideoRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setIsInView(entry.isIntersecting);
      },
      {
        // Keep story active when it's near the viewport to avoid iOS black-frame
        // decoder behavior during slight scroll.
        threshold: 0,
        rootMargin: "220px 0px 220px 0px",
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setIsPageVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const preloaders = storyItems.map((story) => {
      const v = document.createElement("video");
      v.src = story.src;
      v.preload = "auto";
      v.muted = true;
      v.playsInline = true;
      v.load();
      return v;
    });

    preloaderVideosRef.current = preloaders;

    return () => {
      preloaderVideosRef.current = [];
      preloaders.forEach((v) => {
        v.pause();
        v.removeAttribute("src");
        v.load();
      });
    };
  }, [storyItems]);

  useEffect(() => {
    if (!isInView || !isPageVisible) {
      videoRefA.current?.pause();
      videoRefB.current?.pause();
      return;
    }

    const activeVideo = getVideoRef(activeSlot).current;
    if (!activeVideo) return;

    activeVideo.play().catch((err) => {
      if (err?.name === "AbortError") return;
      if (err?.name === "NotAllowedError") return;
      if (process.env.NODE_ENV !== "production") {
        console.warn("Video play failed:", err);
      }
    });

    if (progressRafRef.current !== null) {
      window.cancelAnimationFrame(progressRafRef.current);
      progressRafRef.current = null;
    }

    const updateProgress = () => {
      const v = getVideoRef(activeSlot).current;
      if (v?.duration) {
        activeProgress.set(getVideoProgress(v));
        if (
          count > 1 &&
          targetIndex === null &&
          v.duration - v.currentTime <= PRELOAD_AHEAD_SEC
        ) {
          requestTransition((activeIndex + 1) % count);
        }
      }
      progressRafRef.current = window.requestAnimationFrame(updateProgress);
    };

    progressRafRef.current = window.requestAnimationFrame(updateProgress);
    return () => {
      if (progressRafRef.current !== null) {
        window.cancelAnimationFrame(progressRafRef.current);
        progressRafRef.current = null;
      }
    };
  }, [
    activeSlot,
    activeIndex,
    targetIndex,
    count,
    requestTransition,
    isInView,
    isPageVisible,
    activeProgress,
    getVideoRef,
    getVideoProgress,
  ]);

  const handleCanPlay = useCallback(
    (slot: 0 | 1) => {
      slotReadyRef.current[slot] = true;
      if (targetSlot === slot) {
        maybeStartPending();
      }
    },
    [targetSlot, maybeStartPending]
  );

  const handleVideoEnded = useCallback(
    (slot: 0 | 1, video: HTMLVideoElement) => {
      if (slot !== activeSlot) return;

      if (count <= 1) {
        video.play().catch(() => {});
        return;
      }

      if (targetIndex === null) {
        requestTransition((activeIndex + 1) % count);
      } else {
        maybeStartPending();
      }
    },
    [
      activeSlot,
      count,
      targetIndex,
      activeIndex,
      requestTransition,
      maybeStartPending,
    ]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    tapStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      t: performance.now(),
      pointerId: e.pointerId,
    };
  };

  const handlePointerCancel = () => {
    tapStartRef.current = null;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = tapStartRef.current;
    tapStartRef.current = null;
    if (!start) return;
    if (start.pointerId !== e.pointerId) return;

    const dx = Math.abs(e.clientX - start.x);
    const dy = Math.abs(e.clientY - start.y);
    const dt = performance.now() - start.t;

    if (dx > TAP_MAX_MOVE_PX || dy > TAP_MAX_MOVE_PX || dt > TAP_MAX_DURATION_MS) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < rect.width * PREV_ZONE_RATIO) {
      requestTransition((activeIndex - 1 + count) % count);
      return;
    }

    if (x > rect.width * NEXT_ZONE_RATIO) {
      requestTransition((activeIndex + 1) % count);
    }
  };

  const getLayerStyle = (slot: 0 | 1) => {
    const isActiveLayer = slot === activeSlot;
    const isTargetLayer = slot === targetSlot;

    let opacity = 0;
    if (isActiveLayer) opacity = pendingVisible ? 0 : 1;
    if (isTargetLayer) opacity = pendingVisible ? 1 : 0;

    return {
      opacity,
      zIndex: isTargetLayer ? 2 : isActiveLayer ? 1 : 0,
      transition: `opacity ${TRANSITION_MS}ms ease-out`,
    } as const;
  };

  const weights = useMemo(
    () => new Array(storyItems.length).fill(1),
    [storyItems.length]
  );

  return (
    <div className="relative w-[320px] sm:w-[350px]">
      <div
        ref={containerRef}
        className="relative aspect-9/16 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-black cursor-pointer group"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {([0, 1] as const).map((slot) => {
          const storyIndex = slotIndices[slot] ?? 0;
          const src = storyItems[storyIndex]?.src;
          if (!src) return null;

          return (
            <div
              key={slot}
              className="absolute inset-0 pointer-events-none"
              style={getLayerStyle(slot)}
            >
              <video
                ref={getVideoRef(slot)}
                src={src}
                className="w-full h-full object-cover"
                playsInline
                muted
                preload="auto"
                loop={count <= 1}
                onCanPlay={() => handleCanPlay(slot)}
                onLoadedData={() => {
                  slotReadyRef.current[slot] = true;
                  if (targetSlot === slot) {
                    maybeStartPending();
                  }
                }}
                onEnded={(e) => handleVideoEnded(slot, e.currentTarget)}
              />
            </div>
          );
        })}

        <div className="absolute inset-x-0 top-0 p-4 flex flex-col gap-4 bg-linear-to-b from-black/60 to-transparent z-20">
          <div className="flex gap-1.5 w-full">
            {storyItems.map((_, index) => (
              <div
                key={index}
                className="h-[2px] bg-white/30 rounded-full overflow-hidden"
                style={{ flexGrow: weights[index] ?? 1, flexBasis: 0 }}
              >
                {index === activeIndex ? (
                  <motion.div
                    key={activeIndex}
                    className="h-full bg-white"
                    style={{ width: progressWidth }}
                  />
                ) : (
                  <div
                    className="h-full bg-white"
                    style={{ width: index < activeIndex ? "100%" : "0%" }}
                  />
                )}
              </div>
            ))}
          </div>

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
