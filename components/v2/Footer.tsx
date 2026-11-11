"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DURATION, EASE } from "./motion";

export const EMAIL = "application@juliang.de";
export const LINKEDIN = "https://www.linkedin.com/in/julian-gr/";
export const CV = "/Julian_Giraldo_CV.pdf";

/* The contact footer, shared by the home page and the two work pages, so
   "Contact" in the top bar lands on the same thing wherever it is pressed. */

/* The address is copied, not handed to a mail client: `application@juliang.de`
   forwards but cannot send, and a mailto opens whatever the machine has
   registered, which on a borrowed laptop is usually nothing. Both places that
   show the address use this, so the feedback reads the same in each. */
export function useCopyEmail() {
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
export function CopyGlyph({ copied }: { copied: boolean }) {
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

export function CopiedStatus({ copied }: { copied: boolean }) {
  return (
    <span aria-live="polite" className="sr-only">
      {copied ? "Email address copied to clipboard" : ""}
    </span>
  );
}

export function Footer() {
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
        {trailing ?? "↗︎"}
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
