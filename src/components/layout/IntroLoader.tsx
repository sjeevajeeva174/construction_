"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function IntroLoader() {
  const [done, setDone] = useState(false);
  const [hide, setHide] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setHide(true);
      setDone(true);
      return;
    }
    const t1 = window.setTimeout(() => setDone(true), 1800);
    const t2 = window.setTimeout(() => setHide(true), 2600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduced]);

  if (hide) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-[#070708] transition-opacity duration-700 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden={done}
    >
      <div className="text-center">
        <p className="font-display text-5xl tracking-[0.35em] text-[var(--color-foreground)] md:text-7xl">
          {SITE.name}
        </p>
        <p className="mt-4 text-[0.65rem] uppercase tracking-[0.4em] text-[var(--color-gold)]">
          {SITE.tagline}
        </p>
        <div className="mx-auto mt-10 h-px w-24 overflow-hidden bg-white/10">
          <div className="intro-loader-bar h-full w-full origin-left bg-[var(--color-gold)]" />
        </div>
      </div>
    </div>
  );
}
