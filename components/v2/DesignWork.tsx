"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DURATION, EASE, ENERGY, POP, SPRING } from "./motion";
import { CursorChip } from "./Playful";
import { Drift, Tilt } from "./Tilt";

/* The Design view: identity work, shown as pieces rather than case studies.

   Every tile arrives the same way: a curtain in the page colour lifts off it
   while the piece underneath settles from a slight zoom, the way a print is
   uncovered rather than faded in. Both are transforms (the curtain scales to
   nothing, the media scales to 1), so nothing here lays out or repaints, and
   no filter is involved anywhere. The Meinerva wordmark wipes sideways
   instead, so it reads as being lettered. The Savee icon follows the pointer
   on a spring, the one tile that answers the hand, because it is the one
   object here that is meant to be touched.

   Only real pieces: the Savee and Meinerva identities, the personal banner,
   and the food brands as text until their files are archived.

   Savee and Meinerva open. A click on either tile, or on the project's own
   button, unfolds a panel under its row: what the identity had to do, what
   was made, and the screens it ended up on, with a way through to the full
   case study. One opens at a time. The panel only fades and rises; the rows
   below it glide to their new place on a layout animation, which motion runs
   as a transform, so opening never jumps the page. */

type Tile = {
  id: string;
  span: string;
  caption: string;
  note: string;
};

const tiles: Tile[] = [
  {
    id: "savee-hero",
    span: "md:col-span-8",
    caption: "Savee · Brand",
    note: "Wordmark and splash screen, shown on the device it lives on.",
  },
  {
    id: "savee-icon",
    span: "md:col-span-4",
    caption: "Savee · App icon",
    note: "One fork, frosted glass on the brand green.",
  },
  {
    id: "meinerva-wordmark",
    span: "md:col-span-5",
    caption: "Meinerva · Wordmark",
    note: "Dotted lettering for the thesis project, set in halftone like the app holds its art.",
  },
  {
    id: "meinerva-icon",
    span: "md:col-span-7",
    caption: "Meinerva · App icon",
    note: "The M monogram, checked where it actually lives: a home screen.",
  },
  {
    id: "banner",
    span: "md:col-span-12",
    caption: "Personal identity",
    note: "Type driven banner and profile system.",
  },
];

/* the switch shows this beside the tab label */
export const designCount = tiles.length + 1;

type Detail = {
  id: "savee" | "meinerva";
  title: string;
  meta: string;
  intro: string;
  made: string[];
  href: string;
  shots: { src: string; alt: string }[];
};

const details: Record<Detail["id"], Detail> = {
  savee: {
    id: "savee",
    title: "Savee",
    meta: "2025 · University · Brand and UI",
    intro:
      "A recipe app built on short videos, so the identity has to hold up at thumbnail size inside a moving feed: a heavy wordmark, one green, and a fork that doubles as the switch between watching and cooking.",
    made: ["Wordmark", "App icon", "Splash screen", "UI kit", "Prototype"],
    href: "/work/savee",
    shots: [
      {
        src: "/projects/savee/logo.webp",
        alt: "Savee splash screen, the white wordmark on brand green",
      },
      {
        src: "/projects/savee/1.webp",
        alt: "Onboarding question about diet, with one pill per eating style",
      },
      {
        src: "/projects/savee/2.webp",
        alt: "The feed, a recipe short playing full screen",
      },
      {
        src: "/projects/savee/3.webp",
        alt: "Choosing a cooking date for a saved recipe",
      },
      {
        src: "/projects/savee/shopping-list.webp",
        alt: "The shopping list, grouped by aisle with ticked items struck through",
      },
      {
        src: "/projects/savee/process/search.webp",
        alt: "Search, with cuisines as filters above a grid of shorts",
      },
    ],
  },
  meinerva: {
    id: "meinerva",
    title: "Meinerva",
    meta: "2025 · Thesis · Identity and app",
    intro:
      "Mein plus Minerva: an app that asks you to look before it explains. Every work is held in halftone until you write about it, so the identity is built from the same dots, a lettered M on black that leaves the colour to the art.",
    made: [
      "Wordmark and monogram",
      "App icon",
      "Halftone image system",
      "Prototype",
    ],
    href: "/work/meinerva",
    shots: [
      {
        src: "/projects/meinerva/process/option.webp",
        alt: "Scan the QR code or bring the phone close to unlock the piece",
      },
      {
        src: "/projects/meinerva/wait.webp",
        alt: "The 20 second pause, the phone locked while you look",
      },
      {
        src: "/projects/meinerva/demo/observe.webp",
        alt: "Las Meninas held in halftone, black and white",
      },
      {
        src: "/projects/meinerva/critique.webp",
        alt: "Writing a critique over the halftone work",
      },
      {
        src: "/projects/meinerva/colour.webp",
        alt: "The work unlocked in full colour with hint circles",
      },
      {
        src: "/projects/meinerva/hint.webp",
        alt: "A hint card about Diego Velazquez",
      },
      {
        src: "/projects/meinerva/process/home1.webp",
        alt: "The music journey, an album cover in halftone",
      },
      {
        src: "/projects/meinerva/find-map.webp",
        alt: "A map of Berlin museums and galleries nearby",
      },
    ],
  },
};

