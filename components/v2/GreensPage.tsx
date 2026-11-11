"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { TopBar } from "./TopBar";
import { Tilt } from "./Tilt";
import { ENERGY } from "./motion";
import { Label, Paper, Reveal, SectionHead, Segmented, Shot, Stage } from "./BrandKit";
import { Flipbook } from "./Flipbook";

/* Greens Supermarket, the brand as I left it.

   The logo was there before me; what I did to it was a revamp, to two flat
   colours, so the old one appears exactly once, inside the comparison. The
   guide is mine, and so are the social templates, the monthly leaflet, and
   the films I worked on from concept to edit. The leaflets are page captures
   of the published issues, bound here as a native flipbook; the 2017 issue
   is the second edition of the same book, the before. The logo files
   are traced from the guide's vectors, the photography is the guide's own,
   and the pieces in context are mockups drawn here from those files.

   The page opens on an index of what was made, so the whole job reads in one
   glance and each tile jumps to its section.

   Gotham is licensed, so its specimen is an image. Caviar Dreams is free, and
   the route loads it so the mockups can set their labels in it
   (--font-caviar). */

const GREEN = "#76AB42";
const INK = "#231F20";
const LIVE = "https://www.greens.com.mt";
const D = "/design/greens";
const CAVIAR = { fontFamily: "var(--font-caviar)" };

/* the six produce colours, used only as a thin rule under a headline */
const stripe = ["#448DCD", "#278B3D", "#69B030", "#FACE08", "#EC571B", "#D72626"];

/* ---------- content ---------- */

type Made = { href: string; label: string; note: string; src: string; tint?: string; fit?: string };

const made: Made[] = [
  { href: "#revamp", label: "Logo revamp", note: "Two flat colours", src: `${D}/logo/symbol-white.svg`, tint: GREEN, fit: "h-[56%] w-auto" },
  { href: "#guide", label: "Brand guide", note: "Logo, colour, type", src: `${D}/safe-symbol.webp`, tint: "#FFFFFF", fit: "h-[84%] w-auto" },
  { href: "#social", label: "Social", note: "Templates and posts", src: `${D}/post-open.webp` },
  { href: "#magazine", label: "Offers leaflet", note: "Every month, on the guide", src: `${D}/leaflet/new-1.webp`, fit: "object-top" },
  { href: "#video", label: "Video", note: "Concept to edit", src: `${D}/video/christmas.webp` },
  { href: "#context", label: "In use", note: "Ten mockups", src: `${D}/photo-yellow.webp` },
];

type Way = "colour" | "ink" | "dark" | "white";

const ways: { id: Way; label: string; bg: string }[] = [
  { id: "colour", label: "Primary", bg: "#FFFFFF" },
  { id: "ink", label: "One colour", bg: "#FFFFFF" },
  { id: "dark", label: "On ink", bg: INK },
  { id: "white", label: "Reversed", bg: GREEN },
];

const lockups: { id: string; name: string; use: string; w: number; h: number; size: string; span: string }[] = [
  {
    id: "horizontal",
    name: "Primary",
    use: "The default. Signs, the site, bags, print.",
    w: 776,
    h: 290,
    size: "w-[62%]",
    span: "sm:col-span-2",
  },
  { id: "stacked", name: "Secondary", use: "Square spaces: social, labels, vans.", w: 302, h: 466, size: "w-[30%]", span: "" },
  { id: "symbol", name: "Symbol", use: "Avatars, favicons, small sizes.", w: 302, h: 403, size: "w-[28%]", span: "" },
];

type Colour = { name: string; hex: string; rgb: string; print: string; steps: number[]; ink: string };

const colours: Colour[] = [
  { name: "Greenful", hex: GREEN, rgb: "118 171 66", print: "Pantone 154-15 U · C60 M13 Y100 K1", steps: [10, 30, 50, 70, 100], ink: "#fff" },
  { name: "Ink", hex: INK, rgb: "35 31 32", print: "Pantone Process Black U · K100", steps: [10, 30, 50, 70, 95], ink: "#fff" },
];

/* a tint is the colour laid over white at that strength */
const tint = (hex: string, pct: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map((c) => Math.round(255 - (255 - c) * (pct / 100)));
  return "#" + ch.map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase();
};

const photos: { src: string; alt: string; caption: string }[] = [
  { src: "photo-yellow", alt: "A woman sitting cross legged on a yellow field, framed by a giant white Greens g with its green leaf", caption: "The symbol as a frame" },
  { src: "photo-banana-pink", alt: "The white Greens logo over a half peeled banana on pink", caption: "White on a colour field" },
  { src: "photo-mandarin", alt: "A small white Greens logo beside a mandarin on blue", caption: "Small, beside the subject" },
  { src: "photo-citrus", alt: "Two photos side by side, oranges and sliced grapefruit, each with the Greens logo in a box", caption: "Boxed on a busy photo" },
  { src: "photo-banana", alt: "The secondary Greens logo in ink above a banana on white", caption: "Ink on white" },
  { src: "photo-cherries", alt: "Two cherries on white, the green Greens symbol in the corner and on an ink panel", caption: "The symbol in the corner" },
];

const posts: { src: string; w: number; h: number; alt: string; caption: string }[] = [
  {
    src: "post-open",
    w: 1080,
    h: 1080,
    alt: "Post on green: We are open all day, over the six colour stripe, with the opening hours of Greens and Little Greens and a woman holding two Greens bags",
    caption: "Opening hours",
  },
  {
    src: "post-pears",
    w: 1127,
    h: 1127,
    alt: "Post on green: Peeled prickly pears, offer of the weekend, the fruit inside a white frame with cactus and flowers around it",
    caption: "Offer of the weekend",
  },
  {
    src: "post-hiring",
    w: 1600,
    h: 1333,
    alt: "Post: We're hiring, situation vacant driver, location Greens Supermarket Malta, beside a smiling driver at the wheel of a white van",
    caption: "Hiring",
  },
];

/* issue 122, April 2023, on the guide; the June 2017 issue is the before */
const leaflet = [
  { src: `${D}/leaflet/new-1.webp`, alt: "Cover of the Greens offers leaflet, issue 122, April 2023: the logo and free parking on a green band, nine product tiles with round price pills and department tags for butcher, deli, fish, bakery and fruit, a dark band of home goods, and Open until midnight at the foot" },
  { src: `${D}/leaflet/new-2.webp`, alt: "Promotions page of the April 2023 leaflet: a grid of grocery tiles, each a product photo with a green price pill, the old price struck through and red money off tags" },
  { src: `${D}/leaflet/new-3.webp`, alt: "Second promotions page of the April 2023 leaflet: drinks, wine and household products in the same tile grid" },
  { src: `${D}/leaflet/new-4.webp`, alt: "Back page of the April 2023 leaflet: a Sunday roast offer set in thin type on a wood photo, with partner adverts beside and below it" },
];

