"use client";

/**
 * @deprecated Prefer ScrollScrubSection — all site videos are scroll-scrubbed.
 * Kept as a non-playing poster frame helper if needed.
 */
export function CinematicVideo({
  src,
  poster,
  className,
  "aria-label": ariaLabel,
}: {
  src: string;
  poster?: string;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <video
      className={className}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      autoPlay={false}
      loop={false}
      controls={false}
      aria-label={ariaLabel}
    />
  );
}
