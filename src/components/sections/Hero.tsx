"use client";

import { SITE, VIDEOS, VIDEO_SCRUB_PPS } from "@/lib/constants";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { ScrollScrubSection } from "@/components/shared/ScrollScrubSection";

export function Hero() {
  return (
    <ScrollScrubSection
      id="top"
      src={VIDEOS.hero.src}
      poster={VIDEOS.hero.poster}
      ariaLabel={VIDEOS.hero.label}
      pixelsPerSecond={VIDEO_SCRUB_PPS}
      eager
      fadeIn={false}
      kicker={SITE.tagline}
      showProgress
      overlayClassName="bg-gradient-to-t from-[#070708] via-[#070708]/55 to-[#070708]/40"
    >
      <h1 className="display-xl max-w-5xl text-balance">
        <span className="block">{SITE.name}</span>
        <span className="mt-2 block text-[clamp(1.5rem,3.5vw,2.75rem)] font-normal tracking-[0.02em] text-[var(--color-gold)]">
          Spaces that endure scrutiny.
        </span>
      </h1>
      <p className="mt-8 max-w-lg text-base text-[var(--color-muted)] md:text-lg">
        Architecture and construction under one atelier — composed for light, material, and lasting
        presence.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <MagneticButton
          href="#projects"
          className="inline-flex h-14 items-center bg-[var(--color-gold)] px-8 text-sm uppercase tracking-[0.2em] text-[#0b0b0c] transition-colors hover:bg-[var(--color-gold-soft)]"
        >
          View Projects
        </MagneticButton>
        <MagneticButton
          href="#about"
          className="inline-flex h-14 items-center border border-[var(--color-border)] px-8 text-sm uppercase tracking-[0.2em] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
        >
          Our Practice
        </MagneticButton>
      </div>
    </ScrollScrubSection>
  );
}