const leafletBefore = [
  { src: `${D}/leaflet/old-1.webp`, alt: "Cover of the Greens leaflet from June 2017, before the guide: a gradient logo, Open all day in heavy condensed type and loose product cut outs with red price flashes" },
  { src: `${D}/leaflet/old-2.webp`, alt: "Inside page of the June 2017 leaflet: products and prices placed freely on white" },
  { src: `${D}/leaflet/old-3.webp`, alt: "Inside page of the June 2017 leaflet: household products with red and green price boxes, and a bakery banner at the foot" },
  { src: `${D}/leaflet/old-4.webp`, alt: "Back page of the June 2017 leaflet" },
];

type Film = { src: string; w: number; h: number; title: string; note: string; silent?: boolean; span: string };

const films: Film[] = [
  { src: "mothers-day", w: 1280, h: 720, title: "Mother's Day", note: "In store film, 1 min", span: "md:col-span-6" },
  { src: "platters", w: 1276, h: 720, title: "Summer platters", note: "Boat day film, 1 min", span: "md:col-span-6" },
  { src: "christmas", w: 540, h: 960, title: "Christmas", note: "Vertical film, 5 min", span: "md:col-span-4" },
  { src: "little-greens", w: 720, h: 1280, title: "Little Greens", note: "Open till midnight, motion", silent: true, span: "md:col-span-4" },
];

/* ---------- pieces ---------- */

function Stripe({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`flex ${className}`}>
      {stripe.map((c) => (
        <i key={c} className="h-full flex-1" style={{ background: c }} />
      ))}
    </span>
  );
}

/* the films keep their own shape; the short motion piece plays on its own,
   muted, and stops with controls instead when the visitor asked for less
   motion (decided after mount, so the server and the client render alike) */
