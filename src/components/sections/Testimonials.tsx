"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TESTIMONIALS } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".testimonial-card", {
        y: 80,
        opacity: 0,
        rotateX: 8,
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 border-t border-[var(--color-border)] bg-[#080809] py-28 md:py-40"
      aria-labelledby="testimonials-heading"
    >
      <div className="section-pad container-max">
        <p className="eyebrow mb-4">Testimonials</p>
        <h2 id="testimonials-heading" className="display-lg max-w-3xl">
          Voices from the rooms we built.
        </h2>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <blockquote
              key={item.name}
              className="testimonial-card relative flex min-h-[320px] flex-col justify-between border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-8 transition-colors duration-500 hover:border-[var(--color-gold)]/35 md:p-10"
              data-cursor="expand"
            >
              <span
                className="font-display text-5xl leading-none text-[var(--color-gold)]/40"
                aria-hidden
              >
                ”
              </span>
              <p className="mt-4 font-display text-2xl leading-snug text-[var(--color-foreground)] md:text-[1.7rem]">
                {item.quote}
              </p>
              <footer className="mt-10 border-t border-[var(--color-border)] pt-6">
                <cite className="not-italic">
                  <span className="block text-sm tracking-[0.08em] text-[var(--color-gold)]">
                    {item.name}
                  </span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    {item.role}
                  </span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
