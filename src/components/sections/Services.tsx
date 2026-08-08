"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, string> = {
  precision: "/icons/precision.svg",
  craft: "/icons/craft.svg",
  timeline: "/icons/timeline.svg",
  legacy: "/icons/legacy.svg",
};

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".service-card", {
        y: 56,
        opacity: 0,
        duration: 0.95,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      gsap.to(".service-orb", {
        y: -36,
        rotate: 18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative z-10 overflow-hidden border-t border-[var(--color-border)] py-28 md:py-40"
      aria-labelledby="services-heading"
    >
      <div
        aria-hidden
        className="service-orb absolute -right-16 top-16 h-64 w-64 rounded-full border border-[var(--color-gold)]/15"
      />
      <div
        aria-hidden
        className="service-orb absolute -left-8 bottom-10 h-48 w-48 rotate-12 border border-white/8"
      />

      <div className="section-pad container-max">
        <p className="eyebrow mb-4">Services</p>
        <h2 id="services-heading" className="display-lg max-w-3xl">
          One atelier. Four disciplines.
        </h2>
        <p className="mt-6 max-w-xl text-[var(--color-muted)]">
          Architecture, interiors, construction, and planning — delivered as a continuous craft
          rather than fragmented handoffs.
        </p>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {SERVICES.map((item, i) => (
            <article
              key={item.title}
              className="service-card group relative overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-gold)]/45 md:p-10"
              data-cursor="expand"
            >
              <div className="pointer-events-none absolute -right-6 -top-6 font-display text-[7rem] leading-none text-white/[0.03] transition-colors group-hover:text-[var(--color-gold)]/[0.06]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <Image
                src={ICONS[item.icon]}
                alt=""
                width={52}
                height={52}
                className="mb-8 h-12 w-12 opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:drop-shadow-[0_0_18px_rgba(198,167,94,0.35)]"
                style={{ filter: "invert(78%) sepia(28%) saturate(600%) hue-rotate(5deg)" }}
              />
              <h3 className="font-display text-3xl md:text-4xl">{item.title}</h3>
              <p className="mt-4 max-w-md text-[var(--color-muted)]">{item.copy}</p>
              <div className="mt-8 h-px w-12 bg-[var(--color-border)] transition-all duration-500 group-hover:w-20 group-hover:bg-[var(--color-gold)]" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
