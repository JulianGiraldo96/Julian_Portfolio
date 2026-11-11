"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BerlinClock } from "../Clock";
import { ThemeToggle } from "./Theme";
import { SPRING, ENERGY, EASE, DURATION } from "./motion";

/* Same anatomy as the original portfolio header, wordmark left, links centred,
   Berlin time right, but drawn light: hairline rule, glass fill, no
   mix-blend inversion, and the theme switch sitting beside the clock.

   The two kinds of work are pages of their own, so the bar is the switch
   between them from anywhere on the site: Product design, Visual work, and
   Contact, which is the footer of whichever page you are on (the home page's
   when you are somewhere without one). The link for the page you are on, or
   the kind of work it belongs to, is underlined. */

type Item = { href: string; label: string; short: string; on: (path: string) => boolean };

const items: Item[] = [
  {
    href: "/product-design",
    label: "Product design",
    short: "Product",
    on: (p) => p === "/product-design" || p.startsWith("/work/"),
  },
  {
    href: "/visual-work",
    label: "Visual work",
    short: "Visual",
    on: (p) => p === "/visual-work" || p.startsWith("/design/"),
  },
];

export function TopBar({ home = false }: { home?: boolean }) {
  const pathname = usePathname();

  /* Contact: the page's own footer when it has one (home and both work
     pages), the home page's otherwise. Lenis owns the scroll, so an in-page
     jump goes through it rather than the browser: left to the browser the
     anchor jumped natively and Lenis, still holding its old position, then
     pulled the page somewhere else. */
  const hasContact = home || pathname === "/product-design" || pathname === "/visual-work";
  const contactHref = hasContact ? "#contact" : "/#contact";
  const goContact = (e: React.MouseEvent) => {
    if (!hasContact || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const el = document.querySelector<HTMLElement>("#contact");
    if (!el) return;
    e.preventDefault();
    history.replaceState(null, "", "#contact");
    const lenis = window.__lenis;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(el, { offset: -72 });
    } else el.scrollIntoView({ behavior: "smooth" });
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

  /* The phone menu. Its state remembers the path it was opened on, so a
     route change closes it on its own (the state no longer matches) without
     an effect setting state. */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const menuOpen = openedOn === pathname;
  const closeMenu = () => setOpenedOn(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenedOn(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const linkClass = (on: boolean) =>
    `group relative py-2 transition-colors ${
      on ? "text-[var(--v2-ink)]" : "text-[var(--v2-secondary)] hover:text-[var(--v2-ink)]"
    }`;
  const underline = (on: boolean) => (
    <span
      aria-hidden
      className={`absolute inset-x-0 -bottom-0.5 h-px origin-right bg-current transition-transform duration-200 ease-out motion-reduce:transition-none group-hover:origin-left group-hover:scale-x-100 ${
        on ? "scale-x-100" : "scale-x-0"
      }`}
    />
  );

  return (
    <header
      data-scrolled={scrolled || menuOpen}
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
          onClick={closeMenu}
          aria-current={home ? "page" : undefined}
          className="-my-2 justify-self-start py-2 font-mono text-[13px] uppercase tracking-[0.2em] md:text-[14px]"
        >
          Julian
          <span className="align-super text-[0.7em] ml-0.5">©</span>
        </Link>

        <nav aria-label="Sections" className="hidden justify-center md:flex">
          <ul className="flex list-none items-center gap-8 font-mono text-[12px] uppercase tracking-[0.18em]">
            {items.map((l) => {
              const on = l.on(pathname);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={pathname === l.href ? "page" : undefined}
                    className={linkClass(on)}
                  >
                    {l.label}
                    {underline(on)}
                  </Link>
                </li>
              );
            })}
            <li>
              <a href={contactHref} onClick={goContact} className={linkClass(false)}>
                Contact
                {underline(false)}
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3 justify-self-end md:gap-4">
          <GitHubLink />
          <motion.span layout="position" transition={SPRING} className="hidden text-[var(--v2-label)] sm:inline">
            <BerlinClock />
          </motion.span>
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="topbar-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setOpenedOn(menuOpen ? null : pathname)}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[var(--v2-line)] text-[var(--v2-label)] transition-colors duration-200 hover:border-[var(--v2-line-strong)] hover:text-[var(--v2-ink)] md:hidden"
          >
            <Burger open={menuOpen} />
          </button>
        </div>
      </div>

      {/* the phone menu: the same three links, laid under the bar */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            key="menu"
            id="topbar-menu"
            aria-label="Sections"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE } }}
            exit={{ opacity: 0, y: -6, transition: { duration: DURATION.hover, ease: EASE } }}
            className="border-t border-[var(--v2-line)] md:hidden"
          >
            <ul className="mx-auto flex max-w-[1240px] list-none flex-col px-5 py-2 font-mono text-[12px] uppercase tracking-[0.18em]">
              {items.map((l) => {
                const on = l.on(pathname);
                return (
                  <li key={l.href} className="border-b border-[var(--v2-line)] last:border-b-0">
                    <Link
                      href={l.href}
                      onClick={closeMenu}
                      aria-current={pathname === l.href ? "page" : undefined}
                      className={`flex min-h-[48px] items-center justify-between gap-4 ${
                        on ? "text-[var(--v2-ink)]" : "text-[var(--v2-secondary)]"
                      }`}
                    >
                      {l.label}
                      <span aria-hidden className={on ? "" : "opacity-50"}>
                        {on ? "·" : "↗︎"}
                      </span>
                    </Link>
                  </li>
                );
              })}
              <li className="border-t border-[var(--v2-line)]">
                <a
                  href={contactHref}
                  onClick={(e) => {
                    closeMenu();
                    goContact(e);
                  }}
                  className="flex min-h-[48px] items-center justify-between gap-4 text-[var(--v2-secondary)]"
                >
                  Contact
                  <span aria-hidden className="opacity-50">↓</span>
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* two bars that cross when the menu is open */
function Burger({ open }: { open: boolean }) {
  const bar = "absolute left-1/2 h-px w-[14px] -translate-x-1/2 bg-current";
  return (
    <span aria-hidden className="relative block h-[14px] w-[14px]">
      <motion.span
        animate={{ y: open ? 7 : 4, rotate: open ? 45 : 0 }}
        transition={SPRING}
        className={bar}
      />
      <motion.span
        animate={{ y: open ? 7 : 10, rotate: open ? -45 : 0 }}
        transition={SPRING}
        className={bar}
      />
    </span>
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
            <span aria-hidden>↗︎</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}
