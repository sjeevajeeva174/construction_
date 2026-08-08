"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((item) => {
        gsap.fromTo(
          item,
          { clipPath: "inset(12% 12% 12% 12%)", opacity: 0.35 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative z-10 border-t border-[var(--color-border)] bg-[#060607] py-28 md:py-40"
      aria-labelledby="gallery-heading"
    >
      <div className="section-pad container-max">
        <p className="eyebrow mb-4">Gallery</p>
        <h2 id="gallery-heading" className="display-lg max-w-3xl">
          Light, mass, and stillness.
        </h2>
        <p className="mt-6 max-w-xl text-[var(--color-muted)]">
          A curated study of atmospheres — images only, composed for the eye rather than the reel.
        </p>

        <div className="gallery-masonry mt-16">
          {GALLERY.map((item) => (
            <figure
              key={item.src}
              className={cn(
                "gallery-item group relative overflow-hidden bg-[var(--color-surface)]",
                item.span === "tall" && "gallery-tall",
                item.span === "wide" && "gallery-wide",
              )}
              data-cursor="expand"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
              />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-[#070708]/90 to-transparent p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-sm text-[var(--color-foreground)]">{item.alt}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