export function DesignWork() {
  const byId = Object.fromEntries(tiles.map((t) => [t.id, t]));
  const [open, setOpen] = useState<Detail["id"] | null>(null);
  const toggle = (id: Detail["id"]) => setOpen((o) => (o === id ? null : id));

  /* Escape folds whatever is open */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-14 md:gap-20">
        <Project
          detail={details.savee}
          open={open === "savee"}
          onToggle={toggle}
        >
          <Piece
            tile={byId["savee-hero"]}
            index={0}
            onOpen={() => toggle("savee")}
          >
            <Uncover>
              <Media
                src="/design/savee-hero.webp"
                w={1600}
                h={1200}
                alt="The Savee wordmark glowing on a phone held in a dark room"
              />
            </Uncover>
          </Piece>

          <Piece
            tile={byId["savee-icon"]}
            index={1}
            onOpen={() => toggle("savee")}
          >
            <Uncover
              className="v2-tint flex aspect-square items-center justify-center md:aspect-auto md:h-full"
              style={
                {
                  "--tint": "#E9F2EB",
                  "--tint-dark": "#232C25",
                } as React.CSSProperties
              }
            >
              <TiltIcon />
            </Uncover>
          </Piece>
        </Project>

        <Project
          detail={details.meinerva}
          open={open === "meinerva"}
          onToggle={toggle}
        >
          <Piece
            tile={byId["meinerva-wordmark"]}
            index={0}
            onOpen={() => toggle("meinerva")}
          >
            <Uncover
              wipe
              className="flex aspect-[4/3] items-center justify-center bg-[#141417] md:aspect-auto md:h-full"
            >
              <Image
                src="/design/meinerva-wordmark.webp"
                alt="The Meinerva wordmark, an M drawn in dots followed by EINERVA"
                width={577}
                height={232}
                sizes="(min-width: 768px) 30vw, 70vw"
                className="w-[72%] max-w-[420px]"
              />
            </Uncover>
          </Piece>

          <Piece
            tile={byId["meinerva-icon"]}
            index={1}
            onOpen={() => toggle("meinerva")}
          >
            <Uncover>
              <Media
                src="/projects/meinerva/app-icon.webp"
                w={2000}
                h={1334}
                alt="Meinerva app icon on an iPhone home screen"
              />
            </Uncover>
          </Piece>
        </Project>

        <motion.ul
          layout="position"
          className="grid list-none grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-12 md:gap-y-14"
        >
          <Piece tile={byId.banner} index={0}>
            <Uncover>
              <Media
                src="/misc/linkedin-banner.png"
                w={1584}
                h={396}
                alt="Typographic LinkedIn banner reading Julian Giraldo, Product Designer, Berlin"
              />
            </Uncover>
          </Piece>

          {/* the food brands, as words until their files are archived; dates and
              role as the CV gives them */}
          <motion.li
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: DURATION.base, ease: EASE }}
            className="col-span-1 md:col-span-12"
          >
            <Tilt strength={0.35} drift={0}>
              <div className="grain relative grid gap-3 overflow-hidden rounded-[24px] border border-[var(--v2-line)] bg-[var(--v2-surface)] px-6 py-7 md:grid-cols-12 md:items-baseline md:gap-8 md:px-9">
                <span className="relative z-10 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-label)] md:col-span-2">
                  2021 to 2023
                </span>
                <h3 className="relative z-10 font-display text-[21px] font-light leading-[1.16] tracking-[-0.03em] md:col-span-4 md:text-[24px]">
                  Greens · Fresh To Go · Blok Foods
                </h3>
                <p className="relative z-10 max-w-[62ch] text-[14px] leading-relaxed text-[var(--v2-secondary)] md:col-span-6">
                  Visual identity and digital design for three food brands in the
                  Greens Group, Malta: brand websites, typography, photography,
                  video, animation and packaging. Senior Graphic Designer.
                </p>
              </div>
            </Tilt>
          </motion.li>
        </motion.ul>
      </div>
    </LayoutGroup>
  );
}

/* One project: a header line with its open button, its row of tiles, and the
   panel that unfolds under them. */
