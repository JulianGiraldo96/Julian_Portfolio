"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useRef, useState } from "react";
import { DURATION, EASE, ENERGY, POP } from "./motion";
import { CursorChip, SplitTitle } from "./Playful";
import { Drift, Tilt } from "./Tilt";

/* The showcase: the design work as key art, the way a streaming service lays
   out a shelf, under a short record of the years spent as a designer before
   product. Wide frames, the image carrying the card, the title set big on a
   dark fade at the bottom.

   Each card behaves like a focused tile on a TV: under a mouse it tips toward
   the pointer and a soft highlight slides across the glass, so the card reads
   as an object with a surface rather than a picture. All of it is transform
   and opacity on motion values, so following the pointer never re-renders
   React and never lays out. Touch and reduced motion get the still card.

   A shelf scrolls sideways with snap on every width, with arrows above it on
   a pointer device, so three cards never squeeze down to thumbnails. */

type Card = {
  title: string;
  eyebrow: string;
  line: string;
  href: string;
  src: string;
  w: number;
  h: number;
  alt: string;
  /* where the crop should hold, as an object-position */
  focus?: string;
  /* a flat piece sits on its own colour instead of being cropped */
  tint?: string;
  /* the width of a tinted piece on its colour; a wordmark wants more room
     than a square icon */
  art?: string;
};

const design: Card[] = [
  {
    title: "CamelWebs",
    eyebrow: "Brand identity · 2024",
    line: "A llama cut out of a mountain, and the guide that keeps it whole.",
    href: "/design/camelwebs",
    src: "/design/camelwebs/logo/04.svg",
    w: 2313,
    h: 344,
    alt: "The CamelWebs logo in white on brand blue",
    tint: "#45A5FD",
    art: "w-[64%]",
  },
  {
    title: "Savee",
    eyebrow: "Brand · 2025",
    line: "A heavy wordmark and one green, built to survive a feed.",
    href: "#design",
    src: "/design/savee-hero.webp",
    w: 1600,
    h: 1200,
    alt: "The Savee wordmark glowing on a phone held in a dark room",
    focus: "50% 45%",
  },
  {
    title: "Meinerva",
    eyebrow: "Identity · 2025",
    line: "A lettered M in halftone dots, the colour left to the art.",
    href: "#design",
    src: "/design/meinerva-wordmark.webp",
    w: 577,
    h: 232,
    alt: "The Meinerva wordmark in dotted script on black",
    tint: "#141417",
    art: "w-[52%] -translate-y-1/3",
  },
  {
    title: "Savee icon",
    eyebrow: "App icon · 2025",
    line: "One fork, frosted glass on the brand green.",
    href: "#design",
    src: "/design/savee-icon.webp",
    w: 640,
    h: 640,
    alt: "Savee app icon, a frosted glass fork on a green rounded square",
    tint: "#1E2A21",
  },
];

export function Showcase() {
  return (
    <section
      aria-labelledby="showcase-heading"
      className="border-t border-[var(--v2-line)] pb-6 pt-14 md:pt-20"
    >
      <h2 id="showcase-heading" className="sr-only">
        Design
      </h2>
      {/* the rows of the record open, and everything under them glides down
          on a layout animation rather than jumping */}
      <LayoutGroup>
        <Shelf title="Design" cards={design} intro={<DesignRecord />} />
      </LayoutGroup>
    </section>
  );
}

/* Where the eye for brand came from: the design jobs before product, as a
   ledger whose rows open. A row floods with ink from the left on hover the
   way the footer's links do, and a click unfolds what the job was, its lines
   sliding in from the right one after another like a drawer's links. Only
   what the CV says, in its words: the web follows the CV, never the other
   way round. */
type Job = {
  when: string;
  role: string;
  org: string;
  tags: string[];
  lines: string[];
};

const record: Job[] = [
  {
    when: "2021 to 2023",
    role: "Senior Graphic Designer",
    org: "Greens Supermarket, Swieqi, Malta",
    tags: ["Greens Supermarket", "Fresh To Go", "Blok Foods"],
    lines: [
      "Led visual identity and digital design across three food brands in the Greens Group.",
      "Designed and launched several brand websites, and led the identity system across typography, photography, video, animation and packaging.",
      "Built the guidelines that held output consistent across the creative team.",
    ],
  },
  {
    when: "2019",
    role: "Lead Animator",
    org: "Sanitas Medical Center, Colombia",
    tags: ["Animation", "Freelance"],
    lines: ["February to May 2019."],
  },
];