function FilmCard({ f }: { f: Film }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  /* plays, muted, while it is on screen and pauses when it leaves */
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    /* React leaves the muted attribute out of the server HTML and does not
       set it on hydration, so Safari saw an unmuted video and refused to
       start it; set it on the element before any play() */
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    let seen = false;
    const io = new IntersectionObserver(
      ([e]) => {
        seen = e.isIntersecting;
        if (seen) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    /* Safari in Low Power Mode refuses every autoplay until the page has
       had a click or a key. On the first one, start the film if it is in
       view, or start and stop it so later scroll-ins are allowed to play */
    const unlock = () => {
      v.play()
        .then(() => {
          if (!seen) v.pause();
        })
        .catch(() => {});
    };
    const once = { once: true, capture: true } as const;
    window.addEventListener("pointerdown", unlock, once);
    window.addEventListener("keydown", unlock, once);
    window.addEventListener("touchend", unlock, once);
    return () => {
      io.disconnect();
      window.removeEventListener("pointerdown", unlock, once);
      window.removeEventListener("keydown", unlock, once);
      window.removeEventListener("touchend", unlock, once);
    };
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <figure>
      <div className="relative overflow-hidden rounded-[20px] border border-[var(--v2-line)] bg-black">
        <video
          ref={ref}
          src={`${D}/video/${f.src}.mp4`}
          poster={`${D}/video/${f.src}.webp`}
          width={f.w}
          height={f.h}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={toggle}
          aria-label={`${f.title}, ${f.note}`}
          className="block h-auto w-full cursor-pointer"
        />
        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label={`Play ${f.title}`}
            className="absolute inset-0 m-auto grid size-14 place-items-center rounded-full bg-white/90 text-[18px] text-black"
          >
            ▶︎
          </button>
        )}
        {!f.silent && (
          <button
            type="button"
            onClick={() => {
              const v = ref.current;
              if (v) v.muted = !muted;
              setMuted(!muted);
            }}
            aria-pressed={!muted}
            aria-label={muted ? `Turn sound on for ${f.title}` : `Turn sound off for ${f.title}`}
            className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white backdrop-blur-md transition-colors duration-200 hover:bg-black/80"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
              {muted ? <path d="M17 9l5 6M22 9l-5 6" /> : <path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" />}
            </svg>
            {muted ? "Sound off" : "Sound on"}
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-[15px] font-medium">{f.title}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">{f.note}</span>
      </figcaption>
    </figure>
  );
}

/* ---------- sections ---------- */

/* the two issues side by side at the same size: now on the left, 2017 on
   the right */
function Leaflets() {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
      <Flipbook pages={leaflet} label="2023 · Issue 122" sizes="(min-width: 1240px) 290px, (min-width: 768px) 24vw, 50vw" />
      <Flipbook pages={leafletBefore} label="2017 · Before" sizes="(min-width: 1240px) 290px, (min-width: 768px) 24vw, 50vw" />
    </div>
  );
}

/* What was made, as six equal tiles, two across, that jump to their
   section: the whole job in one look before any of the detail. */
function Index() {
  return (
    <ul className="grid list-none grid-cols-2 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8">
      {made.map((m, k) => (
        <li key={m.href}>
          <Reveal delay={k * 0.04}>
            <a href={m.href} className="group block">
              <div
                className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[18px] border border-[var(--v2-line)] md:aspect-[16/10]"
                style={m.tint ? { background: m.tint } : undefined}
              >
                {m.tint ? (
                  <Image src={m.src} alt="" width={400} height={400} className={`transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06] ${m.fit}`} />
                ) : (
                  <Image src={m.src} alt="" fill sizes="(min-width: 1240px) 580px, 50vw" className={`object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06] ${m.fit ?? ""}`} />
                )}
              </div>
              <p className="mt-2.5 flex items-baseline justify-between gap-2">
                <span className="text-[14px] font-medium">{m.label}</span>
                <span aria-hidden className="text-[12px] text-[var(--v2-label)] transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </p>
              <p className="text-[13px] text-[var(--v2-secondary)]">{m.note}</p>
            </a>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/* The old logo and the revamp in the same frame, the revamp laid over it at
   the old one's exact size and place (measured from the file), so a drag
   across changes nothing but the drawing. The split is a motion value, so
   following the pointer never re-renders. On first sight it sweeps once to
   show it can be moved. */
function Revamp() {
  const pos = useMotionValue(50);
  const clip = useTransform(pos, (v) => `inset(0 ${100 - v}% 0 0)`);
  const left = useTransform(pos, (v) => `${v}%`);
  const box = useRef<HTMLDivElement>(null);
  const range = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);
  const seen = useInView(box, { once: true, amount: 0.6 });
  const still = useReducedMotion();

  useEffect(() => {
    if (!seen || still) return;
    const run = animate(pos, [50, 82, 22, 50], { duration: 2.4, ease: ENERGY, delay: 0.3 });
    return () => run.stop();
  }, [seen, still, pos]);

  const to = (x: number) => {
    const r = box.current!.getBoundingClientRect();
    const v = Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100));
    pos.set(v);
    if (range.current) range.current.value = String(Math.round(v));
  };

  return (
    <div className="mt-12">
      <div
        ref={box}
        className="relative isolate aspect-[1920/1075] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[24px] border border-[var(--v2-line)]"
        style={{ background: "radial-gradient(70% 70% at 50% 45%,#F4F4F4,#D2D2D2)" }}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          to(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && to(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* after: the revamp, where the old logo sat */}
        <Image
          src={`${D}/logo/horizontal-colour.svg`}
          alt="The revamped Greens logo: a flat ink g and lettering with one green leaf"
          width={776}
          height={290}
          draggable={false}
          className="absolute left-[10.59%] top-[21.89%] h-auto w-[78.56%]"
        />
        {/* before, clipped from the right */}
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          <Image
            src={`${D}/old-logo.webp`}
            alt="The Greens logo before the revamp"
            width={1920}
            height={1075}
            sizes="(min-width: 1240px) 1180px, 100vw"
            draggable={false}
            className="h-full w-full"
          />
        </motion.div>
        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white md:left-6 md:top-6">
          Before
        </span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-full px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white md:right-6 md:top-6" style={{ background: GREEN }}>
          Revamp
        </span>
        <motion.div aria-hidden className="pointer-events-none absolute inset-y-0 w-0" style={{ left }}>
          <span className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.25)]" />
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[13px] text-black shadow-[0_6px_18px_rgba(0,0,0,0.25)]">
            &#8596;
          </span>
        </motion.div>
      </div>
      <input
        ref={range}
        type="range"
        min={0}
        max={100}
        defaultValue={50}
        onChange={(e) => pos.set(Number(e.target.value))}
        aria-label="Compare the logo before and after the revamp"
        className="sr-only"
      />
    </div>
  );
}

function LogoSystem() {
  const [way, setWay] = useState<Way>("colour");
  const w = ways.find((x) => x.id === way)!;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>3.1 · Logo</Label>
          <h3 className="mt-3 font-display text-[24px] font-light tracking-[-0.03em] md:text-[30px]">Three lockups, four colourways.</h3>
        </div>
        <Segmented label="Colourway" items={ways} value={way} onChange={setWay} />
      </div>
      <ul className="mt-6 grid list-none grid-cols-1 gap-4 sm:grid-cols-2">
        {lockups.map((l, k) => (
          <li key={l.id} className={l.span}>
            <Reveal delay={k * 0.05}>
              <div
                className={`flex items-center justify-center rounded-[20px] border border-[var(--v2-line)] transition-colors duration-500 ${l.span ? "aspect-[16/9] sm:aspect-[21/8]" : "aspect-[16/11]"}`}
                style={{ background: w.bg }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={l.id + way}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: ENERGY }}
                    className={`flex justify-center ${l.size}`}
                  >
                    <Image src={`${D}/logo/${l.id}-${way}.svg`} alt={`Greens ${l.name.toLowerCase()} logo, ${w.label.toLowerCase()}`} width={l.w} height={l.h} className="h-auto w-full" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-[15px] font-medium">{l.name}</span>
                <span className="text-[14px] text-[var(--v2-secondary)]">{l.use}</span>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Colours() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1400);
    } catch {
      /* no clipboard, the hex is on the swatch anyway */
    }
  };
  return (
    <div>
      <Label>3.3 · Colour</Label>
      <h3 className="mt-3 font-display text-[24px] font-light tracking-[-0.03em] md:text-[30px]">Two colours, and their tints.</h3>
      <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-[var(--v2-secondary)]">
        Leaf green and ink carry the brand. Each comes in set tints, so a
        background or a table never needs a colour of its own. Click any step to
        copy it.
      </p>
      <ul className="mt-6 grid list-none grid-cols-1 gap-4 md:grid-cols-2">
        {colours.map((c, k) => (
          <li key={c.hex}>
            <Reveal delay={k * 0.05}>
              <div className="overflow-hidden rounded-[20px] border border-[var(--v2-line)]">
                <motion.button
                  onClick={() => copy(c.hex)}
                  whileTap={{ scale: 0.99 }}
                  aria-label={`Copy ${c.name} ${c.hex}`}
                  className="flex aspect-[16/9] w-full flex-col justify-between p-5 text-left md:p-6"
                  style={{ background: c.hex, color: c.ink }}
                >
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] opacity-70">{copied === c.hex ? "Copied" : `0${k + 1}`}</span>
                  <span>
                    <span className="block text-[15px] font-medium">{c.name}</span>
                    <span className="mt-1 block font-mono text-[13px]">{c.hex}</span>
                    <span className="block font-mono text-[11px] opacity-70">RGB {c.rgb}</span>
                    <span className="block font-mono text-[11px] opacity-70">{c.print}</span>
                  </span>
                </motion.button>
                <div className="grid grid-cols-5">
                  {c.steps.map((s) => {
                    const hex = tint(c.hex, s);
                    return (
                      <motion.button
                        key={s}
                        onClick={() => copy(hex)}
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", duration: 0.3, bounce: 0.25 }}
                        aria-label={`Copy ${c.name} at ${s}%, ${hex}`}
                        className="flex h-16 items-end p-2 font-mono text-[10.5px]"
                        style={{ background: hex, color: s >= 50 ? "#fff" : INK }}
                      >
                        {copied === hex ? "Copied" : `${s}%`}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      {/* the stripe */}
      <Reveal className="mt-4">
        <div className="grid grid-cols-1 items-center gap-5 rounded-[20px] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-5 md:grid-cols-12 md:p-6">
          <div className="md:col-span-5">
            <p className="text-[15px] font-medium">The produce stripe</p>
            <p className="mt-1.5 text-[14px] leading-snug text-[var(--v2-secondary)]">
              Six colours from the fruit and veg aisle, only ever as a thin rule
              under a headline. Never a fill, never behind text.
            </p>
          </div>
          <ul className="grid list-none grid-cols-6 md:col-span-7">
            {stripe.map((hex) => (
              <li key={hex}>
                <button onClick={() => copy(hex)} aria-label={`Copy ${hex}`} className="group block w-full text-left">
                  <span className="block h-3 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:scale-y-[2.2]" style={{ background: hex }} />
                  <span className="mt-2 block truncate font-mono text-[10px] text-[var(--v2-label)]">{copied === hex ? "Copied" : hex}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <p aria-live="polite" className="sr-only">{copied ? `${copied} copied to clipboard` : ""}</p>
    </div>
  );
}

/* ---------- mockups, drawn from the final files ---------- */

const SETTLE = "transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]";

function Sign() {
  return (
    <Stage caption="Store sign at night" style={{ background: "linear-gradient(180deg,#18202A 0%,#0D1015 70%)" }}>
      {/* the fascia, lit from inside */}
      <div
        className="absolute left-[10%] right-[10%] top-[16%] flex h-[30%] items-center justify-center rounded-[6px] transition-[box-shadow] duration-700 [box-shadow:0_0_50px_rgba(118,171,66,0.45),inset_0_0_30px_rgba(255,255,255,0.15)] group-hover:[box-shadow:0_0_80px_rgba(118,171,66,0.65),inset_0_0_30px_rgba(255,255,255,0.2)]"
        style={{ background: GREEN }}
      >
        <Image src={`${D}/logo/horizontal-white.svg`} alt="A lit store sign: the white Greens logo on a green fascia at night" width={776} height={290} className="h-auto w-[58%]" />
      </div>
      {/* the shop front under it */}
      <div aria-hidden className="absolute inset-x-[10%] bottom-0 top-[52%] grid grid-cols-4 gap-[2%] border-t-[6px] border-[#2B2F35] bg-[#1F242B] p-[2%]">
        {[0, 1, 2, 3].map((k) => (
          <span key={k} className="rounded-[2px] bg-gradient-to-b from-[#F4E3B5] to-[#C9A867] opacity-80" />
        ))}
      </div>
    </Stage>
  );
}

function Bag() {
  return (
    <Stage caption="Shopping bag" className="flex items-end justify-center" style={{ background: "linear-gradient(170deg,#F4F1EA,#DCD5C8)" }}>
      <div className={`relative mb-[9%] w-[46%] max-w-[230px] group-hover:-translate-y-2 ${SETTLE}`}>
        {/* the handles, two loops of webbing */}
        <span aria-hidden className="absolute -top-[22%] left-[16%] h-[30%] w-[30%] rounded-t-full border-[7px] border-b-0 border-[#73A532]" />
        <span aria-hidden className="absolute -top-[22%] right-[16%] h-[30%] w-[30%] rounded-t-full border-[7px] border-b-0 border-[#73A532]" />
        <div className="relative flex aspect-[5/5.4] flex-col items-center justify-center gap-3 rounded-[3px] bg-[#8CC63F] shadow-[0_28px_40px_-18px_rgba(0,0,0,0.45)]">
          <span aria-hidden className="absolute inset-[5%] rounded-[2px] border border-dashed border-black/15" />
          <Image src={`${D}/logo/stacked-ink.svg`} alt="A green non woven shopping bag with the secondary Greens logo in ink" width={302} height={466} className="relative h-auto w-[34%]" />
          <span className="relative font-mono text-[9px] tracking-[0.08em] text-[#231F20] md:text-[10px]">greens.com.mt</span>
        </div>
      </div>
    </Stage>
  );
}

function ShelfLabel() {
  return (
    <Stage caption="Shelf label" style={{ background: "linear-gradient(180deg,#F6F3EE,#E2DCD1)" }}>
      {/* the shelf edge the label clips onto */}
      <span aria-hidden className="absolute inset-x-0 top-[34%] h-[9%] bg-[#CFC7B9] shadow-[0_10px_14px_-8px_rgba(0,0,0,0.35)]" />
      <div className="absolute left-1/2 top-[30%] w-[62%] max-w-[300px] origin-top -translate-x-1/2 -rotate-2 overflow-hidden rounded-[6px] bg-white shadow-[0_22px_36px_-16px_rgba(0,0,0,0.4)] transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-1">
        <p className="px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white md:text-[12px]" style={{ ...CAVIAR, background: GREEN }}>
          Offer of the weekend
        </p>
        <div className="flex items-end justify-between gap-3 px-4 pb-4 pt-3">
          <div className="min-w-0">
            <p className="text-[13px] leading-tight text-black md:text-[14px]" style={CAVIAR}>
              Prickly pears, peeled
            </p>
            <p className="mt-2 text-[34px] font-bold leading-none text-black md:text-[40px]" style={CAVIAR}>
              €1.99
            </p>
            <p className="mt-1 font-mono text-[9.5px] text-black/55">per 500 g</p>
          </div>
          <Image src={`${D}/logo/symbol-colour.svg`} alt="" width={302} height={403} className="h-auto w-[18%] shrink-0" />
        </div>
        <Stripe className="h-1.5" />
      </div>
      <span className="sr-only">A shelf label: offer of the weekend on a green band, the product and price set in Caviar Dreams, the Greens symbol and the produce stripe along the bottom</span>
    </Stage>
  );
}

function Rewards() {
  return (
    <Stage caption="Rewards card" className="flex items-center justify-center" style={{ background: "linear-gradient(200deg,#E8EEE1,#CDD7C1)" }}>
      <div className="relative aspect-[85/54] w-[54%] max-w-[360px]">
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-[12px] shadow-[0_24px_40px_-18px_rgba(0,0,0,0.5)] [transform:translate(-26%,-16%)_rotate(-9deg)] group-hover:[transform:translate(-34%,-20%)_rotate(-12deg)] ${SETTLE}`}
          style={{ background: GREEN }}
        >
          <Image src={`${D}/logo/symbol-white.svg`} alt="" width={302} height={403} className="h-auto w-[18%]" />
        </div>
        <div
          className={`absolute inset-0 overflow-hidden rounded-[12px] shadow-[0_28px_44px_-18px_rgba(0,0,0,0.6)] [transform:translate(18%,12%)_rotate(4deg)] group-hover:[transform:translate(24%,16%)_rotate(6deg)] ${SETTLE}`}
          style={{ background: INK }}
        >
          <Image src={`${D}/pattern.webp`} alt="" fill sizes="360px" className="object-cover" />
          <div className="relative flex h-full flex-col justify-between p-[7%]">
            <Image src={`${D}/logo/horizontal-dark.svg`} alt="The Greens rewards card: the logo in white and green on the ink pattern" width={776} height={290} className="h-auto w-[46%]" />
            <div className="flex items-end justify-between">
              <span className="text-[15px] font-bold text-white md:text-[17px]" style={CAVIAR}>
                Rewards
              </span>
              <span className="font-mono text-[10px] tracking-[0.12em] text-white/70 md:text-[11px]">•••• 0421</span>
            </div>
          </div>
          <Stripe className="absolute inset-x-0 bottom-0 h-1" />
        </div>
      </div>
    </Stage>
  );
}

function Van() {
  return (
    <Stage caption="Delivery van" style={{ background: "linear-gradient(180deg,#DCE6EE 0%,#EEF2F4 62%,#BFC5CA 62%,#AEB4B9 100%)" }}>
      <div className={`absolute bottom-[20%] left-[7%] right-[7%] h-[50%] group-hover:-translate-x-3 ${SETTLE}`}>
        {/* the body, with the cab rounded at the front */}
        <div className="absolute inset-0 overflow-hidden rounded-[14px_56px_10px_10px] bg-white shadow-[0_24px_30px_-18px_rgba(0,0,0,0.45)]">
          {/* the green sweep along the side */}
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[44%] [clip-path:polygon(0_45%,70%_0,100%_18%,100%_100%,0_100%)]" style={{ background: GREEN }} />
          <span aria-hidden className="absolute right-[4%] top-[9%] h-[34%] w-[17%] rounded-[4px_40px_4px_4px] bg-[#9DB2C2]" />
          <span aria-hidden className="absolute bottom-[6%] right-[23%] top-[9%] w-px bg-black/10" />
          <Image src={`${D}/logo/horizontal-colour.svg`} alt="A white delivery van with the Greens logo and a green sweep along its side" width={776} height={290} className="absolute left-[6%] top-[13%] h-auto w-[36%]" />
          <span className="absolute bottom-[11%] left-[30%] text-[11px] font-bold tracking-[0.06em] text-white md:text-[14px]" style={CAVIAR}>
            greens.com.mt
          </span>
        </div>
        {[16, 74].map((x) => (
          <span key={x} aria-hidden className="absolute -bottom-[16%] aspect-square w-[12%] rounded-full border-[6px] border-[#55595E] bg-[#1C1D1F]" style={{ left: `${x}%` }} />
        ))}
      </div>
    </Stage>
  );
}

function Apron() {
  return (
    <Stage caption="Staff apron" className="flex items-end justify-center" style={{ background: "linear-gradient(180deg,#EDEAE4,#D6D0C5)" }}>
      <div className={`relative w-[42%] max-w-[210px] group-hover:-translate-y-1.5 ${SETTLE}`}>
        <span aria-hidden className="absolute -top-[16%] left-1/2 h-[24%] w-[46%] -translate-x-1/2 rounded-t-full border-[5px] border-b-0" style={{ borderColor: INK }} />
        <div
          className="relative flex aspect-[3/3.8] flex-col items-center pt-[18%] shadow-[0_20px_30px_-16px_rgba(0,0,0,0.45)] [clip-path:polygon(24%_0,76%_0,78%_20%,100%_30%,100%_100%,0_100%,0_30%,22%_20%)]"
          style={{ background: INK }}
        >
          <Image src={`${D}/logo/symbol-dark.svg`} alt="An ink apron with the Greens symbol embroidered in white and green" width={302} height={403} className="h-auto w-[22%]" />
          <span aria-hidden className="absolute bottom-[16%] left-[18%] right-[18%] h-[20%] border-t-2 border-dashed border-white/25" />
          <Stripe className="absolute inset-x-0 bottom-0 h-1.5" />
        </div>
      </div>
    </Stage>
  );
}

function Magazine() {
  const offers = [
    ["€2.45", "-€2"],
    ["€0.99", "-€1"],
    ["€1.49", "-€2"],
    ["€3.95", ""],
  ];
  return (
    <Stage caption="Offers magazine" className="flex items-center justify-center" style={{ background: "linear-gradient(200deg,#E4E9DF,#C8D1BE)" }}>
      <div className="relative aspect-[210/297] w-[38%] max-w-[230px]">
        <span aria-hidden className={`absolute inset-0 rounded-[3px] bg-[#F1F1EE] shadow-[0_18px_30px_-16px_rgba(0,0,0,0.4)] [transform:translate(14%,4%)_rotate(6deg)] group-hover:[transform:translate(22%,6%)_rotate(9deg)] ${SETTLE}`} />
        <div className={`absolute inset-0 flex flex-col overflow-hidden rounded-[3px] bg-white shadow-[0_24px_36px_-16px_rgba(0,0,0,0.45)] [transform:rotate(-3deg)] group-hover:[transform:rotate(-1deg)_translateY(-6px)] ${SETTLE}`}>
          <div className="flex h-[20%] items-center justify-center" style={{ background: GREEN }}>
            <Image src={`${D}/logo/horizontal-white.svg`} alt="The cover of the Greens offers magazine: the logo on green, Hot offers, and four offer cards with price pills" width={776} height={290} className="h-auto w-[58%]" />
          </div>
          <div className="px-[7%] pt-[6%]">
            <p className="text-[16px] font-bold leading-none text-black md:text-[19px]" style={CAVIAR}>
              Hot offers
            </p>
            <p className="mt-1 font-mono text-[7px] text-black/50 md:text-[8px]">Valid till 15.09</p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-[5%] p-[7%]">
            {offers.map(([p, off], k) => (
              <div key={k} className="relative flex flex-col overflow-hidden rounded-[3px] border border-black/10">
                <span className="h-[16%]" style={{ background: GREEN }} />
                <span className="m-[10%] flex-1 rounded-[2px] bg-[#EEF0EA]" />
                {off && <span className="absolute left-0 top-[20%] rounded-r-full bg-[#D72626] px-1 text-[6px] font-bold text-white">{off}</span>}
                <span className="mx-[8%] mb-[8%] rounded-full px-1.5 py-0.5 text-[8px] font-bold text-white md:text-[9px]" style={{ ...CAVIAR, background: GREEN }}>
                  {p}
                </span>
              </div>
            ))}
          </div>
          <Stripe className="h-1" />
        </div>
      </div>
    </Stage>
  );
}

function Profile() {
  const grid = [
    { src: `${D}/post-open.webp`, alt: "" },
    { src: `${D}/post-pears.webp`, alt: "" },
    { src: `${D}/post-hiring.webp`, alt: "" },
    { src: `${D}/photo-yellow.webp`, alt: "" },
    { src: `${D}/video/platters.webp`, alt: "" },
    { src: `${D}/photo-cherries.webp`, alt: "" },
    { src: `${D}/video/mothers-day.webp`, alt: "" },
    { src: `${D}/photo-banana-pink.webp`, alt: "" },
    { src: `${D}/video/little-greens.webp`, alt: "" },
    { src: `${D}/photo-mandarin.webp`, alt: "" },
    { src: `${D}/video/christmas.webp`, alt: "" },
    { src: `${D}/post-pears.webp`, alt: "" },
  ];
  return (
    <Stage caption="Social profile" style={{ background: "linear-gradient(180deg,#EAF3E1,#CDE2B9)" }}>
      {/* a phone rising out of the bottom edge, tall enough to be read as one */}
      <div className={`absolute left-1/2 top-[8%] aspect-[9/19] w-[40%] max-w-[230px] -translate-x-1/2 rounded-[32px] bg-[#111] p-[2.2%] shadow-[0_30px_50px_-20px_rgba(0,0,0,0.5)] group-hover:-translate-y-3 ${SETTLE}`}>
        <div className="h-full overflow-hidden rounded-[26px] bg-white">
          <div className="flex items-center gap-2.5 px-3 pb-2 pt-5">
            <span className="flex aspect-square w-10 shrink-0 items-center justify-center rounded-full" style={{ background: GREEN }}>
              <Image src={`${D}/logo/symbol-white.svg`} alt="" width={302} height={403} className="h-auto w-[40%]" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-black">greens supermarket</p>
              <p className="truncate text-[9.5px] text-black/55">Family supermarket · Malta</p>
            </div>
          </div>
          <Stripe className="mx-3 mb-2 h-0.5" />
          <div className="grid grid-cols-3 gap-px">
            {grid.map((g, k) => (
              <div key={k} className="relative aspect-square">
                <Image src={g.src} alt={g.alt} fill sizes="80px" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="h-6" />
        </div>
      </div>
      <span className="sr-only">A phone showing the Greens social profile: the symbol as the avatar above a grid of the posts</span>
    </Stage>
  );
}

function Receipt() {
  const lines = [
    ["Tomatoes 1kg", "2.10"],
    ["Prickly pears", "1.99"],
    ["Bread, sourdough", "3.20"],
    ["Milk 1L", "1.05"],
  ];
  return (
    <Stage caption="Till receipt" className="flex items-center justify-center" style={{ background: "linear-gradient(200deg,#E7E4DD,#CBC5BA)" }}>
      {/* a till prints one ink, so the receipt is black and grey only */}
      <div className={`w-[44%] grayscale max-w-[210px] rotate-3 bg-white px-[4%] pb-[7%] pt-[6%] font-mono text-[8.5px] text-black shadow-[0_20px_30px_-16px_rgba(0,0,0,0.4)] [mask:linear-gradient(#000,#000)_top/100%_calc(100%-6px)_no-repeat,conic-gradient(from_135deg_at_50%_100%,#000_90deg,transparent_0)_bottom/8px_6px_repeat-x] group-hover:rotate-1 md:text-[9.5px] ${SETTLE}`}>
        <Image src={`${D}/logo/stacked-ink.svg`} alt="A Greens till receipt with the logo in ink, four items, the total and rewards points" width={302} height={466} className="mx-auto h-auto w-[30%]" />
        <p className="mt-2 text-center text-black/55">Malta · greens.com.mt</p>
        <span aria-hidden className="my-2 block border-t border-dashed border-black/25" />
        {lines.map(([a, b]) => (
          <p key={a} className="flex justify-between">
            <span>{a}</span>
            <span>{b}</span>
          </p>
        ))}
        <span aria-hidden className="my-2 block border-t border-dashed border-black/25" />
        <p className="flex justify-between font-bold">
          <span>TOTAL €</span>
          <span>8.34</span>
        </p>
        <p className="mt-1 flex justify-between" style={{ color: "#4F8A1F" }}>
          <span>Rewards points</span>
          <span>+8</span>
        </p>
        <Stripe className="mt-3 h-1" />
        <p className="mt-2 text-center text-[11px] font-bold" style={CAVIAR}>
          Thank you!
        </p>
      </div>
    </Stage>
  );
}

function PaperBag() {
  return (
    <Stage caption="Paper bag" className="flex items-end justify-center gap-[6%]" style={{ background: "linear-gradient(180deg,#F3EFE8,#DED6C9)" }}>
      {[
        { w: "w-[30%]", logo: "stacked-ink", bg: "#C9A57B", tilt: "-rotate-2 group-hover:-rotate-4" },
        { w: "w-[24%]", logo: "symbol-white", bg: GREEN, tilt: "rotate-2 group-hover:rotate-4" },
      ].map((b) => (
        <div key={b.logo} className={`relative mb-[8%] max-w-[180px] ${b.w} ${b.tilt} ${SETTLE}`}>
          <span aria-hidden className="absolute -top-[14%] left-1/2 h-[22%] w-[44%] -translate-x-1/2 rounded-t-full border-[4px] border-b-0 border-[#8E6B44]" />
          <div className="relative flex aspect-[3/3.9] items-center justify-center shadow-[0_22px_30px_-16px_rgba(0,0,0,0.4)]" style={{ background: b.bg }}>
            <span aria-hidden className="absolute inset-x-0 top-0 h-[12%] bg-black/10" />
            <Image src={`${D}/logo/${b.logo}.svg`} alt="" width={302} height={466} className="h-auto w-[34%]" />
          </div>
        </div>
      ))}
      <span className="sr-only">Two paper bags: kraft with the logo in ink, and leaf green with the white symbol</span>
    </Stage>
  );
}

function Mockups() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-12">
      <Reveal className="md:col-span-7"><Sign /></Reveal>
      <Reveal delay={0.06} className="md:col-span-5"><Bag /></Reveal>
      <Reveal className="md:col-span-5"><ShelfLabel /></Reveal>
      <Reveal delay={0.06} className="md:col-span-7"><Van /></Reveal>
      <Reveal className="md:col-span-7"><Rewards /></Reveal>
      <Reveal delay={0.06} className="md:col-span-5"><Apron /></Reveal>
      <Reveal className="md:col-span-5"><Magazine /></Reveal>
      <Reveal delay={0.06} className="md:col-span-7"><Profile /></Reveal>
      <Reveal className="md:col-span-7"><PaperBag /></Reveal>
      <Reveal delay={0.06} className="md:col-span-5"><Receipt /></Reveal>
    </div>
  );
}

/* ---------- page ---------- */

const SECTION = "scroll-mt-24 border-t border-[var(--v2-line)] py-14 md:py-20";

export function GreensPage({ fontClass = "" }: { fontClass?: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={`v2-root font-sans [overflow-x:clip] ${fontClass}`}>
        <TopBar />
        <main id="main" className="mx-auto max-w-[1240px] px-5 md:px-8">
          {/* the brand, and what I did for it */}
          <section aria-labelledby="gr-title" className="grid grid-cols-1 gap-10 pb-16 pt-12 md:grid-cols-12 md:gap-8 md:pb-24 md:pt-20">
            <div className="md:col-span-5 md:pt-4">
              <p className="v2-rise flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-secondary)]">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} />
                <span style={{ color: GREEN }}>Brand</span>
                <span aria-hidden className="text-[var(--v2-label)]">&middot;</span>
                <span>Malta</span>
              </p>
              <h1 id="gr-title" className="v2-rise v2-rise-1 mt-6 text-balance font-display text-[clamp(2.3rem,4.6vw,4rem)] font-extralight leading-[1.04] tracking-[-0.045em]">
                Keeping a family grocer <span className="font-normal">fresh</span>.
              </h1>
              <p className="v2-rise v2-rise-2 mt-6 max-w-[46ch] text-[16px] leading-relaxed text-[var(--v2-secondary)] md:text-[17px]">
                Greens is a family supermarket in Malta. For four years I was its
                designer: I revamped its logo, wrote the brand guide, designed the
                templates the weekly posts are made on, set the monthly offers
                leaflet, and worked on its films from the idea to the edit.
              </p>
              <dl className="v2-rise v2-rise-3 mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--v2-line)] pt-6">
                {[
                  ["Client", "Greens Supermarket"],
                  ["Role", "Graphic, then Senior Graphic Designer"],
                  ["Made", "Logo revamp, guide, social, video"],
                  ["Years", "2019 to 2023"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--v2-label)]">{k}</dt>
                    <dd className="mt-1 text-[15px]">{v}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={LIVE}
                target="_blank"
                rel="noopener noreferrer"
                className="v2-rise v2-rise-3 mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--v2-line)] px-5 py-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--v2-secondary)] transition-colors duration-200 hover:border-[var(--v2-line-strong)] hover:text-[var(--v2-ink)]"
              >
                greens.com.mt ↗︎
              </a>
            </div>
            <div className="v2-rise v2-rise-2 md:col-span-7">
              <Tilt strength={0.5} drift={6}>
                <div className="grain relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[24px]" style={{ background: GREEN }}>
                  <Image src={`${D}/logo/stacked-white.svg`} alt="The secondary Greens logo in white on leaf green" width={302} height={466} priority className="h-auto w-[24%]" />
                  <Stripe className="absolute bottom-[12%] left-1/2 h-1.5 w-[30%] -translate-x-1/2" />
                </div>
              </Tilt>
            </div>
          </section>

          {/* 01 · everything, at a glance */}
          <section aria-label="What I made" className={SECTION}>
            <SectionHead label="01 · What I made" title="The whole job, at a glance." />
            <div className="mt-12">
              <Index />
            </div>
          </section>

          {/* 02 · the revamp */}
          <section id="revamp" aria-label="Revamp" className={SECTION}>
            <SectionHead label="02 · Revamp" title="Same leaf, made flat.">
              I kept the g, the leaf and the thin lettering people already knew, and
              redrew them in two flat colours, ink and leaf green. One exact file
              that works the same on a bag, a shelf label, a van and a phone. Drag
              across to compare.
            </SectionHead>
            <Revamp />
          </section>

          {/* 03 · the guide */}
          <section id="guide" aria-labelledby="gr-guide" className={SECTION}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-5">
                <Label>03 · Brand guide</Label>
                <h2 id="gr-guide" className="mt-4 text-balance font-display text-[30px] font-extralight leading-[1.05] tracking-[-0.04em] md:text-[44px]">
                  One guide for the whole team.
                </h2>
              </div>
              <Reveal className="md:col-span-7 md:pt-8">
                <p className="max-w-[58ch] text-[16px] leading-relaxed text-[var(--v2-secondary)]">
                  Everyone who touched the brand, from the print shop to the people
                  making the weekly offers, worked from the same rules: which logo
                  where, how much room it gets, the colours, the type and how it sits
                  on a photo.
                </p>
              </Reveal>
            </div>

            <div className="mt-12 flex flex-col gap-16 md:gap-24">
              <LogoSystem />

              <div>
                <Label>3.2 · Clear space</Label>
                <h3 className="mt-3 font-display text-[24px] font-light tracking-[-0.03em] md:text-[30px]">The leaf is the unit.</h3>
                <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-[var(--v2-secondary)]">
                  The room around the logo is measured in leaves, so it scales with the
                  logo and anyone can check it by eye, without a ruler.
                </p>
                <Reveal className="mt-6">
                  <Paper className="grid grid-cols-1 items-center gap-6 p-6 md:grid-cols-12 md:p-10">
                    <Image src={`${D}/safe-horizontal.webp`} alt="The primary logo inside its clear space grid, one leaf of room on every side" width={2328} height={1114} sizes="(min-width: 768px) 60vw, 100vw" className="h-auto w-full md:col-span-8" />
                    <Image src={`${D}/safe-symbol.webp`} alt="The symbol inside its clear space grid, one leaf of room on every side" width={1166} height={1398} sizes="(min-width: 768px) 30vw, 70vw" className="mx-auto h-auto w-[60%] md:col-span-4 md:w-full" />
                  </Paper>
                </Reveal>
              </div>

              <Colours />

              <div>
                <Label>3.4 · Type</Label>
                <h3 className="mt-3 font-display text-[24px] font-light tracking-[-0.03em] md:text-[30px]">Caviar Dreams to call out, Gotham to inform.</h3>
                <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-[var(--v2-secondary)]">
                  Caviar Dreams has the same round, thin build as the logo, so the
                  headlines on posts and in store sound like it. Gotham does the
                  rest: text, prices, labels.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Reveal>
                    <div className="overflow-hidden rounded-[20px] border border-[var(--v2-line)]">
                      <Image src={`${D}/type-caviar.webp`} alt="Type specimen: Caviar Dreams Regular and Bold for headlines, white on leaf green" width={2400} height={1720} sizes="(min-width: 768px) 50vw, 100vw" className="block h-auto w-full" />
                    </div>
                  </Reveal>
                  <Reveal delay={0.06}>
                    <div className="overflow-hidden rounded-[20px] border border-[var(--v2-line)]">
                      <Image src={`${D}/type-gotham.webp`} alt="Type specimen: Gotham Light, Book, Medium and Bold for text, ink on white" width={2400} height={1720} sizes="(min-width: 768px) 50vw, 100vw" className="block h-auto w-full" />
                    </div>
                  </Reveal>
                </div>
              </div>

              <div>
                <Label>3.5 · Pattern</Label>
                <h3 className="mt-3 font-display text-[24px] font-light tracking-[-0.03em] md:text-[30px]">The g, on repeat.</h3>
                <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-[var(--v2-secondary)]">
                  The g and its leaf turned into a repeat, ink on ink, for backgrounds
                  that stay quiet behind the logo.
                </p>
                <Reveal className="mt-6">
                  <div className="relative isolate aspect-[16/9] overflow-hidden rounded-[24px] border border-[var(--v2-line)]">
                    <Image src={`${D}/pattern.webp`} alt="" fill sizes="(min-width: 1240px) 1180px, 100vw" className="-z-10 object-cover" />
                    <div className="flex h-full items-center justify-center">
                      <Image src={`${D}/logo/symbol-dark.svg`} alt="The Greens symbol in white and green over the ink pattern of repeated g letters" width={302} height={403} className="h-auto w-[12%]" />
                    </div>
                  </div>
                </Reveal>
              </div>

              <div>
                <Label>3.6 · Photography</Label>
                <h3 className="mt-3 font-display text-[24px] font-light tracking-[-0.03em] md:text-[30px]">One mark, a lot of fruit.</h3>
                <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-[var(--v2-secondary)]">
                  How the logo sits on a picture: white on a field of colour, ink on
                  white, in a box when the photo is busy, or big enough to frame the
                  subject. These are the guide&rsquo;s own pages.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2">
                  {photos.map((p, k) => (
                    <Reveal key={p.src} delay={(k % 2) * 0.06}>
                      <Shot
                        src={`${D}/${p.src}.webp`}
                        w={2400}
                        h={1350}
                        alt={p.alt}
                        caption={p.caption}
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 04 · social */}
          <section id="social" aria-label="Social" className={SECTION}>
            <SectionHead label="04 · Social" title="Templates that do the weekly work.">
              A supermarket posts every week: offers, opening hours, jobs. I designed
              a template for each kind, the type, the stripe and where the logo sits,
              so a new post only needs a photo and a line of copy. And I designed the
              posts on them.
            </SectionHead>
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1.2fr]">
              {posts.map((p, k) => (
                <Reveal key={p.src} delay={k * 0.06}>
                  <Shot src={`${D}/${p.src}.webp`} w={p.w} h={p.h} alt={p.alt} caption={p.caption} sizes="(min-width: 768px) 34vw, 100vw" />
                </Reveal>
              ))}
            </div>
          </section>

          {/* 05 · the offers leaflet */}
          <section id="magazine" aria-label="Offers leaflet" className={SECTION}>
            <SectionHead label="05 · Offers leaflet" title="Every month, on the guide.">
              Greens prints an offers leaflet for Malta and Gozo every month. I set
              it on the guide: the logo on a green band, one white tile per
              product with a round price pill, a small tag for the department,
              and a dark band for the home goods. Turn the pages; on the right,
              the 2017 issue it replaced.
            </SectionHead>
            <Reveal className="mt-12">
              <Leaflets />
            </Reveal>
          </section>

          {/* 06 · video */}
          <section id="video" aria-label="Video" className={SECTION}>
            <SectionHead label="06 · Video" title="From the idea to the cut.">
              I worked on these films all the way through: the concept, helping on
              the shoots, the edit, and checking every frame against the brand
              guide.
            </SectionHead>
            <div className="mt-12 grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-12">
              {films.map((f, k) => (
                <Reveal key={f.src} delay={(k % 2) * 0.06} className={f.span}>
                  <FilmCard f={f} />
                </Reveal>
              ))}
              <Reveal delay={0.12} className="md:col-span-4">
                <div className="flex h-full flex-col justify-end rounded-[20px] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-6">
                  <Label>My part</Label>
                  <ul className="mt-4 list-none space-y-2">
                    {["Concept", "On the shoot", "Edit", "Brand check"].map((s, i) => (
                      <li key={s} className="grid grid-cols-[1.5rem_1fr] text-[15px] text-[var(--v2-secondary)]">
                        <span className="font-mono text-[11px] text-[var(--v2-label)]">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                  <Stripe className="mt-6 h-1 w-24" />
                </div>
              </Reveal>
            </div>
          </section>

          {/* 07 · in context */}
          <section id="context" aria-label="In context" className={SECTION}>
            <SectionHead label="07 · In use" title="Where it lives.">
              The sign over the door, the van at the kerb, the label on the shelf,
              the card and the receipt at the till. Mockups, built from the final
              files.
            </SectionHead>
            <Mockups />
          </section>
        </main>

        <footer className="mx-auto max-w-[1240px] px-5 pb-14 md:px-8 md:pb-20">
          <div className="grain relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[24px] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-7 md:flex-row md:items-center md:p-10">
            <div>
              <p className="font-display text-[26px] font-extralight leading-tight tracking-[-0.03em] md:text-[34px]">
                Need a brand a whole team can keep?
              </p>
              <p className="mt-2 text-[15px] text-[var(--v2-secondary)]">The logo, the guide, and the templates that carry it.</p>
            </div>
            <Link
              href="/visual-work"
              className="rounded-full border border-[var(--v2-line)] px-5 py-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--v2-secondary)] transition-colors duration-200 hover:border-[var(--v2-line-strong)] hover:text-[var(--v2-ink)]"
            >
              See all visual work
            </Link>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