function Project({
  detail,
  open,
  onToggle,
  children,
}: {
  detail: Detail;
  open: boolean;
  onToggle: (id: Detail["id"]) => void;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = `design-${detail.id}`;

  /* bring the opened panel up into view, unless it already is */
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      const el = panelRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.55) return;
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -120 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <motion.section layout="position" aria-label={detail.title}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--v2-label)]">
          <span className="text-[var(--v2-ink)]">{detail.title}</span>
          <span className="hidden sm:inline">{detail.meta}</span>
        </span>
        <motion.button
          type="button"
          onClick={() => onToggle(detail.id)}
          aria-expanded={open}
          aria-controls={panelId}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: DURATION.press }}
          className="flex min-h-[36px] items-center gap-2 rounded-full border border-[var(--v2-line)] px-4 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-200 hover:border-[var(--v2-line-strong)]"
        >
          {/* the label rolls: "Open project" slides up out of a clipped line
              and "Close" follows it in, so the button changes its mind as
              one movement instead of swapping text */}
          <span className="relative block h-[1.2em] overflow-hidden leading-[1.2em]">
            <motion.span
              animate={{ y: open ? "-50%" : "0%" }}
              transition={{ duration: DURATION.fast, ease: ENERGY }}
              className="block"
            >
              <span className="block" aria-hidden={open}>
                Open project
              </span>
              <span className="block" aria-hidden={!open}>
                Close
              </span>
            </motion.span>
          </span>
          <motion.span
            aria-hidden
            animate={{ rotate: open ? 135 : 0 }}
            transition={POP}
            className="inline-block text-[14px] leading-none"
          >
            +
          </motion.span>
        </motion.button>
      </div>

      <CursorChip label={open ? "Close ×" : "Open +"}>
        <ul className="grid list-none grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-12 md:gap-y-14">
          {children}
        </ul>
      </CursorChip>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            ref={panelRef}
            id={panelId}
            key="panel"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.7, ease: ENERGY },
            }}
            exit={{
              opacity: 0,
              y: 16,
              scale: 0.98,
              transition: { duration: DURATION.hover, ease: EASE },
            }}
            style={{ transformOrigin: "50% 0%" }}
            className="mt-8 md:mt-10"
          >
            <ProjectPanel detail={detail} onClose={() => onToggle(detail.id)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* What the identity had to do, what was made, and the screens it lives on.
   Everything inside slides in from the right on the energy curve, one piece
   after another, the way a drawer's links follow the drawer: text first, the
   chips popping in, then the strip of screens laid down left to right. */
function ProjectPanel({
  detail,
  onClose,
}: {
  detail: Detail;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const slide = (i: number, x = 40) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, x },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.7, delay: 0.06 + i * 0.05, ease: ENERGY },
        };
  return (
    <div className="grain relative overflow-hidden rounded-[24px] border border-[var(--v2-line)] bg-[var(--v2-surface)]">
      <div className="relative z-10 grid gap-8 px-6 pb-2 pt-7 md:grid-cols-12 md:gap-10 md:px-9 md:pt-9">
        <div className="md:col-span-7">
          <motion.h3
            {...slide(0)}
            className="font-display text-[28px] font-light leading-[1.1] tracking-[-0.03em] md:text-[36px]"
          >
            {detail.title}
          </motion.h3>
          <motion.p
            {...slide(1)}
            className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-label)]"
          >
            {detail.meta}
          </motion.p>
          <motion.p
            {...slide(2)}
            className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-[var(--v2-secondary)]"
          >
            {detail.intro}
          </motion.p>
        </div>
        <div className="flex flex-col justify-between gap-6 md:col-span-5">
          <div>
            <motion.p
              {...slide(3)}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-label)]"
            >
              Made
            </motion.p>
            <ul className="mt-3 flex list-none flex-wrap gap-2">
              {detail.made.map((m, i) => (
                <motion.li
                  key={m}
                  initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...POP, delay: 0.25 + i * 0.05 }}
                  className="rounded-full border border-[var(--v2-line)] px-3 py-1.5 text-[13px]"
                >
                  {m}
                </motion.li>
              ))}
            </ul>
          </div>
          <motion.div
            {...slide(5)}
            className="flex flex-wrap items-center gap-3"
          >
            <Link
              href={detail.href}
              className="group/cta flex min-h-[40px] items-center gap-2 rounded-full bg-[var(--v2-invert-bg)] px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-invert-ink)]"
            >
              Full case study
              <span
                aria-hidden
                className="inline-block transition-transform duration-200 group-hover/cta:translate-x-1"
              >
                →
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-secondary)] transition-colors duration-200 hover:text-[var(--v2-ink)]"
            >
              Close
            </button>
          </motion.div>
        </div>
      </div>

      {/* the screens, as a strip that scrolls sideways on narrow screens */}
      <ul className="relative z-10 flex list-none snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 pb-7 pt-7 [scrollbar-width:none] md:gap-4 md:scroll-px-9 md:px-9 md:pb-9">
        {detail.shots.map((s, i) => (
          <motion.li
            key={s.src}
            initial={reduced ? false : { opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: ENERGY }}
            className="w-[148px] shrink-0 snap-start md:w-[172px]"
          >
            <Tilt radius={20} strength={1.6} drift={0}>
              <div className="overflow-hidden rounded-[20px] border border-[var(--v2-line)] bg-black">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={390}
                  height={844}
                  sizes="172px"
                  className="block h-auto w-full"
                />
              </div>
            </Tilt>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function Piece({
  tile,
  index,
  onOpen,
  children,
}: {
  tile: Tile;
  index: number;
  /* a tile that belongs to an openable project opens it on click; the
     project's own button is the keyboard and screen reader route */
  onOpen?: () => void;
  children: React.ReactNode;
}) {
  return (
    <li className={`col-span-1 flex flex-col ${tile.span}`}>
      <figure
        onClick={onOpen}
        className={`group flex h-full flex-col ${onOpen ? "cursor-pointer" : ""}`}
      >
        {/* every piece is a focused tile: it tips toward the pointer and its
            art drifts behind the glass, the same as the home page's shelf */}
        <Tilt
          className="min-h-0 flex-1"
          strength={tile.span.includes("12") ? 0.45 : 0.8}
          drift={6}
        >
          {children}
        </Tilt>
        <motion.figcaption
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 1 }}
          transition={{
            duration: DURATION.base,
            delay: 0.25 + index * 0.08,
            ease: EASE,
          }}
          className="mt-4 flex flex-col gap-1.5"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
            {tile.caption}
          </span>
          <span className="max-w-[56ch] text-[14px] leading-relaxed text-[var(--v2-secondary)]">
            {tile.note}
          </span>
        </motion.figcaption>
      </figure>
    </li>
  );
}

/* The frame every piece sits in, and the entrance: a page coloured curtain
   that lifts off (or, with `wipe`, draws back to the right) while the content
   settles from 1.08 to 1. */
function Uncover({
  children,
  className = "",
  style,
  wipe = false,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  wipe?: boolean;
}) {
  const reduced = useReducedMotion();
  const view = { once: true, amount: 0.35 } as const;
  const ease = [0.77, 0, 0.175, 1] as const;

  return (
    <div
      className={`v2-card-bezel relative isolate h-full overflow-hidden rounded-[24px] border border-[var(--v2-line)] transition-colors duration-300 group-hover:border-[var(--v2-line-strong)] ${className}`}
      style={style}
    >
      <motion.div
        initial={reduced ? false : { scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={view}
        transition={{ duration: DURATION.draw, ease: EASE }}
        className="flex h-full w-full items-center justify-center"
      >
        <Drift className="flex h-full w-full items-center justify-center">
          {children}
        </Drift>
      </motion.div>
      {!reduced && (
        <motion.span
          aria-hidden
          initial={wipe ? { scaleX: 1 } : { scaleY: 1 }}
          whileInView={wipe ? { scaleX: 0 } : { scaleY: 0 }}
          viewport={view}
          transition={{ duration: DURATION.slow + 0.2, ease }}
          className={`pointer-events-none absolute inset-0 z-10 bg-[var(--v2-bg)] ${
            wipe ? "origin-right" : "origin-top"
          }`}
        />
      )}
    </div>
  );
}

/* a photo or flat piece at its own aspect ratio, so the frame is always the
   image's shape and nothing letterboxes; it leans in a little on hover */
function Media({
  src,
  w,
  h,
  alt,
}: {
  src: string;
  w: number;
  h: number;
  alt: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      sizes="(min-width: 1240px) 760px, (min-width: 768px) 60vw, 100vw"
      className="block h-auto w-full transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] motion-safe:group-hover:scale-[1.03]"
    />
  );
}

/* The Savee icon tips toward the pointer on a spring and lifts a little while
   the pointer is on it. Driven by motion values, so following the pointer
   never re-renders React. */
function TiltIcon() {
  const reduced = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const lift = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [12, -12]), SPRING);
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), SPRING);
  const s = useSpring(useTransform(lift, [0, 1], [1, 1.06]), SPRING);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
    lift.set(1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
    lift.set(0);
  };

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="flex h-full w-full items-center justify-center [perspective:700px]"
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, scale: s }}
        className="w-[46%] max-w-[220px]"
      >
        <Image
          src="/design/savee-icon.webp"
          alt="Savee app icon, a frosted glass fork on a green rounded square"
          width={640}
          height={640}
          sizes="220px"
          className="block h-auto w-full"
        />
      </motion.div>
    </div>
  );
}
