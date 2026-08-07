"use client";

import Image from "next/image";
import { MotionConfig, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TopBar } from "./TopBar";
import { V2Button } from "./V2Button";
import { EASE, reveal } from "./motion";
import { ProjectFolder } from "./ProjectFolder";
import { academic, professional, showOtherThings } from "./projects";

const EMAIL = "application@juliang.de";
const LINKEDIN = "https://www.linkedin.com/in/julian-gr/";
const CV = "/Julian_Giraldo_CV.pdf";

/* Type system is the original portfolio's: Outfit (--font-display) light and
   tight for anything that carries a voice, Geist Mono uppercase for labels,
   Geist Sans for running text. Colour comes from the .v2-root tokens in
   globals.css, so light and dark are one stylesheet. */

type Tile = {
  kind: "image" | "text";
  span: string;
  ratio?: string;
  src?: string;
  alt?: string;
  years?: string;
  caption: string;
  note: string;
};

const other: Tile[] = [
  {
    kind: "image",
    span: "lg:col-span-2",
    ratio: "aspect-[4/1]",
    src: "/misc/linkedin-banner.png",
    alt: "Typographic LinkedIn banner reading Julian Giraldo, Product Designer, Berlin",
    caption: "Personal identity",
    note: "Type driven banner and profile system.",
  },
  {
    kind: "text",
    span: "lg:col-span-1",
    years: "2019 to 2023",
    caption: "Greens · Fresh To Go · Blok Foods",
    note: "Brand identity, packaging, in store communication, photography and web for three food brands in Malta. Lead designer.",
  },
  {
    kind: "image",
    span: "lg:col-span-1",
    ratio: "aspect-[4/3]",
    src: "/projects/taurus/julian-event.jpg",
    alt: "Julian and a TaurusWebs teammate smiling on a rural road in Colombia",
    caption: "Field research, Colombia",
    note: "On site with the TaurusWebs team before touching a screen.",
  },
  {
    kind: "image",
    span: "lg:col-span-1",
    ratio: "aspect-[4/3]",
    src: "/projects/meinerva/app-icon.webp",
    alt: "Meinerva app icon on an iPhone home screen",
    caption: "Meinerva, app icon",
    note: "Dotted lettering for the thesis project.",
  },
  {
    kind: "image",
    span: "lg:col-span-1",
    ratio: "aspect-[4/3]",
    src: "/projects/taurus/bootcamp-night.jpg",
    alt: "Farmers gathered around laptops during an evening TaurusWebs bootcamp",
    caption: "Livestock bootcamp",
    note: "Field sessions with farmers, Colombia.",
  },
  {
    kind: "text",
    span: "sm:col-span-2 lg:col-span-3",
    years: "ongoing",
    caption: "AI native tooling",
    note: "Working prototypes wired to live data, built with Claude Code. Small automations that remove the annoying parts of the job.",
  },
];

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
        <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
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
          <SelectedWork />
          <AcademicWork />
          {showOtherThings && <OtherThings />}
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

function Intro() {
  const { copied, copy } = useCopyEmail();

  return (
    <section aria-label="Introduction" className="pb-16 pt-16 text-center md:pb-24 md:pt-28">
      <p className="v2-rise flex flex-wrap items-center justify-center gap-2">
        <span className="grain relative inline-flex items-center gap-2 rounded-full bg-[var(--v2-surface)] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-accent)]">
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--v2-accent)]" />
          Open for work
        </span>
        <span className="grain relative inline-block rounded-full bg-[var(--v2-surface)] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-secondary)]">
          Berlin, DE
        </span>
      </p>

      <h1
        className="v2-rise v2-rise-1 mx-auto mt-9 max-w-[900px] text-balance font-display text-[clamp(2.1rem,5vw,4rem)] font-extralight leading-[1.06] tracking-[-0.04em]"
      >
        Product Designer in Berlin. I make dense, data heavy products feel calm
        and usable.
      </h1>

      <p
        className="v2-rise v2-rise-2 mx-auto mt-7 max-w-[560px] text-[16px] leading-relaxed text-[var(--v2-secondary)] md:text-[18px]"
      >
        4 years in product, 8+ years designing. I design products I also use
        myself: the ERP I built at Duo Sicilian Ice Cream runs daily across nine
        locations and six departments.
      </p>

      <p className="v2-rise v2-rise-3 mt-9 flex flex-wrap items-center justify-center gap-2">
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
    </section>
  );
}

function SectionHeading({
  id,
  children,
  aside,
}: {
  id: string;
  children: React.ReactNode;
  aside?: string;
}) {
  return (
    <div className="mb-7 flex items-baseline justify-between gap-4 border-t border-[var(--v2-line)] pt-5">
      <h2 id={id} className="font-mono text-[12px] uppercase tracking-[0.2em]">
        {children}
      </h2>
      {aside && (
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--v2-label)]">
          {aside}
        </span>
      )}
    </div>
  );
}

