"use client";

import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TopBar } from "./TopBar";
import { V2Button } from "./V2Button";
import { DURATION, EASE } from "./motion";
import { Showcase } from "./Showcase";
import { WorkSwitch } from "./WorkSwitch";

const EMAIL = "application@juliang.de";
const LINKEDIN = "https://www.linkedin.com/in/julian-gr/";
const CV = "/Julian_Giraldo_CV.pdf";

/* Type system is the original portfolio's: Outfit (--font-display) light and
   tight for anything that carries a voice, Geist Mono uppercase for labels,
   Geist Sans for running text. Colour comes from the .v2-root tokens in
   globals.css, so light and dark are one stylesheet. */

/* The address is copied, not handed to a mail client: `application@juliang.de`
   forwards but cannot send, and a mailto opens whatever the machine has
   registered, which on a borrowed laptop is usually nothing. Both places that
   show the address use this, so the feedback reads the same in each. */
function useCopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  return { copied, copy };
}

/* Feedback is the glyph swapping, never the label: the label is the address
   itself and swapping it for "Copied" would resize a button sitting in a
   centred row and shove the ones beside it. */
function CopyGlyph({ copied }: { copied: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[1.15em] w-[1.15em] shrink-0 opacity-80"
    >
      {copied ? (
        <path pathLength={1} className="v2-check-draw" d="M4.5 12.5 9.5 17.5 19.5 6.5" />
      ) : (
        <>
          <rect x="9" y="9" width="11" height="11" rx="2.5" />
          <path d="M5 15V5.5A2.5 2.5 0 0 1 7.5 3H15" />
        </>
      )}
    </svg>
  );
}

function CopiedStatus({ copied }: { copied: boolean }) {
  return (
    <span aria-live="polite" className="sr-only">
      {copied ? "Email address copied to clipboard" : ""}
    </span>
  );
}

export function V2Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="v2-root font-sans">
        <TopBar home />
        <main id="main" className="mx-auto max-w-[1240px] px-5 md:px-8">
          <Intro />
          <WorkSwitch />
          <Showcase />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

/* The hero's claim is dense data made calm, so the hero proves it with the
   densest thing on the site: a ledger of the five systems, each with the one
   number that survived, doubling as navigation. */
const ledger = [
  { name: "ERP Duo", stat: "9 locations", mark: "now", href: "/work/erp-duo", live: true },
  { name: "Scan Memory", stat: "-35% errors", mark: "2025", href: "/work/scan-memory", live: true },
  { name: "TaurusWebs", stat: "6h to 1h", mark: "2020", href: "/work/taurus", live: true },
  { name: "Savee", stat: "0 to 1", mark: "2025", href: "/work/savee", live: false },
  { name: "Meinerva", stat: "thesis", mark: "2025", href: "/work/meinerva", live: false },
];

