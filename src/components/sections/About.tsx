"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATS } from "@/lib/constants";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".about-copy > *", {
        y: 48,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });

      gsap.from(".about-stat", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-stats", start: "top 80%" },
      });

      gsap.fromTo(
        ".about-photo-a",
        { yPercent: 12 },
        {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        ".about-photo-b",
        { yPercent: -6 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      gsap.from(".about-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 overflow-hidden py-28 md:py-40"
      aria-labelledby="about-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden>
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(244,241,236,0.06)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-grid)" />
        </svg>
      </div>

      <div className="section-pad container-max relative grid items-center gap-16 lg:grid-cols-12">
        <div className="about-copy lg:col-span-5">
          <p className="eyebrow mb-4">About the Atelier</p>
          <h2 id="about-heading" className="display-lg max-w-xl text-balance">
            Built from intention.
            <span className="block text-[var(--color-gold)]">Revealed through craft.</span>
          </h2>
          <div className="about-line mt-8 h-px w-24 bg-[var(--color-gold)]" />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-[var(--color-muted)]">
            AETHER unites architecture and construction under one measured vision. We compose
            residences, cultural spaces, and urban landmarks where proportion, material, and light
            do the speaking.
          </p>
          <p className="mt-5 max-w-md text-[var(--color-muted)]">
            From first sketch to final handover, every decision is held to the same standard —
            quiet confidence, exacting detail, lasting presence.
          </p>
        </div>

        <div className="relative grid gap-5 sm:grid-cols-2 lg:col-span-7">
          <div className="about-photo-a relative aspect-[3/4] overflow-hidden bg-[var(--color-surface)] sm:mt-12">
            <Image
              src="/images/about/atelier.jpg"
              alt="AETHER residence exterior in soft light"
              fill
              sizes="(max-width: 768px) 100vw, 35vw"
              className="object-cover"
              priority={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070708]/50 to-transparent" />
          </div>
          <div className="about-photo-b relative aspect-[3/4] overflow-hidden bg-[var(--color-surface)] sm:-mt-8">
            <Image
              src="/images/about/craft.jpg"
              alt="Interior craft and material detail"
              fill
              sizes="(max-width: 768px) 100vw, 35vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070708]/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-[var(--color-gold)]">
                Est. New York
              </p>
              <p className="mt-2 font-display text-2xl">Design · Build · Endure</p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-stats section-pad container-max relative mt-20 border-t border-[var(--color-border)] pt-14 md:mt-28">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="about-stat">
              <AnimatedCounter
                value={stat.value}
                suffix={stat.suffix}
                className="font-display text-4xl text-[var(--color-gold)] md:text-5xl"
              />
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
