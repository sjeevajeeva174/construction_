"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Navigation() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY.current && y > 120);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (reduced) return;
    gsap.fromTo(
      ".nav-item",
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.9, ease: "power3.out", delay: 0.2 },
    );
  }, [reduced]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        hidden && !open ? "-translate-y-full" : "translate-y-0",
        scrolled || open ? "bg-[rgba(7,7,8,0.78)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav
        className="section-pad container-max flex h-[4.5rem] items-center justify-between"
        aria-label="Primary"
      >
        <Link href="#top" className="nav-item group flex items-center gap-3" data-cursor="expand">
          <Image src="/icons/logo-mark.svg" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="font-display text-2xl tracking-[0.22em] text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-gold)]">
            {SITE.name}
          </span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="nav-item">
              <Link
                href={link.href}
                className="relative text-[0.7rem] uppercase tracking-[0.24em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
                data-cursor="expand"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--color-gold)] transition-all duration-500 group-hover:w-full hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="#contact"
          className="nav-item hidden border border-[var(--color-border)] px-5 py-2 text-[0.65rem] uppercase tracking-[0.22em] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] md:inline-flex"
          data-cursor="expand"
        >
          Begin a Project
        </Link>

        <button
          type="button"
          className="nav-item inline-flex h-10 w-10 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-5">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-full bg-current transition-transform",
                open && "translate-y-1.5 rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1.5 h-px w-full bg-current transition-opacity",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-3 h-px w-full bg-current transition-transform",
                open && "-translate-y-1.5 -rotate-45",
              )}
            />
          </span>
        </button>
      </nav>

      <div
        id="mobile-nav"
        className={cn(
          "section-pad border-t border-[var(--color-border)] bg-[rgba(7,7,8,0.95)] backdrop-blur-xl lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <ul className="flex flex-col gap-4 py-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-display text-3xl"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
