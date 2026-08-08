"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export type ScrubProgressPayload = {
  progress: number;
  currentTime: number;
  duration: number;
};

type UseScrollVideoScrubOptions = {
  /**
   * Scroll distance in px per second of video duration.
   * Pin end = duration * pixelsPerSecond — no extra blank scroll.
   */
  pixelsPerSecond?: number;
  pin?: boolean;
  pinSpacing?: boolean;
  anticipatePin?: number;
  start?: string;
  /** Eager-load immediately (hero). Others lazy-load near viewport. */
  eager?: boolean;
  /**
   * Lerp responsiveness (higher = snappier). Frame-rate independent via exp decay.
   * ~14 feels cinematic; ~22 tracks scroll more tightly.
   */
  lerpLambda?: number;
  /** Min |Δt| (seconds) before issuing a seek — skips sub-frame work. */
  seekEpsilon?: number;
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

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

/**
 * Scroll-driven cinematic scrub optimized for 60fps:
 * - ScrollTrigger scrub maps progress → target time (cheap, no DOM)
 * - RAF lerps displayed time toward target
 * - Seeks only when delta is meaningful and prior seek finished
 * - No layout reads inside the hot path
 */
export function useScrollVideoScrub(
  sectionRef: React.RefObject<HTMLElement | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  options: UseScrollVideoScrubOptions,
) {
  const {
    pixelsPerSecond = 280,
    pin = true,
    pinSpacing = true,
    anticipatePin = 1,
    start = "top top",
    eager = false,
    lerpLambda = 16,
    seekEpsilon = 1 / 45,
    onProgress,
    buildTimeline,
    enabled = true,
    src,
  } = options;

  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [mediaReady, setMediaReady] = useState(eager);

  // Hot-path refs — never trigger React renders from the RAF loop
  const targetTime = useRef(0);
  const smoothTime = useRef(0);
  const lastApplied = useRef(-1);
  const durationRef = useRef(0);
  const progressRef = useRef(0);
  const seeking = useRef(false);
  const pendingSeek = useRef(false);
  const rafId = useRef(0);
  const lastFrameTs = useRef(0);
  const isActive = useRef(false);
  const running = useRef(false);
  const onProgressRef = useRef(onProgress);
  const buildTimelineRef = useRef(buildTimeline);
  const lerpLambdaRef = useRef(lerpLambda);
  const seekEpsilonRef = useRef(seekEpsilon);

  onProgressRef.current = onProgress;
  buildTimelineRef.current = buildTimeline;
  lerpLambdaRef.current = lerpLambda;
  seekEpsilonRef.current = seekEpsilon;

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

  // Block native playback; coalesce seeked → next seek
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onSeeked = () => {
      seeking.current = false;
      if (pendingSeek.current) {
        pendingSeek.current = false;
        // Mark dirty so next RAF applies the lerped time
        lastApplied.current = -1;
      }
    };

    const blockPlay = () => {
      video.pause();
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("play", blockPlay);

    return () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("play", blockPlay);
    };
  }, [videoRef]);

  // RAF lerp + seek loop — started/stopped with pin activity
  useEffect(() => {
    if (!enabled || reduced || !mediaReady) return;

    const video = videoRef.current;
    if (!video) return;

    const stopLoop = () => {
      running.current = false;
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
      lastFrameTs.current = 0;
    };

    const tick = (now: number) => {
      if (!running.current) return;
      rafId.current = requestAnimationFrame(tick);

      // Idle when not pinned and already converged — zero CPU
      const duration = durationRef.current;
      if (!duration) return;

      const maxT = Math.max(duration - 0.001, 0);
      const target = clamp(targetTime.current, 0, maxT);
      const dt =
        lastFrameTs.current === 0
          ? 1 / 60
          : clamp((now - lastFrameTs.current) / 1000, 0.001, 0.05);
      lastFrameTs.current = now;

      const alpha = 1 - Math.exp(-lerpLambdaRef.current * dt);
      const prev = smoothTime.current;
      let next = prev + (target - prev) * alpha;

      // Snap when nearly settled to avoid endless micro-seeks
      if (Math.abs(target - next) < seekEpsilonRef.current * 0.35) {
        next = target;
      }
      smoothTime.current = next;

      const settled = !isActive.current && Math.abs(target - next) < 0.0005;
      if (settled && Math.abs(next - lastApplied.current) < seekEpsilonRef.current) {
        stopLoop();
        return;
      }

      if (!video.paused) video.pause();

      const delta = Math.abs(next - lastApplied.current);
      if (delta < seekEpsilonRef.current && lastApplied.current >= 0) {
        return;
      }

      if (seeking.current) {
        pendingSeek.current = true;
        return;
      }

      seeking.current = true;
      lastApplied.current = next;

      try {
        // Firefox: fastSeek is cheaper for approximate keyframe seeks
        const media = video as HTMLVideoElement & { fastSeek?: (t: number) => void };
        if (typeof media.fastSeek === "function") {
          media.fastSeek(next);
        } else {
          video.currentTime = next;
        }
      } catch {
        seeking.current = false;
      }

      // UI callback is optional and cheap — percent-level consumers throttle themselves
      onProgressRef.current?.({
        progress: progressRef.current,
        currentTime: next,
        duration,
      });
    };

    const startLoop = () => {
      if (running.current) return;
      running.current = true;
      lastFrameTs.current = 0;
      rafId.current = requestAnimationFrame(tick);
    };

    // Expose start/stop to ScrollTrigger via refs
    (video as HTMLVideoElement & { __scrubStart?: () => void; __scrubStop?: () => void }).__scrubStart =
      startLoop;
    (video as HTMLVideoElement & { __scrubStart?: () => void; __scrubStop?: () => void }).__scrubStop =
      stopLoop;

    if (isActive.current || eager) startLoop();

    return () => {
      stopLoop();
      delete (video as HTMLVideoElement & { __scrubStart?: () => void }).__scrubStart;
      delete (video as HTMLVideoElement & { __scrubStop?: () => void }).__scrubStop;
    };
  }, [enabled, reduced, mediaReady, videoRef, eager]);

  // ScrollTrigger setup
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || !enabled || !mediaReady) return;

    let tl: gsap.core.Timeline | null = null;
    let cancelled = false;

    const teardown = () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      tl = null;
    };

    const startLoop = () => {
      (
        video as HTMLVideoElement & { __scrubStart?: () => void }
      ).__scrubStart?.();
    };

    const setup = () => {
      if (cancelled) return;

      const duration = video.duration;
      if (!duration || !Number.isFinite(duration) || duration < 0.05) return;

      durationRef.current = duration;
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }
      lastApplied.current = 0;
      targetTime.current = 0;
      smoothTime.current = 0;
      progressRef.current = 0;
      setReady(true);

      teardown();
      if (reduced) return;

      // Exact pin distance = video duration × px/s
      const getEndDistance = () =>
        Math.max(1, Math.round(durationRef.current * pixelsPerSecond));

      tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start,
          end: () => `+=${getEndDistance()}`,
          // Slight scrub smoothing absorbs Lenis micro-jitter without lagging the story
          scrub: 0.45,
          pin,
          pinSpacing,
          anticipatePin,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          preventOverlaps: true,
          onToggle: (self) => {
            isActive.current = self.isActive;
            if (self.isActive) {
              video.preload = "auto";
              section.classList.add("is-scrubbing");
              startLoop();
            } else {
              section.classList.remove("is-scrubbing");
              if (!eager) video.preload = "none";
              // Keep RAF briefly so lerp can settle to final frame, then it self-stops
              startLoop();
            }
          },
          onUpdate: (self) => {
            // Hot path: only write numbers — no DOM, no layout
            const p = self.progress;
            progressRef.current = p;
            targetTime.current = p * durationRef.current;
            if (!running.current) startLoop();
          },
        },
      });

      tl.to({}, { duration: 1 }, 0);
      buildTimelineRef.current?.(tl);

      requestAnimationFrame(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    };

    const onLoadedMeta = () => setup();

    if (video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
      setup();
    } else {
      video.addEventListener("loadedmetadata", onLoadedMeta);
      ensureVideoSrc(video, src);
      video.preload = "auto";
      video.load();
    }

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", onLoadedMeta);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      section.classList.remove("is-scrubbing");
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
