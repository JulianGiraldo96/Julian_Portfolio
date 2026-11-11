"use client";

import Link from "next/link";
import { MotionConfig } from "motion/react";
import { TopBar } from "./TopBar";
import { V2Button } from "./V2Button";
import { SelectedWork } from "./SelectedWork";
import { GiftBand, GiftHint } from "./GiftBand";
import { CV, EMAIL, LINKEDIN, Footer, CopyGlyph, CopiedStatus, useCopyEmail } from "./Footer";

/* Type system is the original portfolio's: Outfit (--font-display) light and
   tight for anything that carries a voice, Geist Mono uppercase for labels,
   Geist Sans for running text. Colour comes from the .v2-root tokens in
   globals.css, so light and dark are one stylesheet. */

export function V2Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="v2-root font-sans">
        <TopBar home />
        <main id="main" className="mx-auto max-w-[1240px] px-5 md:px-8">
          <Intro />
          <SelectedWork />
          <GiftBand />
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
          <GiftHint />
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

