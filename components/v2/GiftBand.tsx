"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { DMG_META, DownloadButton } from "./NotchTunesPage";
import { useIsMac } from "./useIsMac";
import { WALLPAPER } from "./NotchDemo";
import { ENERGY } from "./motion";

/* NotchTunes on the home page: a gift band between the work and the
   contact. A Mac visitor gets the download right here; anyone else gets the
   page that shows it, since a .dmg is no use on a phone. The little notch on
   the left plays, so the band shows the app before it describes it. */

export function GiftBand() {
  const mac = useIsMac();

  return (
    <section aria-labelledby="gift-heading" className="border-t border-[var(--v2-line)] pb-6 pt-14 md:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: ENERGY }}
        className="relative grid grid-cols-1 items-center gap-8 overflow-hidden rounded-[26px] border border-[var(--v2-line)] p-6 md:grid-cols-12 md:gap-8 md:p-10"
        style={{
          background:
            "radial-gradient(90% 120% at 0% 100%, #2F6BFF33, transparent 60%), radial-gradient(70% 100% at 100% 0%, #6B22D62e, transparent 60%), var(--v2-surface)",
        }}
      >
        {/* the screen top, with the widget playing in its notch */}
        <Link
          href="/notchtunes"
          aria-label="See NotchTunes"
          className="group relative block h-[150px] overflow-hidden rounded-[18px] md:col-span-5 md:h-[190px]"
          style={{ background: WALLPAPER }}
        >
          <span className="absolute left-1/2 top-0 flex h-6 w-[250px] -translate-x-1/2 items-center justify-between rounded-b-[10px] bg-black px-[5px] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.08]">
            <span
              className="h-[15px] w-[15px] rounded-[4px]"
              style={{ background: "radial-gradient(70% 70% at 30% 25%, #3DE0FF, transparent 70%), radial-gradient(80% 80% at 80% 90%, #6B22D6, transparent 70%), #2F6BFF" }}
            />
            <span aria-hidden className="flex h-[10px] w-[14px] items-center justify-between pr-[2px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="nt-eq h-[9px] w-[3px] rounded-full bg-[#30d158]"
                  style={{ animationDelay: `${i * -0.37}s`, animationDuration: `${0.9 + i * 0.23}s` }}
                />
              ))}
            </span>
          </span>
          <Image
            src="/notchtunes/icon.svg"
            alt=""
            width={96}
            height={96}
            className="absolute bottom-5 left-1/2 h-16 w-16 -translate-x-1/2 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1 md:h-20 md:w-20"
          />
        </Link>

        <div className="md:col-span-7">
          <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-accent)]">
            <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
              <path d="M2.5 7h11v7h-11zM1.5 4.5h13V7h-13zM8 4.5V14M8 4.5C6.5 1.5 3.8 2 4.6 3.6 5.1 4.5 8 4.5 8 4.5Zm0 0c1.5-3 4.2-2.5 3.4-.9-.5.9-3.4.9-3.4.9Z" />
            </svg>
            A gift for Mac users
          </p>
          <h2 id="gift-heading" className="mt-4 text-balance font-display text-[28px] font-extralight leading-[1.08] tracking-[-0.04em] md:text-[40px]">
            NotchTunes: your music, living in the notch.
          </h2>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[var(--v2-secondary)] md:text-[16px]">
            A free Mac app I designed and built. The cover and a tiny equalizer
            sit in the notch, and the controls are one hover away. Works with
            Apple Music, Spotify, YouTube and YouTube Music.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {mac && <DownloadButton size="md" />}
            <Link
              href="/notchtunes"
              className={`rounded-full px-5 py-3 font-mono text-[11.5px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                mac
                  ? "border border-[var(--v2-line)] text-[var(--v2-secondary)] hover:border-[var(--v2-line-strong)] hover:text-[var(--v2-ink)]"
                  : "bg-[var(--v2-invert-bg)] text-[var(--v2-invert-ink)]"
              }`}
            >
              {mac ? "How it works" : "See it play"} ↗
            </Link>
          </div>
          <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--v2-label)]">
            {mac ? DMG_META : "A Mac app · open juliang.de/notchtunes on your Mac"}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* One line under the hero's buttons, for Mac visitors only: the gift is
   further down the page, and this is how they find out it exists. */
export function GiftHint() {
  const mac = useIsMac();
  if (!mac) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.6, ease: ENERGY }}
      className="mt-5"
    >
      <Link
        href="/notchtunes"
        className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-secondary)] transition-colors duration-200 hover:text-[var(--v2-ink)]"
      >
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
        On a Mac? There is a free app for you
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </motion.p>
  );
}
