"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    if (!sectionRef.current || reduced) return;

    const ctx = gsap.context(() => {
      gsap.to(".contact-grid-shift", {
        backgroundPosition: "40px 40px",
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
      id="contact"
      ref={sectionRef}
      className="relative z-10 overflow-hidden border-t border-[var(--color-border)] py-28 md:py-40"
      aria-labelledby="contact-heading"
    >
      <div
        aria-hidden
        className="contact-grid-shift pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,241,236,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,236,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          backgroundPosition: "0 0",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[var(--color-gold)]/5 blur-3xl"
      />

      <div className="section-pad container-max relative grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-4">Contact</p>
          <h2 id="contact-heading" className="display-lg">
            Begin the conversation.
          </h2>
          <p className="mt-6 text-[var(--color-muted)]">
            Share your site, ambitions, and timeline. We respond within two business days with a
            curated next step.
          </p>

          <dl className="mt-12 space-y-6 text-sm">
            <div>
              <dt className="eyebrow mb-2 text-[var(--color-muted)]">Studio</dt>
              <dd>{SITE.address}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-2 text-[var(--color-muted)]">Email</dt>
              <dd>
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors hover:text-[var(--color-gold)]"
                  data-cursor="expand"
                >
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-2 text-[var(--color-muted)]">Phone</dt>
              <dd>
                <a
                  href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`}
                  className="transition-colors hover:text-[var(--color-gold)]"
                  data-cursor="expand"
                >
                  {SITE.phone}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            className="glass space-y-8 p-8 md:p-10"
            aria-describedby={submitted ? "contact-success" : undefined}
          >
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required autoComplete="name" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@studio.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="project">Project Type</Label>
              <Input
                id="project"
                name="project"
                placeholder="Residence / Cultural / Commercial"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                required
                placeholder="Tell us about the site, scale, and vision."
              />
            </div>
            <Button type="submit" size="lg" data-cursor="expand">
              Send Inquiry
            </Button>
            {submitted && (
              <p id="contact-success" className="text-sm text-[var(--color-gold)]" role="status">
                Thank you. Your inquiry has been received — we will be in touch shortly.
              </p>
            )}
          </form>

          <div className="mt-8 overflow-hidden border border-[var(--color-border)]">
            <iframe
              title="AETHER studio location map"
              src="https://maps.google.com/maps?q=120%20Mercer%20Street%20New%20York&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="h-72 w-full grayscale contrast-125 invert-[0.88]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