function Intro() {
  const { copied, copy } = useCopyEmail();

  return (
    <section aria-label="Introduction" className="pb-16 pt-12 md:pb-24 md:pt-20">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <p className="v2-rise flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-secondary)]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
            <span className="text-[var(--v2-accent)]">Open for work</span>
            <span aria-hidden className="text-[var(--v2-label)]">&middot;</span>
            <span>Product Designer</span>
            <span aria-hidden className="text-[var(--v2-label)]">&middot;</span>
            <span>Berlin, DE</span>
          </p>

          <h1 className="v2-rise v2-rise-1 mt-7 text-balance font-display text-[clamp(2.4rem,5.2vw,4.6rem)] font-extralight leading-[1.04] tracking-[-0.045em]">
            <span className="sr-only">Product Designer in Berlin. </span>
            I make dense, data&nbsp;heavy products feel{" "}
            <span className="font-normal">calm</span> and usable.
          </h1>

          <p className="v2-rise v2-rise-2 mt-7 max-w-[560px] text-[16px] leading-relaxed text-[var(--v2-secondary)] md:text-[18px]">
            4 years in product, 8+ years designing. I design products I also use
            myself: the ERP I built at Duo Sicilian Ice Cream runs daily across
            nine locations and six departments.
          </p>

          <p className="v2-rise v2-rise-3 mt-9 flex flex-wrap items-center gap-2">
            <V2Button href={LINKEDIN} tone="outline">
              LinkedIn
            </V2Button>
            <V2Button
              onClick={copy}
              shortLabel="Email"
              ariaLabel={`Copy email address, ${EMAIL}`}
              trailing={<CopyGlyph copied={copied} />}
            >
              {EMAIL}
            </V2Button>
            <V2Button href={CV} tone="outline">
              CV
            </V2Button>
            <CopiedStatus copied={copied} />
          </p>
        </div>

        <nav
          aria-label="Case studies index"
          className="v2-rise v2-rise-4 w-full max-w-[430px] md:col-span-5 md:justify-self-end"
        >
          <div className="grain relative overflow-hidden rounded-[20px] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-2">
            <div className="flex items-baseline justify-between px-3 pb-2.5 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--v2-label)]">
              <span>Systems</span>
              <span>2020 to now</span>
            </div>
            <ul className="list-none">
              {ledger.map((r, i) => (
                <li
                  key={r.name}
                  className="v2-rise"
                  style={{ animationDelay: `${480 + i * 90}ms` }}
                >
                  <Link
                    href={r.href}
                    className="group flex items-center justify-between gap-3 rounded-[12px] px-3 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 hover:bg-[var(--v2-invert-bg)] hover:text-[var(--v2-invert-ink)] focus-visible:bg-[var(--v2-invert-bg)] focus-visible:text-[var(--v2-invert-ink)]"
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          r.live
                            ? "bg-[var(--v2-accent)]"
                            : "border border-current opacity-60"
                        }`}
                      />
                      {r.name}
                    </span>
                    <span className="flex items-center gap-3 text-[var(--v2-label)] transition-colors duration-200 group-hover:text-[var(--v2-invert-ink)]">
                      <span>{r.stat}</span>
                      <span className="w-[4ch] text-right opacity-70">
                        {r.mark}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </section>
  );
}

function Footer() {
  const { copied, copy } = useCopyEmail();

  return (
    <footer
      id="contact"
      aria-labelledby="contact-heading"
      className="mx-auto max-w-[1240px] scroll-mt-24 px-5 pb-14 pt-20 md:px-8 md:pb-20 md:pt-28"
    >
      <div className="grid grid-cols-1 gap-10 border-t border-[var(--v2-line)] pt-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <h2
            id="contact-heading"
            className="font-display text-[34px] font-extralight leading-[1.04] tracking-[-0.04em] md:text-[46px]"
          >
            Get in touch
          </h2>
          <p className="mt-5 max-w-[38ch] text-[15px] leading-relaxed text-[var(--v2-secondary)]">
            Open to Product Design roles in Berlin or remote. Happy to walk you
            through any of these projects.
          </p>

          {/* the badge that opened the page closes it too, so the footer
              reads as an answer to the hero rather than an afterthought */}
          <span className="grain relative mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--v2-surface)] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-accent)]">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--v2-accent)]" />
            Open for work
          </span>
        </div>

        <div className="w-full md:col-span-7 md:max-w-[460px] md:justify-self-end">
          {/* one grained, bordered card, the same material as the hero's
              systems ledger: the two bookend each other. */}
          <div className="grain relative overflow-hidden rounded-[20px] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-2">
            <LinkRow href={CV} label="CV, PDF" />
            <LinkRow href={LINKEDIN} label="LinkedIn" />
            <LinkRow
              onClick={copy}
              label={EMAIL}
              ariaLabel={`Copy email address, ${EMAIL}`}
              trailing={<CopyGlyph copied={copied} />}
            />
          </div>
          <CopiedStatus copied={copied} />
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-2 border-t border-[var(--v2-line)] pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-label)] md:mt-20 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} · Julian Giraldo</span>
        <span>Berlin · 52.5200°N 13.4050°E</span>
      </div>
    </footer>
  );
}

/* The footer rows: a bar wipes across from the left and the label rolls with
   it, so the whole row commits at once instead of just changing colour. */
function LinkRow({
  href,
  onClick,
  label,
  trailing,
  ariaLabel,
  className = "",
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  trailing?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}) {
  const external = !!href && (href.startsWith("http") || href.endsWith(".pdf"));

  const shared = {
    "aria-label": ariaLabel,
    initial: "rest",
    whileHover: "on",
    whileFocus: "on",
    whileTap: { scale: 0.98 },
    className: `group relative isolate flex w-full min-h-[48px] items-center justify-between gap-3 overflow-hidden rounded-[12px] px-4 text-left font-mono text-[11px] uppercase tracking-[0.14em] ${className}`,
  };

  const inner = (
    <>
      <motion.span
        aria-hidden
        variants={{ rest: { scaleX: 0 }, on: { scaleX: 1 } }}
        transition={{ duration: DURATION.flood, ease: EASE }}
        className="absolute inset-0 -z-10 origin-left bg-[var(--v2-invert-bg)]"
      />
      <motion.span
        variants={{ rest: { color: "var(--v2-ink)" }, on: { color: "var(--v2-invert-ink)" } }}
        transition={{ duration: DURATION.hover, ease: EASE }}
        className="relative block h-[1.15em] flex-1 overflow-hidden text-left"
      >
        <motion.span
          variants={{ rest: { y: "0%" }, on: { y: "-50%" } }}
          transition={{ duration: DURATION.flood, ease: EASE }}
          className="block"
        >
          <span className="block truncate leading-[1.15em]">{label}</span>
          <span aria-hidden className="block truncate leading-[1.15em]">
            {label}
          </span>
        </motion.span>
      </motion.span>
      {external && <span className="sr-only">(opens in new tab)</span>}
      {/* the arrow travels the way the link does; a glyph that means something
          else, like the copy mark, only changes colour */}
      <motion.span
        aria-hidden
        variants={
          trailing
            ? {
                rest: { color: "var(--v2-label)" },
                on: { color: "var(--v2-invert-ink)" },
              }
            : {
                rest: { x: 0, y: 0, color: "var(--v2-label)" },
                on: { x: 3, y: -3, color: "var(--v2-invert-ink)" },
              }
        }
        transition={{ duration: DURATION.hover, ease: EASE }}
        className="relative flex shrink-0 items-center"
      >
        {trailing ?? "↗"}
      </motion.span>
    </>
  );

  if (!href) {
    return (
      <motion.button type="button" onClick={onClick} {...shared}>
        {inner}
      </motion.button>
    );
  }

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...shared}
    >
      {inner}
    </motion.a>
  );
}
