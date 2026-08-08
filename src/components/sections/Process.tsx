"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS_STEPS, VIDEOS, VIDEO_SCRUB_PPS } from "@/lib/constants";
import { ScrollScrubSection } from "@/components/shared/ScrollScrubSection";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Process() {
  const introRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!introRef.current || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".process-step", {
        y: 48,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".process-grid", start: "top 78%" },
      });

      gsap.from(".process-rail", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: ".process-grid", start: "top 80%" },
      });
    }, introRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div id="process" className="relative z-10">
      <section
        ref={introRef}
        className="border-t border-[var(--color-border)] bg-[#070708] py-28 md:py-36"
        aria-labelledby="process-heading"
      >
        <div className="section-pad container-max">
          <p className="eyebrow mb-4">Construction Process</p>
          <h2 id="process-heading" className="display-lg max-w-3xl">
            From earth to elevation.
          </h2>
          <p className="mt-6 max-w-xl text-[var(--color-muted)]">
            A clear sequence — discovery to delivery — with craft protected at every threshold.
          </p>

          <div className="process-grid relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div
              className="process-rail pointer-events-none absolute left-[1.15rem] top-3 hidden h-[calc(100%-1.5rem)] w-px bg-[var(--color-border)] lg:left-1/2 lg:block lg:-translate-x-px"
              aria-hidden
            />
            {PROCESS_STEPS.map((step, index) => (
              <article
                key={step.id}
                className="process-step group relative border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-7 transition-colors duration-500 hover:border-[var(--color-gold)]/40"
                data-cursor="expand"
              >
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-3xl transition-colors group-hover:text-[var(--color-gold)]">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">{step.copy}</p>
                <svg
                  className="mt-8 h-8 w-full text-[var(--color-border)] transition-colors group-hover:text-[var(--color-gold)]/50"
                  viewBox="0 0 120 24"
                  fill="none"
                  aria-hidden
                >
                  <path d="M0 22 H120 M0 12 H80 M0 2 H40" stroke="currentColor" strokeWidth="1" />
                </svg>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ScrollScrubSection
        id="construction"
        src={VIDEOS.construction.src}
        poster={VIDEOS.construction.poster}
        ariaLabel={VIDEOS.construction.label}
        pixelsPerSecond={VIDEO_SCRUB_PPS}
        kicker="On Site"
        title="Structure in four seconds."
        body="A single construction accent — scrub forward to build, scroll back to rewind. Unpins at the final frame."
      />
    </div>
  );
}
