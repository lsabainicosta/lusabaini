"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Maximize2,
  Pause,
  Play,
  Sparkles,
  VideoIcon,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import type { RelatedContentItem } from "@/lib/queries";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  description?: string;
  items?: RelatedContentItem[];
};

type FilterId = "all" | "video" | "image" | "text";

type DisplayItem = {
  _key?: string;
  kind: "video" | "image" | "text";
  data: RelatedContentItem;
};

type MediaDisplayItem = {
  _key?: string;
  kind: "video" | "image";
  data: RelatedContentItem;
};

const filters: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "video", label: "Videos" },
  { id: "image", label: "Photos" },
  { id: "text", label: "Notes" },
];

function toDisplayItem(item: RelatedContentItem): DisplayItem | null {
  if (item._type === "relatedTextItem") {
    const hasText = Boolean(
      item.title?.trim() || item.body?.trim() || item.eyebrow?.trim()
    );
    if (!hasText) return null;
    return { _key: item._key, kind: "text", data: item };
  }

  const isVideo = item.mediaType === "video" || Boolean(item.video?.url);
  if (isVideo) {
    if (!item.video?.url) return null;
    return { _key: item._key, kind: "video", data: item };
  }

  if (!item.image?.url) return null;
  return { _key: item._key, kind: "image", data: item };
}

function getMediaRatio(item: DisplayItem): number | null {
  if (item.kind === "text" || item.data._type !== "relatedMediaItem") return null;

  const width =
    item.kind === "video" ? item.data.video?.width : item.data.image?.width;
  const height =
    item.kind === "video" ? item.data.video?.height : item.data.image?.height;

  if (!width || !height || width <= 0 || height <= 0) return null;
  return width / height;
}

// Keep each asset's natural shape, but clamp extremes so one card doesn't break layout.
function getClampedMediaRatio(ratio: number | null) {
  if (ratio === null) return null;
  return Math.min(1.8, Math.max(0.62, ratio));
}

function formatVideoTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

type CustomVideoPlayerProps = {
  src: string;
  poster?: string;
  fit?: "cover" | "contain";
  autoPlay?: boolean;
  className?: string;
  onRequestExpand?: () => void;
  mode?: "aspect" | "fill";
};

