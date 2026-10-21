"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BerlinClock } from "../Clock";
import { ThemeToggle } from "./Theme";
import { VIEW_EVENT } from "./WorkSwitch";

/* Same anatomy as the original portfolio header, wordmark left, links centred,
   Berlin time right, but drawn light: hairline rule, glass fill, no
   mix-blend inversion, and the theme switch sitting beside the clock.
   On a case study the section links point back at the home page. */

/* "#design" opens the Work block on its Design view (WorkSwitch listens for
   the hash), so both kinds of work are one click from anywhere. */
const sections = [
  { hash: "#work", label: "Product" },
  { hash: "#design", label: "Design" },
  { hash: "#contact", label: "Contact" },
];

export function TopBar({ home = false }: { home?: boolean }) {
  /* on the home page these are in-page anchors; anywhere else they have to
     travel back to the home page first */
  const href = (hash: string) => (home ? hash : `/${hash}`);

  /* On the home page the scroll is Lenis's alone. Left to the browser, the
     anchor jumped natively and Lenis, still holding its old position and
     page length, then pulled the page somewhere else. The hash is written
     with replaceState and announced with WorkSwitch's own event, so the
     Product and Design links still pick the view. */
  const go = (e: React.MouseEvent, hash: string) => {
    if (!home || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const el = document.querySelector<HTMLElement>(hash);
    if (!el) return;
    e.preventDefault();
    history.replaceState(null, "", hash);
    window.dispatchEvent(new Event(VIEW_EVENT));
    /* one frame, so a view switch has started before the target is measured */
    requestAnimationFrame(() => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(el, { offset: -72 });
      } else el.scrollIntoView({ behavior: "smooth" });
    });
  };

  /* The bar earns its surface. At the top of the page there is nothing under
     it to separate, so it starts as bare text; the hairline and the glass
     fill arrive with the first scroll. */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="v2-topbar sticky top-0 z-50 backdrop-blur-xl"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--v2-invert-bg)] focus:px-5 focus:py-3 focus:text-[14px] focus:text-[var(--v2-invert-ink)]"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-3.5 md:grid md:grid-cols-3 md:px-8">
        <Link
          href="/"
          className="-my-2 justify-self-start py-2 font-mono text-[13px] uppercase tracking-[0.2em] md:text-[14px]"
        >
          Julian
          <span className="align-super text-[0.7em] ml-0.5">©</span>
        </Link>

        <nav aria-label="Sections" className="hidden justify-center md:flex">
          <ul className="flex list-none items-center gap-8 font-mono text-[12px] uppercase tracking-[0.18em]">
            {sections.map((l) => (
              <li key={l.hash}>
                <a
                  href={href(l.hash)}
                  onClick={(e) => go(e, l.hash)}
                  className="group relative py-2 text-[var(--v2-secondary)] transition-colors hover:text-[var(--v2-ink)]"
                >
                  {l.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-current transition-transform duration-200 ease-out motion-reduce:transition-none group-hover:origin-left group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 justify-self-end md:gap-4">
          <span className="hidden text-[var(--v2-label)] sm:inline">
            <BerlinClock />
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
