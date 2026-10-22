"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BerlinClock } from "../Clock";
import { ThemeToggle } from "./Theme";
import { VIEW_EVENT } from "./WorkSwitch";
import { SPRING, ENERGY } from "./motion";

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
          <GitHubLink />
          <motion.span layout="position" transition={SPRING} className="hidden text-[var(--v2-label)] sm:inline">
            <BerlinClock />
          </motion.span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

/* GitHub, as a mark beside the clock. Hovered or focused it opens sideways
   into the username and an arrow, so the handle is there to read before the
   click takes you away. The pill grows by layout animation (a transform), and
   the label pops out of the flow on the way out so the pill can close. */
const GITHUB = "JulianGiraldo96";

function GitHubLink() {
  const [open, setOpen] = useState(false);
  return (
    <motion.a
      layout
      href={`https://github.com/${GITHUB}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`GitHub: ${GITHUB} (opens in a new tab)`}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      transition={SPRING}
      style={{ borderRadius: 999 }}
      className="flex h-[30px] items-center gap-1.5 overflow-hidden border border-[var(--v2-line)] px-[7px] text-[var(--v2-label)] transition-colors duration-200 hover:border-[var(--v2-line-strong)] hover:text-[var(--v2-ink)]"
    >
      <motion.svg layout="position" aria-hidden viewBox="0 0 16 16" className="h-[14px] w-[14px] shrink-0" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </motion.svg>
      <AnimatePresence mode="popLayout" initial={false}>
        {open && (
          <motion.span
            key="handle"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.35, ease: ENERGY, delay: 0.05 } }}
            exit={{ opacity: 0, x: -8, transition: { duration: 0.12 } }}
            className="flex items-center gap-1 whitespace-nowrap pr-1 font-mono text-[11px] tracking-[0.06em]"
          >
            {GITHUB}
            <span aria-hidden>↗</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}
