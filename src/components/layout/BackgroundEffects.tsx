"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function BackgroundEffects() {
  const reduced = useReducedMotion();
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !linesRef.current) return;
    const lines = linesRef.current.querySelectorAll(".arch-line");
    gsap.fromTo(
      lines,
      { scaleY: 0, opacity: 0 },
      {
        scaleY: 1,
        opacity: 0.35,
        duration: 1.8,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.4,
      },
    );
  }, [reduced]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(198,167,94,0.08),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(80,90,120,0.12),_transparent_50%)]" />
      <div className="bg-noise absolute inset-0 opacity-[0.18] mix-blend-soft-light" />
      <div ref={linesRef} className="absolute inset-0">
        {[12, 28, 46, 64, 82].map((left) => (
          <span
            key={left}
            className="arch-line absolute bottom-0 top-0 w-px origin-bottom bg-gradient-to-b from-transparent via-[var(--color-gold)]/30 to-transparent"
            style={{ left: `${left}%` }}
          />
        ))}
      </div>
      <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full border border-[var(--color-gold)]/10" />
      <div className="absolute -right-16 bottom-1/4 h-96 w-96 rotate-12 border border-white/5" />
    </div>
  );
}
