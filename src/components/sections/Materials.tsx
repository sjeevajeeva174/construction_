"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MATERIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

function QualityMeter({ value, active }: { value: number; active: boolean }) {
  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">
        <span>Specification Index</span>
        <span className="text-[var(--color-gold)]">{value}</span>
      </div>
      <div className="h-px w-full overflow-hidden bg-[var(--color-border)]">
        <div
          className="material-meter h-full origin-left bg-[var(--color-gold)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `scaleX(${active ? value / 100 : 0})` }}
        />
      </div>
    </div>
  );
}

export function Materials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<(typeof MATERIALS)[number]["id"]>(MATERIALS[0].id);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".material-card", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });

      gsap.from(".material-diagram path", {
        strokeDashoffset: 200,
        duration: 1.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: ".material-diagram", start: "top 80%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="materials"
      ref={sectionRef}
      className="relative z-10 border-t border-[var(--color-border)] py-28 md:py-40"
      aria-labelledby="materials-heading"
    >
      <div className="section-pad container-max">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">Materials & Quality</p>
            <h2 id="materials-heading" className="display-lg max-w-3xl">
              The language of matter.
            </h2>
            <p className="mt-6 max-w-2xl text-[var(--color-muted)]">
              Concrete, steel, wood, and glass — each selected for how it receives light and how it
              ages with dignity.
            </p>
          </div>
          <div className="lg:col-span-5">
            <svg
              className="material-diagram h-24 w-full text-[var(--color-gold)]/50"
              viewBox="0 0 320 80"
              fill="none"
              aria-hidden
            >
              <path
                d="M8 64 L80 16 L152 48 L224 12 L312 56"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="200"
                strokeDashoffset="0"
              />
              <path
                d="M8 72 H312"
                stroke="rgba(244,241,236,0.15)"
                strokeWidth="1"
                strokeDasharray="200"
              />
              {[80, 152, 224].map((x) => (
                <circle key={x} cx={x} cy={x === 80 ? 16 : x === 152 ? 48 : 12} r="3" fill="currentColor" />
              ))}
            </svg>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {MATERIALS.map((material) => {
            const isActive = active === material.id;
            return (
              <article
                key={material.id}
                onMouseEnter={() => setActive(material.id)}
                onFocus={() => setActive(material.id)}
                tabIndex={0}
                data-cursor="expand"
                className={cn(
                  "material-card group relative overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-elevated)] transition-all duration-500",
                  isActive && "border-[var(--color-gold)]/45",
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={material.image}
                    alt={material.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-transparent to-transparent" />
                  <div
                    className="absolute left-4 top-4 h-3 w-3 rounded-full"
                    style={{ background: material.tone }}
                    aria-hidden
                  />
                </div>
                <div className="p-6">
                  <p className="eyebrow mb-3">{material.id}</p>
                  <h3 className="font-display text-3xl">{material.title}</h3>
                  <p className="mt-3 text-sm text-[var(--color-muted)]">{material.copy}</p>
                  <QualityMeter value={material.quality} active={isActive} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
