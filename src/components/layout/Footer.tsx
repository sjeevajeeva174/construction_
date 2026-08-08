import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--color-border)] bg-[#050506] pt-20">
      <div className="section-pad container-max grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-5xl tracking-[0.18em]">{SITE.name}</p>
          <p className="mt-5 max-w-sm text-[var(--color-muted)]">{SITE.description}</p>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow mb-5">Navigate</p>
          <ul className="space-y-3 text-sm text-[var(--color-muted)]">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-[var(--color-gold)]"
                  data-cursor="expand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="eyebrow mb-5">Connect</p>
          <ul className="space-y-3 text-sm text-[var(--color-muted)]">
            <li>
              <a
                href={SITE.social.instagram}
                className="transition-colors hover:text-[var(--color-gold)]"
                data-cursor="expand"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={SITE.social.linkedin}
                className="transition-colors hover:text-[var(--color-gold)]"
                data-cursor="expand"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={SITE.social.vimeo}
                className="transition-colors hover:text-[var(--color-gold)]"
                data-cursor="expand"
              >
                Vimeo
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="section-pad container-max mt-16 flex flex-col gap-3 border-t border-[var(--color-border)] py-8 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        <p>Architecture · Construction · New York</p>
      </div>
    </footer>
  );
}