/* Two grids, not one. Three shipped products, then the university work under
   its own heading: with five cards in a single grid a reader has no way to tell
   which of these ran in a business and which was a thesis.

   Three is an odd count, so the last card takes the whole row. That is why
   TaurusWebs is the wide one. */
function ProjectGrid({
  list,
  offset = 0,
}: {
  list: typeof professional;
  offset?: number;
}) {
  return (
    <ul className="grid list-none grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-5 md:gap-y-16">
      {list.map((p, i) => (
        <ProjectFolder
          key={p.slug}
          project={p}
          index={offset + i}
          wide={i % 2 === 0}
          full={list.length % 2 === 1 && i === list.length - 1}
        />
      ))}
    </ul>
  );
}

function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-24 pb-6">
      <SectionHeading id="work-heading" aside={`${professional.length} shipped`}>
        Selected work
      </SectionHeading>
      <ProjectGrid list={professional} />
    </section>
  );
}

function AcademicWork() {
  return (
    <section
      id="academic"
      aria-labelledby="academic-heading"
      className="scroll-mt-24 pt-16 md:pt-24"
    >
      <SectionHeading id="academic-heading" aside="university">
        Academic projects
      </SectionHeading>
      <ProjectGrid list={academic} offset={professional.length} />
    </section>
  );
}

function OtherThings() {
  return (
    <section id="other" aria-labelledby="other-heading" className="scroll-mt-24 pt-16 md:pt-24">
      <SectionHeading id="other-heading" aside="visual work">
        Design and other things
      </SectionHeading>
      <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {other.map((tile, i) => (
          <motion.li
            key={tile.caption}
            {...reveal}
            transition={{ ...reveal.transition, delay: (i % 3) * 0.06 }}
            className={`col-span-1 ${tile.span}`}
          >
            {tile.kind === "image" ? (
              <figure className="grain group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-[var(--v2-surface)]">
                <div className={`relative w-full overflow-hidden ${tile.ratio}`}>
                  <Image
                    src={tile.src as string}
                    alt={tile.alt as string}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="relative z-10 px-5 py-4">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.16em]">
                    {tile.caption}
                  </span>
                  <span className="mt-2 block text-[14px] leading-relaxed text-[var(--v2-secondary)]">
                    {tile.note}
                  </span>
                </figcaption>
              </figure>
            ) : (
              <div className="grain relative flex h-full flex-col overflow-hidden rounded-[24px] bg-[var(--v2-surface)] px-6 py-7">
                <span className="relative z-10 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-label)]">
                  {tile.years}
                </span>
                <h3 className="relative z-10 mt-3 font-display text-[21px] font-light leading-[1.16] tracking-[-0.03em] md:text-[24px]">
                  {tile.caption}
                </h3>
                <p className="relative z-10 mt-2.5 max-w-[62ch] text-[14px] leading-relaxed text-[var(--v2-secondary)]">
                  {tile.note}
                </p>
              </div>
            )}
          </motion.li>
        ))}
      </ul>
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
      <div className="grid grid-cols-1 gap-8 border-t border-[var(--v2-line)] pt-10 md:grid-cols-12">
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
        </div>

        <div className="w-full space-y-2 md:col-span-7 md:max-w-[460px] md:justify-self-end">
          <LinkRow href={CV} label="CV, PDF" />
          <LinkRow href={LINKEDIN} label="LinkedIn" />
          <LinkRow
            onClick={copy}
            label={EMAIL}
            ariaLabel={`Copy email address, ${EMAIL}`}
            trailing={<CopyGlyph copied={copied} />}
          />
          <CopiedStatus copied={copied} />
          <LinkRow href="/" label="Portfolio v1" />
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
    whileTap: { scale: 0.995 },
    className: `group grain relative isolate flex w-full min-h-[52px] items-center justify-between gap-3 overflow-hidden rounded-2xl bg-[var(--v2-surface)] px-5 text-left font-mono text-[11px] uppercase tracking-[0.14em] ${className}`,
  };

  const inner = (
    <>
      <motion.span
        aria-hidden
        variants={{ rest: { scaleX: 0 }, on: { scaleX: 1 } }}
        transition={{ duration: 0.45, ease: EASE }}
        className="absolute inset-0 -z-10 origin-left bg-[var(--v2-invert-bg)]"
      />
      <motion.span
        variants={{ rest: { color: "var(--v2-ink)" }, on: { color: "var(--v2-invert-ink)" } }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative block h-[1.15em] flex-1 overflow-hidden text-left"
      >
        <motion.span
          variants={{ rest: { y: "0%" }, on: { y: "-50%" } }}
          transition={{ duration: 0.42, ease: EASE }}
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
        transition={{ duration: 0.32, ease: EASE }}
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
