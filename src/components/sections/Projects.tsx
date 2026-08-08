"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".project-heading > *", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, i) => {
        gsap.from(card, {
          y: 64,
          opacity: 0,
          duration: 1,
          delay: (i % 2) * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });

        const media = card.querySelector(".project-media");
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-10 border-t border-[var(--color-border)] bg-[#080809] py-28 md:py-40"
      aria-labelledby="projects-heading"
    >
      <div className="section-pad container-max">
        <div className="project-heading max-w-3xl">
          <p className="eyebrow mb-4">Featured Projects</p>
          <h2 id="projects-heading" className="display-lg">
            Landscapes of ambition.
          </h2>
          <p className="mt-6 max-w-xl text-[var(--color-muted)]">
            Selected works across residences, cultural institutions, and urban landmarks — each a
            study in proportion and presence.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8">
          {PROJECTS.map((project, i) => (
            <article
              key={project.id}
              className={cn(
                "project-card group relative overflow-hidden bg-[var(--color-surface)]",
                i === 0 && "md:col-span-2",
              )}
              data-cursor="expand"
            >
              <Link href="#contact" className="block focus-visible:outline-none">
                <div
                  className={cn(
                    "relative overflow-hidden",
                    i === 0 ? "aspect-[21/9] min-h-[280px]" : "aspect-[4/3]",
                  )}
                >
                  <div className="project-media absolute inset-[-8%]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes={i === 0 ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-[var(--color-gold)]">
                      {String(i + 1).padStart(2, "0")} — {project.category}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">
                      {project.location} · {project.year}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-3xl md:text-4xl">{project.title}</h3>
                  <p className="mt-3 max-w-xl text-sm text-[var(--color-muted)] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:translate-y-2">
                    {project.description}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