function DesignRecord() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mb-8 grid gap-6 md:mb-10 md:grid-cols-12 md:gap-8">
      <motion.p
        layout="position"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: DURATION.base, delay: 0.08, ease: EASE }}
        className="max-w-[44ch] self-start text-[15px] leading-relaxed text-[var(--v2-secondary)] md:col-span-5 md:text-[16px]"
      >
        8+ years in design overall. Before product, I led visual identity and
        digital design for three food brands in Malta: Greens Supermarket, Fresh
        To Go and Blok Foods, across typography, photography, video, animation
        and packaging.
      </motion.p>
      <motion.ul
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.4 }}
        transition={{ staggerChildren: 0.07, delayChildren: 0.15 }}
        className="list-none overflow-x-clip border-t border-[var(--v2-line)] md:col-span-7"
      >
        {record.map((r, i) => (
          <JobRow
            key={r.org}
            job={r}
            open={open === i}
            onToggle={() => setOpen((o) => (o === i ? null : i))}
          />
        ))}
      </motion.ul>
    </div>
  );
}

function JobRow({
  job,
  open,
  onToggle,
}: {
  job: Job;
  open: boolean;
  onToggle: () => void;
}) {
  const id = `job-${job.org.split(",")[0].replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <motion.li
      layout="position"
      variants={{
        hidden: { opacity: 0, x: 40 },
        shown: { opacity: 1, x: 0 },
      }}
      transition={{ duration: 0.7, ease: ENERGY }}
      className="border-b border-[var(--v2-line)]"
    >
      <motion.button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        initial="rest"
        animate={open ? "on" : "rest"}
        whileHover="on"
        whileFocus="on"
        whileTap={{ scale: 0.985 }}
        className="relative isolate grid w-full grid-cols-[7.5rem_1fr_auto] items-baseline gap-x-4 gap-y-0.5 overflow-hidden rounded-[12px] px-3 py-3.5 text-left md:grid-cols-[8.5rem_1fr_auto_auto]"
      >
        <motion.span
          variants={{
            rest: { color: "var(--v2-label)" },
            on: { color: "var(--v2-ink)" },
          }}
          transition={{ duration: DURATION.hover }}
          className="font-mono text-[11px] uppercase tracking-[0.14em]"
        >
          {job.when}
        </motion.span>
        <motion.span
          variants={{
            rest: { x: 0 },
            on: { x: 6 },
          }}
          transition={{ duration: 0.45, ease: ENERGY }}
          className="text-[14px] text-[var(--v2-ink)]"
        >
          {job.role}
        </motion.span>
        <motion.span
          variants={{
            rest: { color: "var(--v2-secondary)" },
            on: { color: "var(--v2-ink)" },
          }}
          transition={{ duration: DURATION.hover }}
          className="col-start-2 row-start-2 text-[13px] md:col-start-auto md:row-start-auto md:text-right"
        >
          {job.org}
        </motion.span>
        <motion.span
          aria-hidden
          variants={{
            rest: { color: "var(--v2-label)" },
            on: { color: "var(--v2-ink)" },
          }}
          className="col-start-3 row-start-1 self-center md:col-start-auto md:row-start-auto"
        >
          <motion.span
            animate={{ rotate: open ? 135 : 0 }}
            transition={POP}
            className="inline-block text-[16px] leading-none"
          >
            +
          </motion.span>
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="px-3 pb-5 pt-3"
          >
            <ul className="flex list-none flex-wrap gap-1.5 md:pl-[9.5rem]">
              {job.tags.map((t, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, scale: 0.5, rotate: -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ ...POP, delay: 0.05 + i * 0.06 }}
                  className="rounded-full bg-[var(--v2-accent)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-black"
                >
                  {t}
                </motion.li>
              ))}
            </ul>
            <ul className="mt-3 flex list-none flex-col gap-1.5 md:pl-[9.5rem]">
              {job.lines.map((l, i) => (
                <motion.li
                  key={l}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.12 + i * 0.06,
                    ease: ENERGY,
                  }}
                  className="max-w-[58ch] text-[14px] leading-relaxed text-[var(--v2-secondary)]"
                >
                  {l}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function Shelf({
  title,
  cards,
  intro,
}: {
  title: string;
  cards: Card[];
  intro?: React.ReactNode;
}) {
  const track = useRef<HTMLUListElement>(null);

  /* one card's width plus the gap, so an arrow always lands on a card */
  const step = (dir: 1 | -1) => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    el.scrollBy({ left: dir * (first.offsetWidth + 20), behavior: "smooth" });
  };

  return (
    <div>
      <SplitTitle
        text={title}
        className="mb-5 font-display text-[34px] font-extralight leading-none tracking-[-0.045em] md:mb-7 md:text-[56px]"
      />

      {intro}

      {/* the arrows sit on the shelf they move, not up by the title, where
          the record would come between them */}
      <div className="mb-3 hidden justify-end gap-2 [@media(pointer:fine)]:flex">
        <Arrow label={`Previous in ${title}`} onClick={() => step(-1)} flip />
        <Arrow label={`Next in ${title}`} onClick={() => step(1)} />
      </div>

      {/* the track bleeds to both edges of the window, not just past the
          gutter, so the next card peeks in from the page edge, the cue that
          there is more to the shelf; the padding puts the first card back on
          the column. Scroll padding resolves % against the track itself, so
          the snap line is worked out from the 1240px page column instead */}
      {/* the reveal is driven by the track, not each card: a card waiting
          off to the side would never count as in view and never appear */}
      <CursorChip label="View ↗">
        <motion.ul
          ref={track}
          layout="position"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.1 }}
          className="-mx-5 flex list-none snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-10 pt-2 [scrollbar-width:none] md:mx-[calc(50%-50vw)] md:scroll-px-[calc((100vw_-_min(100vw,1240px))/2_+_2rem)] md:px-[calc(50vw-50%)]"
        >
          {cards.map((c) => (
            <motion.li
              key={c.title}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.96 },
                shown: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: DURATION.slow, ease: EASE }}
              className="w-[84%] shrink-0 snap-start sm:w-[62%] lg:w-[46%]"
            >
              <PosterCard card={c} />
            </motion.li>
          ))}
        </motion.ul>
      </CursorChip>
    </div>
  );
}

function Arrow({
  label,
  onClick,
  flip = false,
}: {
  label: string;
  onClick: () => void;
  flip?: boolean;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: DURATION.press }}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--v2-line)] text-[var(--v2-secondary)] transition-colors duration-200 hover:border-[var(--v2-line-strong)] hover:text-[var(--v2-ink)]"
    >
      <span aria-hidden className={flip ? "-scale-x-100" : ""}>
        →
      </span>
    </motion.button>
  );
}

/* The focused tile (Tilt): tips toward the pointer, lifts, and a highlight
   crosses the glass. The key art drifts a little against the tilt, which is
   what makes the title read as sitting in front of the image. */
function PosterCard({ card }: { card: Card }) {
  /* a design card opens the Work block's Design view: a plain anchor, so the
     hash change reaches WorkSwitch the same way the top bar's link does */
  const Tag = card.href.startsWith("#") ? "a" : Link;

  return (
    <Tilt radius={22}>
      <Tag
        href={card.href}
        className="group relative isolate block aspect-[16/10] overflow-hidden rounded-[22px] border border-white/10 bg-black outline-offset-4"
        style={card.tint ? { background: card.tint } : undefined}
      >
        <Drift className="absolute -inset-4">
          {card.tint ? (
            <div className="flex h-full w-full items-center justify-center pb-[12%]">
              <Image
                src={card.src}
                alt={card.alt}
                width={card.w}
                height={card.h}
                sizes="(min-width: 1024px) 320px, 50vw"
                className={`h-auto ${card.art ?? "w-[34%]"} transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]`}
              />
            </div>
          ) : (
            <Image
              src={card.src}
              alt={card.alt}
              fill
              sizes="(min-width: 1024px) 560px, (min-width: 640px) 62vw, 84vw"
              style={{ objectPosition: card.focus ?? "50% 50%" }}
              className="object-cover transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.05]"
            />
          )}
        </Drift>

        {/* the fade the title sits on, always dark whatever the theme */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 via-40% to-transparent to-75%"
        />

        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white md:p-7">
          <span className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 md:text-[11px]">
              {card.eyebrow}
            </span>
            <span className="mt-2 font-display text-[30px] font-light leading-[0.95] tracking-[-0.045em] md:text-[44px]">
              {card.title}
            </span>
            <span className="mt-2.5 max-w-[36ch] text-[13px] leading-snug text-white/70 md:text-[14px]">
              {card.line}
            </span>
          </span>
          {/* the play button of the shelf: it arrives when the card is
                focused, and stays put on touch where there is no focus */}
          <span
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black transition-[opacity,transform] duration-300 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] [@media(pointer:fine)]:translate-y-2 [@media(pointer:fine)]:opacity-0 [@media(pointer:fine)]:group-hover:translate-y-0 [@media(pointer:fine)]:group-hover:opacity-100 [@media(pointer:fine)]:group-focus-visible:translate-y-0 [@media(pointer:fine)]:group-focus-visible:opacity-100"
          >
            ↗
          </span>
        </span>
      </Tag>
    </Tilt>
  );
}
