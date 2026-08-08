"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useScrollVideoScrub } from "@/hooks/useScrollVideoScrub";
import { cn } from "@/lib/utils";

type ScrollScrubSectionProps = {
  id?: string;
  src: string;
  poster?: string;
  ariaLabel: string;
  className?: string;
  videoClassName?: string;
  mediaClassName?: string;
  contentClassName?: string;
  overlayClassName?: string;
  /** Px of scroll per second of video. Pin length = duration × this. */
  pixelsPerSecond?: number;
  /** Load immediately (hero). Others lazy-load near viewport. */
  eager?: boolean;
  pin?: boolean;
  fadeOut?: boolean;
  fadeIn?: boolean;
  zoom?: boolean;
  showProgress?: boolean;
  kicker?: string;
  title?: string;
  titleClassName?: string;
  subtitle?: string;
  body?: string;
  meta?: string;
  children?: ReactNode;
  buildTimeline?: (tl: gsap.core.Timeline) => void;
};

/**
 * Pinned scroll-scrub cinematic accent.
 * Visual chrome is GSAP-driven (composited). Video time is RAF-lerped in the hook.
 */
export function ScrollScrubSection({
  id,
  src,
  poster,
  ariaLabel,
  className,
  videoClassName,
  mediaClassName,
  contentClassName,
  overlayClassName,
  pixelsPerSecond = 280,
  eager = false,
  pin = true,
  fadeOut = true,
  fadeIn = true,
  zoom = true,
  showProgress = true,
  kicker,
  title,
  titleClassName,
  subtitle,
  body,
  meta,
  children,
  buildTimeline,
}: ScrollScrubSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const lastPercent = useRef(-1);

  useScrollVideoScrub(sectionRef, videoRef, {
    src,
    pixelsPerSecond,
    pin,
    eager,
    onProgress: ({ progress }) => {
      // Throttle DOM text to whole percents — avoids layout thrash
      if (!showProgress || !progressLabelRef.current) return;
      const pct = (progress * 100) | 0;
      if (pct === lastPercent.current) return;
      lastPercent.current = pct;
      progressLabelRef.current.textContent = `${pct}%`;
    },
    buildTimeline: (tl) => {
      // All motion via transforms/opacity on the GSAP tick (compositor-friendly)
      if (zoom && videoWrapRef.current) {
        tl.fromTo(
          videoWrapRef.current,
          { scale: 1 },
          { scale: 1.04, ease: "none", force3D: true },
          0,
        );
      }

      if (veilRef.current) {
        if (fadeIn) {
          tl.fromTo(veilRef.current, { opacity: 1 }, { opacity: 0, ease: "none", duration: 0.12 }, 0);
        }
        if (fadeOut) {
          tl.fromTo(
            veilRef.current,
            { opacity: 0 },
            { opacity: 1, ease: "none", duration: 0.12 },
            0.88,
          );
        }
      }

      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { y: 0 },
          { y: -18, ease: "none", force3D: true },
          0,
        );
      }

      if (copyRef.current) {
        tl.fromTo(
          copyRef.current,
          { opacity: 1, y: 0 },
          { opacity: 0.15, y: -14, ease: "none", force3D: true },
          0.55,
        );
      }

      if (contentInnerRef.current) {
        tl.fromTo(
          contentInnerRef.current,
          { opacity: 1 },
          { opacity: 0.85, ease: "none" },
          0.7,
        );
      }

      buildTimeline?.(tl);
    },
  });

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn(
        "scrub-section relative z-10 flex h-[100svh] min-h-[100svh] items-end overflow-hidden bg-[#070708]",
        className,
      )}
      aria-label={ariaLabel}
    >
      <div
        ref={videoWrapRef}
        className={cn(
          "scrub-media absolute inset-0 will-change-transform",
          mediaClassName,
        )}
      >
        <video
          ref={videoRef}
          className={cn(
            "scrub-video h-full w-full object-cover",
            videoClassName,
          )}
          {...(eager ? { src } : {})}
          poster={poster}
          muted
          playsInline
          preload={eager ? "auto" : "none"}
          autoPlay={false}
          loop={false}
          controls={false}
          disablePictureInPicture
          aria-label={ariaLabel}
        />
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/50 to-[#070708]/35",
          overlayClassName,
        )}
      />
      <div
        ref={veilRef}
        className="pointer-events-none absolute inset-0 bg-[#070708] will-change-[opacity]"
        style={{ opacity: fadeIn ? 1 : 0 }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#070708] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070708] to-transparent"
        aria-hidden
      />

      <div
        className={cn(
          "section-pad container-max relative z-10 w-full pb-16 pt-28 md:pb-24",
          contentClassName,
        )}
      >
        <div ref={contentInnerRef} className="will-change-[opacity,transform]">
          {(kicker || meta || showProgress) && (
            <div className="mb-6 flex flex-wrap items-center gap-4">
              {kicker && <p className="eyebrow mb-0">{kicker}</p>}
              {meta && (
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  {meta}
                </span>
              )}
              {showProgress && (
                <span
                  ref={progressLabelRef}
                  className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-[var(--color-gold)]"
                >
                  0%
                </span>
              )}
            </div>
          )}
          {title && (
            <h2
              ref={titleRef}
              className={cn("display-lg max-w-4xl text-balance", titleClassName)}
            >
              {title}
            </h2>
          )}
          <div ref={copyRef}>
            {subtitle && (
              <p className="mt-3 text-sm text-[var(--color-muted)]">{subtitle}</p>
            )}
            {body && (
              <p className="mt-6 max-w-xl text-[var(--color-muted)] md:text-lg">{body}</p>
            )}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
