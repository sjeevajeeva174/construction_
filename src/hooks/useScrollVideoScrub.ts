"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { VIDEO_SCRUB_PPS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export const DEFAULT_PIXELS_PER_SECOND = VIDEO_SCRUB_PPS;

export type ScrubProgressPayload = {
  progress: number;
  currentTime: number;
  duration: number;
};

type UseScrollVideoScrubOptions = {
  /**
   * Scroll distance in px per second of video duration.
   * Pin end = duration * pixelsPerSecond — never a fixed +=N distance.
   */
  pixelsPerSecond?: number;
  pin?: boolean;
  pinSpacing?: boolean;
  anticipatePin?: number;
  start?: string;
  /** Eager-load immediately (hero). Others lazy-load near viewport. */
  eager?: boolean;
  onProgress?: (payload: ScrubProgressPayload) => void;
  buildTimeline?: (tl: gsap.core.Timeline) => void;
  enabled?: boolean;
  src: string;
};

function ensureVideoSrc(video: HTMLVideoElement, src: string) {
  const absolute = new URL(src, window.location.href).href;
  if (video.currentSrc !== absolute && video.getAttribute("src") !== src) {
    video.src = src;
  }
}

function clamp01(n: number) {
  return Math.min(Math.max(n, 0), 1);
}

/**
 * Scroll-driven video scrub:
 * - Wait for loadedmetadata → duration drives pin distance
 * - progress → currentTime = progress * duration (1:1, no lerp lag)
 * - Progress 1.0 → currentTime === duration, then unpin
 * - Frozen when scroll stops; reverses on scroll up; never autoplay/loop
 */
export function useScrollVideoScrub(
  sectionRef: React.RefObject<HTMLElement | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options: UseScrollVideoScrubOptions,
) {
  const {
    pixelsPerSecond = DEFAULT_PIXELS_PER_SECOND,
    pin = true,
    pinSpacing = true,
    anticipatePin = 1,
    start = "top top",
    eager = false,
    onProgress,
    buildTimeline,
    enabled = true,
    src,
  } = options;

  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [mediaReady, setMediaReady] = useState(eager);

  const durationRef = useRef(0);
  const seekingRef = useRef(false);
  const pendingTimeRef = useRef<number | null>(null);
  const lastAppliedRef = useRef(-1);
  const onProgressRef = useRef(onProgress);
  const buildTimelineRef = useRef(buildTimeline);
  const pixelsPerSecondRef = useRef(pixelsPerSecond);

  onProgressRef.current = onProgress;
  buildTimelineRef.current = buildTimeline;
  pixelsPerSecondRef.current = pixelsPerSecond;

  // Lazy-load media
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !enabled) return;

    const loadMedia = () => {
      ensureVideoSrc(video, src);
      video.preload = "auto";
      if (video.readyState < 1) video.load();
      setMediaReady(true);
    };

    if (eager) {
      loadMedia();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMedia();
        } else {
          video.preload = "none";
        }
      },
      { rootMargin: "100% 0px 100% 0px", threshold: 0 },
    );

    io.observe(section);
    return () => io.disconnect();
  }, [sectionRef, videoRef, enabled, eager, src]);

  // Never autoplay; coalesce seeks so rapid scrub stays on the latest frame
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const applyTime = (time: number) => {
      if (!Number.isFinite(time)) return;
      if (Math.abs(time - lastAppliedRef.current) < 1e-4) return;

      if (seekingRef.current) {
        pendingTimeRef.current = time;
        return;
      }

      seekingRef.current = true;
      lastAppliedRef.current = time;
      try {
        video.currentTime = time;
      } catch {
        seekingRef.current = false;
      }
    };

    const onSeeked = () => {
      seekingRef.current = false;
      const pending = pendingTimeRef.current;
      if (pending !== null) {
        pendingTimeRef.current = null;
        applyTime(pending);
      }
    };

    const blockPlay = () => {
      video.pause();
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("play", blockPlay);

    (
      video as HTMLVideoElement & { __scrubApply?: (t: number) => void }
    ).__scrubApply = applyTime;

    return () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("play", blockPlay);
      delete (video as HTMLVideoElement & { __scrubApply?: (t: number) => void })
        .__scrubApply;
    };
  }, [videoRef]);

  // ScrollTrigger: created only after loadedmetadata; rebuilt on resize
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !enabled || !mediaReady) return;

    let tl: gsap.core.Timeline | null = null;
    let cancelled = false;
    let resizeTimer = 0;

    const teardown = () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      tl = null;
      section.classList.remove("is-scrubbing");
    };

    const scrollDistance = () => {
      const d = durationRef.current;
      const pps = pixelsPerSecondRef.current;
      return Math.max(1, Math.round(d * pps));
    };

    const applyProgress = (progress: number) => {
      const duration = durationRef.current;
      if (!duration) return;

      const p = clamp01(progress);
      // At exactly 1.0, land on the true last frame — no hidden remainder
      const time = p >= 1 ? duration : p * duration;

      if (!video.paused) video.pause();

      (
        video as HTMLVideoElement & { __scrubApply?: (t: number) => void }
      ).__scrubApply?.(time);

      onProgressRef.current?.({
        progress: p,
        currentTime: time,
        duration,
      });
    };

    const createTrigger = (preserveProgress = false) => {
      if (cancelled) return;

      const duration = video.duration;
      if (!duration || !Number.isFinite(duration) || duration < 0.05) return;

      const priorProgress = preserveProgress
        ? clamp01(tl?.scrollTrigger?.progress ?? 0)
        : 0;

      durationRef.current = duration;
      video.pause();
      video.loop = false;

      if (!preserveProgress) {
        try {
          video.currentTime = 0;
        } catch {
          /* ignore */
        }
        lastAppliedRef.current = 0;
        seekingRef.current = false;
        pendingTimeRef.current = null;
      }

      setReady(true);

      teardown();
      if (reduced) return;

      tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start,
          // Duration alone determines pin length — never a fixed +=2000 / +=3000
          end: () => `+=${scrollDistance()}`,
          scrub: true,
          pin,
          pinSpacing,
          anticipatePin,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          preventOverlaps: true,
          onToggle: (self) => {
            if (self.isActive) {
              video.preload = "auto";
              section.classList.add("is-scrubbing");
            } else {
              section.classList.remove("is-scrubbing");
              if (!eager) video.preload = "none";
              // Snap to exact end/start frame when pin releases
              applyProgress(self.progress);
            }
          },
          onUpdate: (self) => {
            applyProgress(self.progress);
          },
        },
      });

      tl.to({}, { duration: 1 }, 0);
      buildTimelineRef.current?.(tl);

      if (preserveProgress && priorProgress > 0) {
        applyProgress(priorProgress);
      }

      requestAnimationFrame(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    };

    const onLoadedMeta = () => {
      createTrigger();
    };

    if (video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
      createTrigger();
    } else {
      video.addEventListener("loadedmetadata", onLoadedMeta);
      ensureVideoSrc(video, src);
      video.preload = "auto";
      video.load();
    }

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (cancelled) return;
        // Destroy + recreate so end distance re-binds to current duration
        if (
          video.readyState >= 1 &&
          Number.isFinite(video.duration) &&
          video.duration > 0
        ) {
          createTrigger(true);
        }
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", onLoadedMeta);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.clearTimeout(resizeTimer);
      teardown();
    };
  }, [
    sectionRef,
    videoRef,
    enabled,
    reduced,
    mediaReady,
    pixelsPerSecond,
    start,
    pin,
    pinSpacing,
    anticipatePin,
    eager,
    src,
  ]);

  return { ready, reduced, mediaReady };
}