function CustomVideoPlayer({
  src,
  poster,
  fit = "cover",
  autoPlay = false,
  className,
  onRequestExpand,
  mode = "aspect",
}: CustomVideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const didPrimePreviewRef = React.useRef(false);
  const isPrimingPreviewRef = React.useRef(false);
  const previewSeekTargetRef = React.useRef(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const videoSrc = React.useMemo(() => {
    if (!src) return src;
    if (poster || autoPlay) return src;
    return src.includes("#") ? src : `${src}#t=0.5`;
  }, [autoPlay, poster, src]);

  const syncPlaybackMetrics = React.useCallback((video: HTMLVideoElement) => {
    const finiteDuration =
      Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
    const seekableDuration =
      video.seekable.length > 0
        ? video.seekable.end(video.seekable.length - 1)
        : 0;
    const resolvedDuration = Math.max(finiteDuration, seekableDuration, 0);

    setDuration(resolvedDuration);
    setCurrentTime(video.currentTime || 0);
  }, []);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    const onLoadedMetadata = () => {
      syncPlaybackMetrics(video);

      if (poster || autoPlay || didPrimePreviewRef.current) return;
      const metaDuration =
        Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
      const target = metaDuration > 0 ? Math.min(0.5, Math.max(0.1, metaDuration / 4)) : 0.5;
      previewSeekTargetRef.current = target;
      isPrimingPreviewRef.current = true;
      try {
        video.currentTime = target;
      } catch {
        isPrimingPreviewRef.current = false;
      }
    };
    const onLoadedData = () => {
      syncPlaybackMetrics(video);
    };
    const onDurationChange = () => syncPlaybackMetrics(video);
    const onProgress = () => syncPlaybackMetrics(video);
    const onSeeked = () => {
      if (!isPrimingPreviewRef.current) return;
      didPrimePreviewRef.current = true;
      isPrimingPreviewRef.current = false;
      video.pause();
      setIsPlaying(false);
      setCurrentTime(video.currentTime || previewSeekTargetRef.current || 0);
    };
    const onTimeUpdate = () => setCurrentTime(video.currentTime || 0);
    const onPlay = () => {
      if (!isPrimingPreviewRef.current) setIsPlaying(true);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("progress", onProgress);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    syncPlaybackMetrics(video);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [autoPlay, isMuted, mode, poster, syncPlaybackMetrics]);

  const togglePlayback = React.useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (
      !poster &&
      didPrimePreviewRef.current &&
      video.paused &&
      video.currentTime <= 0.6
    ) {
      video.currentTime = 0;
      setCurrentTime(0);
    }

    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }, [poster]);

  const toggleMute = React.useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const handleSeek = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const video = videoRef.current;
      if (!video) return;
      const nextTime = Number(event.target.value);
      video.currentTime = nextTime;
      setCurrentTime(nextTime);
    },
    []
  );

  const scrubMax = React.useMemo(
    () => (duration > 0 ? duration : Math.max(currentTime, 1)),
    [duration, currentTime]
  );
  const scrubValue = Math.min(currentTime, scrubMax);

  return (
    <div
      className={cn(
        "group/player relative w-full overflow-hidden bg-black",
        mode === "fill" ? "h-full" : "",
        className
      )}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        poster={poster}
        autoPlay={autoPlay}
        playsInline
        preload="auto"
        muted={isMuted}
        onClick={togglePlayback}
        disablePictureInPicture
        controls={false}
        className={cn(
          "absolute inset-0 h-full w-full bg-black",
          fit === "contain" ? "object-contain" : "object-cover"
        )}
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-90 transition-opacity group-hover/player:opacity-100" />

      {onRequestExpand ? (
        <button
          type="button"
          onClick={onRequestExpand}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white transition-colors hover:bg-black/75"
          aria-label="Open video in fullscreen view"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      ) : null}

      <div
        className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 px-2.5 pt-2.5 sm:gap-3 sm:px-3 sm:pt-3"
        style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={togglePlayback}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition-colors hover:bg-black/75"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        <div className="min-w-0 flex flex-1 items-center gap-2 sm:gap-3">
          <input
            type="range"
            min={0}
            max={scrubMax}
            step={0.1}
            value={scrubValue}
            onChange={handleSeek}
            className="h-1 w-full cursor-pointer accent-white"
            aria-label="Seek video"
          />

          <div className="min-w-[76px] whitespace-nowrap text-right text-xs leading-none font-medium tabular-nums text-white/90">
            {formatVideoTime(currentTime)} / {formatVideoTime(duration || scrubMax)}
          </div>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition-colors hover:bg-black/75"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export default function RelatedContentGallery({
  title = "Related Content",
  description,
  items,
}: Props) {
  const allItems = React.useMemo(
    () => (items ?? []).map(toDisplayItem).filter(Boolean) as DisplayItem[],
    [items]
  );
  const [activeFilter, setActiveFilter] = React.useState<FilterId>("all");

  const counts = React.useMemo(
    () => ({
      all: allItems.length,
      video: allItems.filter((item) => item.kind === "video").length,
      image: allItems.filter((item) => item.kind === "image").length,
      text: allItems.filter((item) => item.kind === "text").length,
    }),
    [allItems]
  );

  const filteredItems = React.useMemo(() => {
    if (activeFilter === "all") return allItems;
    return allItems.filter((item) => item.kind === activeFilter);
  }, [activeFilter, allItems]);
  const isSingleItemView = filteredItems.length === 1;
  const [columnCount, setColumnCount] = React.useState(1);
  const activeColumnCount = React.useMemo(
    () => Math.max(1, Math.min(columnCount, filteredItems.length || 1)),
    [columnCount, filteredItems.length]
  );
  const mediaItems = React.useMemo(
    () => filteredItems.filter((item) => item.kind !== "text") as MediaDisplayItem[],
    [filteredItems]
  );
  const [activeMediaIndex, setActiveMediaIndex] = React.useState<number | null>(null);
  const touchStartXRef = React.useRef<number | null>(null);
  const touchStartYRef = React.useRef<number | null>(null);
  const touchEndXRef = React.useRef<number | null>(null);
  const touchEndYRef = React.useRef<number | null>(null);
  const activeMediaItem =
    activeMediaIndex !== null && mediaItems[activeMediaIndex]
      ? mediaItems[activeMediaIndex]
      : null;

  const mediaIndexByKey = React.useMemo(() => {
    const mapping = new Map<string, number>();
    let mediaIndex = 0;
    filteredItems.forEach((item, index) => {
      if (item.kind === "text") return;
      const key = item._key || `${item.kind}-${index}`;
      mapping.set(key, mediaIndex);
      mediaIndex += 1;
    });
    return mapping;
  }, [filteredItems]);

  const showPrevious = React.useCallback(() => {
    setActiveMediaIndex((prev) => {
      if (prev === null) return prev;
      return prev > 0 ? prev - 1 : prev;
    });
  }, []);

  const showNext = React.useCallback(() => {
    setActiveMediaIndex((prev) => {
      if (prev === null) return prev;
      return prev < mediaItems.length - 1 ? prev + 1 : prev;
    });
  }, [mediaItems.length]);

  const handleTouchStart = React.useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, input, a")) {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      touchEndXRef.current = null;
      touchEndYRef.current = null;
      return;
    }

    const touch = event.changedTouches[0];
    touchStartXRef.current = touch?.clientX ?? null;
    touchStartYRef.current = touch?.clientY ?? null;
    touchEndXRef.current = null;
    touchEndYRef.current = null;
  }, []);

  const handleTouchMove = React.useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    touchEndXRef.current = touch?.clientX ?? null;
    touchEndYRef.current = touch?.clientY ?? null;
  }, []);

  const handleTouchEnd = React.useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const startX = touchStartXRef.current;
      const startY = touchStartYRef.current;
      const endX = touchEndXRef.current ?? event.changedTouches[0]?.clientX ?? null;
      const endY = touchEndYRef.current ?? event.changedTouches[0]?.clientY ?? null;
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      touchEndXRef.current = null;
      touchEndYRef.current = null;
      if (
        startX === null ||
        startY === null ||
        typeof endX !== "number" ||
        typeof endY !== "number"
      ) {
        return;
      }

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const swipeThreshold = 36;
      const isHorizontalSwipe =
        Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
      if (!isHorizontalSwipe) return;

      if (deltaX < 0) {
        showNext();
      } else {
        showPrevious();
      }
    },
    [showNext, showPrevious]
  );

  React.useEffect(() => {
    if (activeMediaIndex === null) return;
    const scrollY = window.scrollY;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    const previousBodyTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.touchAction = "none";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMediaIndex(null);
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      document.body.style.touchAction = previousBodyTouchAction;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMediaIndex, showNext, showPrevious]);

  React.useEffect(() => {
    if (activeMediaIndex === null) return;
    if (activeMediaIndex > mediaItems.length - 1) {
      setActiveMediaIndex(mediaItems.length > 0 ? mediaItems.length - 1 : null);
    }
  }, [activeMediaIndex, mediaItems.length]);

  React.useEffect(() => {
    const getColumns = (width: number) => {
      if (width >= 1280) return 3;
      if (width >= 640) return 2;
      return 1;
    };

    const updateColumns = () => setColumnCount(getColumns(window.innerWidth));
    updateColumns();

    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const masonryColumns = React.useMemo(() => {
    const columns = Array.from({ length: activeColumnCount }, () => [] as Array<{
      item: DisplayItem;
      index: number;
      key: string;
    }>);
    const columnHeights = Array.from({ length: activeColumnCount }, () => 0);

    const getEstimatedUnits = (item: DisplayItem) => {
      if (item.kind === "text") return 1.1;
      const ratio = getClampedMediaRatio(getMediaRatio(item));
      const safeRatio = ratio ?? (item.kind === "video" ? 0.62 : 0.8);
      // With fixed column width, height is inverse of aspect-ratio.
      return 1 / safeRatio;
    };

    filteredItems.forEach((item, index) => {
      const key = item._key || `${item.kind}-${index}`;
      const nextColumn = columnHeights.indexOf(Math.min(...columnHeights));
      columns[nextColumn].push({ item, index, key });
      columnHeights[nextColumn] += getEstimatedUnits(item);
    });

    return columns;
  }, [filteredItems, activeColumnCount]);

  if (!allItems.length && !description?.trim()) return null;

  return (
    <section className="w-full pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative">
          <div className="pointer-events-none absolute -top-8 right-8 h-28 w-28 rounded-full bg-white/55 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-4 left-4 h-20 w-20 rounded-full bg-white/40 blur-xl" />

          <div className="relative rounded-[1.5rem] border border-black/10 bg-white/55 px-5 py-5 sm:px-6 sm:py-6 shadow-[0_20px_60px_-42px_rgba(0,0,0,0.45)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-2">
                <h2 className="text-3xl md:text-4xl font-medium tracking-[-0.04em] text-black">
                  {title}
                </h2>
                {description?.trim() ? (
                  <p className="text-base md:text-lg text-black/60 leading-relaxed">
                    {description}
                  </p>
                ) : null}
              </div>

              {allItems.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {filters
                    .filter((filter) => counts[filter.id] > 0 || filter.id === "all")
                    .map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setActiveFilter(filter.id)}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                          activeFilter === filter.id
                            ? "border-black bg-black text-white"
                            : "border-black/15 bg-white/80 text-black/75 hover:bg-white"
                        )}
                      >
                        {filter.id === "video" ? (
                          <VideoIcon className="h-3.5 w-3.5" />
                        ) : null}
                        {filter.id === "image" ? (
                          <ImageIcon className="h-3.5 w-3.5" />
                        ) : null}
                        {filter.id === "text" ? (
                          <Sparkles className="h-3.5 w-3.5" />
                        ) : null}
                        <span>{filter.label}</span>
                        <span className="text-[11px] opacity-70">
                          {counts[filter.id]}
                        </span>
                      </button>
                    ))}
                </div>
              ) : null}
            </div>
          </div>

            {allItems.length > 0 ? (
              filteredItems.length > 0 ? (
                <div
                  className={cn(
                    "mt-5 grid gap-5 items-start",
                    isSingleItemView ? "grid-cols-1 justify-items-center" : ""
                  )}
                  style={{
                    gridTemplateColumns: `repeat(${activeColumnCount}, minmax(0, 1fr))`,
                  }}
                >
                  {masonryColumns.map((column, columnIndex) => (
                    <div key={`column-${columnIndex}`} className="flex flex-col gap-5">
                      {column.map(({ item, index, key }) => {
                        const mediaIndex = mediaIndexByKey.get(key);
                        const mediaRatio = getMediaRatio(item);
                        const clampedMediaRatio = getClampedMediaRatio(mediaRatio);
                        const mediaStyle = clampedMediaRatio
                          ? { aspectRatio: clampedMediaRatio }
                          : undefined;
                        const fallbackAspectClass =
                          item.kind === "video" ? "aspect-[9/16]" : "aspect-[4/5]";

                        if (item.kind === "text" && item.data._type === "relatedTextItem") {
                          return (
                            <motion.article
                              key={key}
                              initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                              viewport={{ once: true, amount: 0.2 }}
                              transition={{ duration: 0.55, delay: index * 0.04 }}
                              className={cn(
                                "w-full rounded-[1.5rem] border border-black/10 bg-white/80 p-6 sm:p-7 shadow-[0_16px_50px_-35px_rgba(0,0,0,0.55)]",
                                isSingleItemView ? "mx-auto max-w-[56rem]" : ""
                              )}
                            >
                              <div className="h-full flex flex-col gap-4 justify-between">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black/55">
                                  <Sparkles className="h-3.5 w-3.5" />
                                  {item.data.eyebrow?.trim() || "Context"}
                                </div>
                                {item.data.title?.trim() ? (
                                  <h3 className="text-2xl font-medium tracking-[-0.03em] text-black">
                                    {item.data.title}
                                  </h3>
                                ) : null}
                                {item.data.body?.trim() ? (
                                  <p className="text-base leading-relaxed text-black/70">
                                    {item.data.body}
                                  </p>
                                ) : null}
                              </div>
                            </motion.article>
                          );
                        }

                        if (item.data._type !== "relatedMediaItem") return null;

                        if (item.kind === "video") {
                          return (
                            <motion.article
                              key={key}
                              initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                              viewport={{ once: true, amount: 0.2 }}
                              transition={{ duration: 0.55, delay: index * 0.04 }}
                              className={cn(
                                "w-full overflow-hidden rounded-[2.5rem] border-4 border-white bg-black/70 shadow-2xl",
                                isSingleItemView ? "mx-auto max-w-[46rem]" : ""
                              )}
                            >
                              <div
                                className={cn(
                                  "relative bg-black",
                                  clampedMediaRatio ? "" : fallbackAspectClass
                                )}
                                style={mediaStyle}
                              >
                                <CustomVideoPlayer
                                  src={item.data.video?.url || ""}
                                  poster={
                                    item.data.video?.posterUrl ||
                                    item.data.image?.url ||
                                    undefined
                                  }
                                  fit="cover"
                                  mode="fill"
                                  onRequestExpand={() => {
                                    if (typeof mediaIndex === "number") {
                                      setActiveMediaIndex(mediaIndex);
                                    }
                                  }}
                                />
                              </div>
                              {(item.data.title?.trim() ||
                                item.data.caption?.trim() ||
                                item.data.description?.trim()) && (
                                <div className="space-y-1 p-4 sm:p-5 text-white">
                                  {item.data.title?.trim() ? (
                                    <h3 className="text-lg font-medium tracking-tight">
                                      {item.data.title}
                                    </h3>
                                  ) : null}
                                  {item.data.caption?.trim() ? (
                                    <p className="text-sm text-white/85">
                                      {item.data.caption}
                                    </p>
                                  ) : null}
                                  {item.data.description?.trim() ? (
                                    <p className="text-sm text-white/70 leading-relaxed">
                                      {item.data.description}
                                    </p>
                                  ) : null}
                                </div>
                              )}
                            </motion.article>
                          );
                        }

                        return (
                          <motion.article
                            key={key}
                            initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.55, delay: index * 0.04 }}
                            className={cn(
                              "w-full group overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-2xl",
                              isSingleItemView ? "mx-auto max-w-[46rem]" : ""
                            )}
                          >
                            <div
                              className={cn(
                                "relative",
                                clampedMediaRatio ? "" : fallbackAspectClass
                              )}
                              style={mediaStyle}
                            >
                              <Image
                                src={item.data.image?.url || ""}
                                alt={
                                  item.data.image?.alt ||
                                  item.data.title ||
                                  item.data.caption ||
                                  "Related content image"
                                }
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                sizes="(min-width: 1280px) 560px, (min-width: 768px) 44vw, 92vw"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (typeof mediaIndex === "number") {
                                    setActiveMediaIndex(mediaIndex);
                                  }
                                }}
                                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white transition-colors hover:bg-black/75"
                                aria-label="Open image in fullscreen view"
                              >
                                <Maximize2 className="h-4 w-4" />
                              </button>
                              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 to-transparent" />
                              {(item.data.title?.trim() ||
                                item.data.caption?.trim() ||
                                item.data.description?.trim()) && (
                                <div className="absolute inset-x-0 bottom-0 space-y-1 p-4 sm:p-5 text-white">
                                  {item.data.title?.trim() ? (
                                    <h3 className="text-lg font-medium tracking-tight">
                                      {item.data.title}
                                    </h3>
                                  ) : null}
                                  {item.data.caption?.trim() ? (
                                    <p className="text-sm text-white/90">
                                      {item.data.caption}
                                    </p>
                                  ) : null}
                                  {item.data.description?.trim() ? (
                                    <p className="text-sm text-white/75 leading-relaxed">
                                      {item.data.description}
                                    </p>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </motion.article>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-black/10 bg-white/60 px-5 py-4 text-black/65">
                  No items in this category yet.
                </div>
              )
            ) : null}
        </div>
      </div>

      {activeMediaItem && activeMediaItem.data._type === "relatedMediaItem" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={
            activeMediaItem.data.title ||
            activeMediaItem.data.caption ||
            "Fullscreen media"
          }
        >
          <button
            type="button"
            onClick={() => setActiveMediaIndex(null)}
            className="absolute z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition-colors hover:bg-black/80"
            style={{
              top: "max(0.75rem, env(safe-area-inset-top))",
              right: "max(0.75rem, env(safe-area-inset-right))",
            }}
            aria-label="Close fullscreen media"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 h-full w-full max-w-[1100px] max-h-[90vh] rounded-2xl border border-white/15 bg-black p-2 sm:p-3"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={showPrevious}
              disabled={activeMediaIndex === 0}
              className="absolute left-3 top-1/2 z-40 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white transition-colors enabled:hover:bg-black/75 disabled:opacity-35 disabled:cursor-not-allowed"
              aria-label="Previous media"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={showNext}
              disabled={activeMediaIndex === mediaItems.length - 1}
              className="absolute right-3 top-1/2 z-40 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white transition-colors enabled:hover:bg-black/75 disabled:opacity-35 disabled:cursor-not-allowed"
              aria-label="Next media"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {activeMediaItem.kind === "video" ? (
              <CustomVideoPlayer
                src={activeMediaItem.data.video?.url || ""}
                poster={
                  activeMediaItem.data.video?.posterUrl ||
                  activeMediaItem.data.image?.url ||
                  undefined
                }
                fit="contain"
                autoPlay
                className="rounded-xl"
                mode="fill"
              />
            ) : null}

            {activeMediaItem.kind === "image" ? (
              <div className="relative h-full w-full rounded-xl overflow-hidden bg-black">
                <Image
                  src={activeMediaItem.data.image?.url || ""}
                  alt={
                    activeMediaItem.data.image?.alt ||
                    activeMediaItem.data.title ||
                    activeMediaItem.data.caption ||
                    "Related content image"
                  }
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}
