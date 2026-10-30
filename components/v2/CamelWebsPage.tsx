"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useState } from "react";
import { TopBar } from "./TopBar";
import { SplitTitle } from "./Playful";
import { Tilt } from "./Tilt";
import { ENERGY } from "./motion";

/* CamelWebs, the finished brand and the guide that keeps it whole.

   Only the final work is shown: the brief and the one word it hung on, the
   mark, the guide, the brand in context and the live site. No rejected
   routes or colour rounds. The logos are the exported files, the website is
   the live site, and the in-context pieces are mockups drawn here in code
   from the same files, so they are always in the final colours. The guide
   sits on white "paper" because the brand lives on white; the site around it
   stays dark.

   NB International is a licensed face, so the specimen is an image, not a
   webfont served from here. */

const BLUE = "#45A5FD";
const LIVE = "https://camelwebs.com";
const D = "/design/camelwebs";

/* ---------- content ---------- */

const objectives = [
  "Represents the look of the brand.",
  "Feels as modern as the product.",
  "Takes on its technological spirit.",
];

const traits = ["Modern", "Technological", "Technical", "Human", "Specialist", "Innovative"];

const modules = [
  "Digital bromatology",
  "Foliar mineral analysis",
  "Digital stocking rate",
  "Carbon footprint",
  "Heat stress",
  "Cloud ecosystem",
  "Equipment connection",
  "GPS collars",
];

type Way = "primary" | "mono" | "dark" | "reversed";

const ways: { id: Way; label: string; bg: string; ink: string }[] = [
  { id: "primary", label: "Primary", bg: "#FFFFFF", ink: "#000" },
  { id: "mono", label: "One colour", bg: "#FFFFFF", ink: "#000" },
  { id: "dark", label: "On dark", bg: "#000000", ink: "#fff" },
  { id: "reversed", label: "Reversed", bg: BLUE, ink: "#fff" },
];

/* the exported files, by lockup and colourway */
const lockups: { name: string; use: string; w: number; h: number; files: Record<Way, string>; size: string }[] = [
  {
    name: "Horizontal",
    use: "The default. Headers, the site, documents.",
    w: 2313,
    h: 344,
    files: { primary: "02", mono: "03", dark: "01", reversed: "04" },
    size: "w-[86%]",
  },
  {
    name: "Stacked",
    use: "Square spaces: splash screens, installers, social.",
    w: 591,
    h: 344,
    files: { primary: "10", mono: "11", dark: "09", reversed: "12" },
    size: "w-[58%]",
  },
  {
    name: "Symbol",
    use: "App and desktop icons, favicons, small sizes.",
    w: 674,
    h: 410,
    files: { primary: "06", mono: "07", dark: "06", reversed: "08" },
    size: "w-[46%]",
  },
  {
    name: "Wordmark",
    use: "Where the symbol is already on screen.",
    w: 933,
    h: 138,
    files: { primary: "14", mono: "14", dark: "15", reversed: "15" },
    size: "w-[72%]",
  },
];

const colours = [
  { name: "Brand blue", hex: "#45A5FD", rgb: "69 165 253", use: "The symbol, buttons, links, the reversed field and the icon accent.", ink: "#000" },
  { name: "Black", hex: "#000000", rgb: "0 0 0", use: "The wordmark, headlines and the icon outline.", ink: "#fff" },
  { name: "White", hex: "#FFFFFF", rgb: "255 255 255", use: "The page, and the logo on blue or on dark.", ink: "#000" },
];

const grounds = [
  { id: "white", label: "Page", style: { background: "#FFFFFF" }, file: "06" },
  { id: "blue", label: "Brand blue", style: { background: BLUE }, file: "08" },
  { id: "black", label: "Black", style: { background: "#000000" }, file: "08" },
  { id: "photo", label: "Photo", style: {}, file: "08" },
] as const;

/* ---------- pieces ---------- */

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: ENERGY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--v2-label)]">{children}</p>;
}

function SectionHead({ label, title, children }: { label: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-5">
        <Label>{label}</Label>
        <SplitTitle
          as="h2"
          text={title}
          className="mt-4 text-balance font-display text-[30px] font-extralight leading-[1.05] tracking-[-0.04em] md:text-[44px]"
        />
      </div>
      {children && (
        <Reveal className="md:col-span-7 md:pt-8">
          <div className="max-w-[58ch] text-[16px] leading-relaxed text-[var(--v2-secondary)]">{children}</div>
        </Reveal>
      )}
    </div>
  );
}

/* a slide or screenshot at its own shape, in the site's frame */
function Shot({ src, alt, w = 1920, h = 1080, caption, sizes = "(min-width: 1240px) 1180px, 100vw" }: { src: string; alt: string; w?: number; h?: number; caption?: string; sizes?: string }) {
  return (
    <figure>
      <div className="v2-card-bezel overflow-hidden rounded-[20px] border border-[var(--v2-line)]">
        <Image src={src} alt={alt} width={w} height={h} sizes={sizes} className="block h-auto w-full" />
      </div>
      {caption && <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">{caption}</figcaption>}
    </figure>
  );
}

/* the guide's paper: the brand lives on white */
function Paper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[24px] bg-white text-black ${className}`}>{children}</div>;
}

function Segmented<T extends string>({ items, value, onChange, label }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-full border border-[var(--v2-line)] p-1">
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button
            key={it.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(it.id)}
            className={`relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
              on ? "text-black" : "text-[var(--v2-secondary)] hover:text-[var(--v2-ink)]"
            }`}
          >
            {on && (
              <motion.span
                layoutId={`seg-${label}`}
                className="absolute inset-0 rounded-full bg-[var(--v2-ink)]"
                transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              />
            )}
            <span className="relative">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- sections ---------- */

function Knockout() {
  const [g, setG] = useState<(typeof grounds)[number]["id"]>("blue");
  const ground = grounds.find((x) => x.id === g)!;
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-7">
        <div className="relative isolate aspect-[4/3] overflow-hidden rounded-[24px] border border-[var(--v2-line)] transition-[background] duration-500" style={ground.style}>
          <AnimatePresence>
            {g === "photo" && (
              <motion.div key="photo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 -z-10">
                <Image src={`${D}/knock-photo.webp`} alt="" fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex h-full items-center justify-center">
            <motion.div key={ground.file} initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.5, bounce: 0.2 }} className="w-[52%]">
              <Image src={`${D}/logo/${ground.file}.svg`} alt="The CamelWebs symbol: three peaks with a llama cut out of them" width={674} height={410} className="h-auto w-full" />
            </motion.div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-6 md:col-span-5">
        <p className="max-w-[40ch] text-balance font-display text-[22px] font-light leading-[1.35] tracking-[-0.02em] md:text-[26px]">
          The llama is never drawn. It is cut out of the mountain.
        </p>
        <p className="max-w-[46ch] text-[15px] leading-relaxed text-[var(--v2-secondary)]">
          So it always takes the colour of whatever sits behind it: the page, the
          brand blue, a dark screen, a photo of the herd. One shape, and the
          animal is already part of the landscape. Try it.
        </p>
        <Segmented label="Background" items={grounds.map((x) => ({ id: x.id, label: x.label }))} value={g} onChange={setG} />
      </div>
    </div>
  );
}

function LogoSystem() {
  const [way, setWay] = useState<Way>("primary");
  const w = ways.find((x) => x.id === way)!;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label>4.1 · Logo</Label>
          <h3 className="mt-3 font-display text-[24px] font-light tracking-[-0.03em] md:text-[30px]">Four lockups, four colourways.</h3>
        </div>
        <Segmented label="Colourway" items={ways} value={way} onChange={setWay} />
      </div>
      <ul className="mt-6 grid list-none grid-cols-1 gap-4 sm:grid-cols-2">
        {lockups.map((l, k) => (
          <li key={l.name}>
            <Reveal delay={k * 0.05}>
              <div className="flex aspect-[16/9] items-center justify-center rounded-[20px] border border-[var(--v2-line)] transition-colors duration-500" style={{ background: w.bg }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={l.files[way] + way}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: ENERGY }}
                    className={`flex justify-center ${l.size}`}
                  >
                    <Image src={`${D}/logo/${l.files[way]}.svg`} alt={`CamelWebs ${l.name.toLowerCase()} logo, ${w.label.toLowerCase()}`} width={l.w} height={l.h} className="h-auto w-full" />
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
      <Label>4.2 · Colour</Label>
      <h3 className="mt-3 font-display text-[24px] font-light tracking-[-0.03em] md:text-[30px]">Three colours: blue, black and white.</h3>
      <ul className="mt-6 grid list-none grid-cols-1 gap-3 sm:grid-cols-3">
        {colours.map((c, k) => (
          <li key={c.hex}>
            <Reveal delay={k * 0.04}>
              <motion.button
                onClick={() => copy(c.hex)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", duration: 0.3, bounce: 0.25 }}
                aria-label={`Copy ${c.name} ${c.hex}`}
                className="flex aspect-[5/4] w-full flex-col justify-between rounded-[18px] border border-[var(--v2-line)] p-4 text-left"
                style={{ background: c.hex, color: c.ink }}
              >
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] opacity-70">{copied === c.hex ? "Copied" : `0${k + 1}`}</span>
                <span>
                  <span className="block text-[15px] font-medium">{c.name}</span>
                  <span className="mt-1 block font-mono text-[12px]">{c.hex}</span>
                  <span className="block font-mono text-[11px] opacity-70">RGB {c.rgb}</span>
                </span>
              </motion.button>
              <p className="mt-2.5 text-[13px] leading-snug text-[var(--v2-secondary)]">{c.use}</p>
            </Reveal>
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">{copied ? `${copied} copied to clipboard` : ""}</p>
    </div>
  );
}

/* ---------- the icon set ---------- */

/* Two sprite sheets, one per colour, cut from the same 16 by 11 grid and
   layered on each cell (globals.css, .cw-ico). Static: the set is 171 icons. */
const ICONS = 171;
const SHEET_COLS = 16;
const SHEET_ROWS = 11;

function IconSet() {
  return (
    <ul
      aria-label="171 line icons in black and brand blue: llamas and alpacas, wool, drones over pasture, laboratory reports, genetics, charts and farm buildings"
      role="img"
      className="cw-icons grid list-none grid-cols-8 sm:grid-cols-12 lg:grid-cols-16"
    >
      {Array.from({ length: ICONS }, (_, i) => {
        const col = i % SHEET_COLS;
        const row = Math.floor(i / SHEET_COLS);
        return (
          <li
            key={i}
            aria-hidden
            className="cw-ico"
            style={
              {
                "--x": `${(col / (SHEET_COLS - 1)) * 100}%`,
                "--y": `${(row / (SHEET_ROWS - 1)) * 100}%`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </ul>
  );
}

/* ---------- mockups, drawn from the final files ---------- */

/* one stage per piece: square-ish on a phone, one shared height on desktop
   so the pieces in a row line up */
function Stage({ children, caption, className = "", style }: { children: React.ReactNode; caption: string; className?: string; style?: React.CSSProperties }) {
  return (
    <figure className="group">
      <div className={`relative isolate aspect-[4/3] overflow-hidden rounded-[24px] border border-[var(--v2-line)] md:aspect-auto md:h-[440px] ${className}`} style={style}>
        {children}
      </div>
      <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">{caption}</figcaption>
    </figure>
  );
}

function Installer() {
  return (
    <Stage caption="Desktop installer" className="flex items-center justify-center" style={{ background: "linear-gradient(160deg,#EEF3F8,#D9E3EC)" }}>
      <div className="w-[82%] max-w-[520px] overflow-hidden rounded-[10px] bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1.5">
        <div className="flex items-center gap-2 border-b border-[#E6ECF2] px-3 py-2">
          <Image src={`${D}/logo/06.svg`} alt="" width={674} height={410} className="h-auto w-4" />
          <span className="flex-1 truncate text-[11px] text-black">CamelWebs V2024 Setup</span>
          <span aria-hidden className="flex gap-3 text-[11px] text-[#666]">
            <span>&#8211;</span>
            <span>&#9633;</span>
            <span>&#215;</span>
          </span>
        </div>
        <div className="flex flex-col items-center px-8 pb-6 pt-8">
          <Image src={`${D}/logo/10.svg`} alt="The stacked CamelWebs logo on the installer window" width={591} height={344} className="h-auto w-[42%]" />
          <p className="mt-6 self-start text-[12px] text-black">Installing CamelWebs V2024</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E3ECF5]">
            <motion.div
              className="h-full w-full origin-left rounded-full"
              style={{ background: BLUE }}
              initial={{ scaleX: 0.08 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.8 }}
            />
          </div>
          <span className="mt-5 self-end rounded-[6px] px-4 py-1.5 text-[11px] font-medium text-white" style={{ background: BLUE }}>
            Next
          </span>
        </div>
      </div>
    </Stage>
  );
}

function Desktop() {
  return (
    <Stage caption="App icon" className="flex flex-col" style={{ background: "radial-gradient(120% 90% at 30% 10%,#2A2A2A,#111 55%,#000)" }}>
      <div className="flex flex-1 items-center justify-center">
        <motion.div whileHover={{ y: -6, scale: 1.04 }} transition={{ type: "spring", duration: 0.4, bounce: 0.3 }} className="flex flex-col items-center gap-3">
          <div className="flex aspect-square w-[118px] items-center justify-center rounded-[28px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.55)] md:w-[132px]" style={{ background: BLUE }}>
            <Image src={`${D}/logo/08.svg`} alt="The CamelWebs app icon: the white symbol on brand blue" width={674} height={410} className="h-auto w-[66%]" />
          </div>
          <span className="rounded-[6px] bg-black/25 px-2 py-0.5 text-[12px] text-white">CamelWebs</span>
        </motion.div>
      </div>
      {/* the taskbar, with the app open */}
      <div className="mx-auto mb-4 flex items-center gap-2 rounded-[14px] bg-white/12 px-3 py-2 backdrop-blur-sm">
        {["#9FB3C6", "#7F95AA", "#B9C7D4"].map((c) => (
          <span key={c} className="h-8 w-8 rounded-[8px] opacity-60" style={{ background: c }} />
        ))}
        <span className="relative flex h-8 w-8 items-center justify-center rounded-[8px]" style={{ background: BLUE }}>
          <Image src={`${D}/logo/08.svg`} alt="" width={674} height={410} className="h-auto w-[68%]" />
          <span className="absolute -bottom-1.5 h-1 w-3 rounded-full bg-white" />
        </span>
      </div>
    </Stage>
  );
}

function Cards() {
  return (
    <Stage caption="Business cards" className="flex items-center justify-center" style={{ background: "linear-gradient(200deg,#E4E9EE,#CBD4DC)" }}>
      <div className="relative aspect-[85/55] w-[52%]">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[10px] bg-white shadow-[0_24px_40px_-18px_rgba(0,0,0,0.5)] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] [transform:translate(-30%,-14%)_rotate(-8deg)] group-hover:[transform:translate(-40%,-18%)_rotate(-11deg)]">
          <Image src={`${D}/logo/06.svg`} alt="" width={674} height={410} className="h-auto w-[34%]" />
          <span className="font-mono text-[9px] tracking-[0.12em] text-black md:text-[10px]">camelwebs.com</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-[10px] shadow-[0_28px_44px_-18px_rgba(0,0,0,0.6)] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] [transform:translate(26%,14%)_rotate(5deg)] group-hover:[transform:translate(34%,18%)_rotate(7deg)]" style={{ background: BLUE }}>
          <Image src={`${D}/logo/04.svg`} alt="Business cards: the white logo on brand blue on the front, the blue symbol on white on the back" width={2313} height={344} className="h-auto w-[80%]" />
        </div>
      </div>
    </Stage>
  );
}

function Phone() {
  return (
    <Stage caption="Phone" style={{ background: "linear-gradient(180deg,#EAF4FE,#CFE6FD)" }}>
      <div className="absolute bottom-0 left-[10%] right-0 top-[9%] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-2">
        <Image src={`${D}/phone-splash.webp`} alt="A phone showing the stacked CamelWebs logo over llamas, above a card for the Monofinca plan" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-left-top" />
      </div>
    </Stage>
  );
}

function EarTags() {
  /* the tag a llama wears in its ear, the one place the herd itself carries
     the brand; they hang from the stud and swing on hover */
  const tag = (n: string, rot: string, hover: string, delay: string) => (
    <div className={`relative w-[30%] max-w-[150px] origin-top transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${rot} ${hover} ${delay}`}>
      <span className="mx-auto block h-5 w-5 rounded-full border-[5px] border-[#2B2B2B] bg-[#F4F4F4] shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
      <div className="-mt-2 flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-[46%_46%_18%_18%/30%_30%_10%_10%] shadow-[inset_0_-10px_18px_rgba(0,0,0,0.12),0_18px_30px_-12px_rgba(0,0,0,0.45)]" style={{ background: BLUE }}>
        <Image src={`${D}/logo/08.svg`} alt="" width={674} height={410} className="mt-3 h-auto w-[58%]" />
        <span className="font-mono text-[13px] font-semibold tracking-[0.08em] text-white md:text-[15px]">{n}</span>
      </div>
    </div>
  );
  return (
    <Stage caption="Ear tags" className="flex items-center justify-center gap-[6%]" style={{ background: "linear-gradient(170deg,#F3F1EC,#DCD8D0)" }}>
      <span className="sr-only">Two blue ear tags with the white CamelWebs symbol and an animal number</span>
      {tag("CW 0142", "-rotate-[7deg]", "group-hover:rotate-[4deg]", "")}
      {tag("CW 0143", "rotate-[5deg]", "group-hover:-rotate-[6deg]", "delay-75")}
    </Stage>
  );
}

function Patch() {
  return (
    <Stage
      caption="Embroidered patch"
      className="flex items-center justify-center"
      style={{ background: "repeating-linear-gradient(45deg,#141414 0 2px,#1C1C1C 2px 4px),#161616" }}
    >
      <div className={`relative flex aspect-square w-[52%] max-w-[220px] items-center justify-center rounded-full shadow-[0_16px_30px_-10px_rgba(0,0,0,0.8)] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]`} style={{ background: BLUE }}>
        {/* the satin stitch, as fine diagonal thread, and the merrowed edge */}
        <span aria-hidden className="absolute inset-0 rounded-full opacity-25 [background:repeating-linear-gradient(-35deg,rgba(255,255,255,0.5)_0_1px,transparent_1px_3px)]" />
        <span aria-hidden className="absolute inset-[5%] rounded-full border-2 border-dashed border-white/70" />
        <Image src={`${D}/logo/08.svg`} alt="An embroidered round patch: the white CamelWebs symbol on blue" width={674} height={410} className="relative h-auto w-[58%]" />
      </div>
    </Stage>
  );
}

function Notebook() {
  return (
    <Stage caption="Notebook" className="flex items-center justify-center" style={{ background: "linear-gradient(200deg,#ECEEF0,#D3D7DB)" }}>
      <div className={`relative aspect-[3/4] w-[46%] max-w-[210px] -rotate-6 rounded-[6px_14px_14px_6px] shadow-[0_26px_40px_-14px_rgba(0,0,0,0.45)] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:-rotate-3 group-hover:-translate-y-1.5`} style={{ background: BLUE }}>
        <span aria-hidden className="absolute inset-y-0 left-0 w-[7%] rounded-l-[6px] bg-black/10" />
        <span aria-hidden className="absolute inset-y-0 right-[12%] w-[5%] bg-black shadow-[1px_0_2px_rgba(0,0,0,0.4)]" />
        <div className="flex h-full flex-col items-center justify-center gap-4 pr-[14%]">
          <Image src={`${D}/logo/08.svg`} alt="A blue notebook with the white CamelWebs symbol on the cover" width={674} height={410} className="h-auto w-[52%] opacity-95" />
          <Image src={`${D}/logo/15.svg`} alt="" width={933} height={138} className="h-auto w-[56%]" />
        </div>
      </div>
    </Stage>
  );
}

function Tablet() {
  return (
    <Stage caption="Tablet in the field">
      <Image src={`${D}/knock-photo.webp`} alt="" fill sizes="(min-width: 768px) 60vw, 100vw" className="-z-10 scale-110 object-cover [filter:blur(6px)_brightness(0.8)]" />
      <div className="flex h-full items-center justify-center">
        <div className={`aspect-[4/3] w-[72%] max-w-[480px] rounded-[22px] bg-[#111] p-[2.2%] shadow-[0_30px_60px_-16px_rgba(0,0,0,0.7)] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1.5`}>
          <div className="flex h-full flex-col items-center justify-center gap-5 rounded-[14px]" style={{ background: BLUE }}>
            <Image src={`${D}/logo/12.svg`} alt="A tablet in a pasture showing the CamelWebs start screen: the white stacked logo on blue" width={591} height={344} className="h-auto w-[38%]" />
            <span aria-hidden className="flex gap-1.5">
              {[0, 1, 2].map((k) => (
                <motion.span
                  key={k}
                  className="h-1.5 w-1.5 rounded-full bg-white"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: k * 0.2 }}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </Stage>
  );
}

function Social() {
  return (
    <Stage caption="Social profile" className="flex items-center justify-center" style={{ background: "linear-gradient(180deg,#EAF4FE,#D4E9FD)" }}>
      <div className={`w-[86%] max-w-[560px] rounded-[20px] bg-white p-5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.35)] md:p-6 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1.5`}>
        <div className="flex items-center gap-4">
          <span className="flex aspect-square w-14 shrink-0 items-center justify-center rounded-full md:w-16" style={{ background: BLUE }}>
            <Image src={`${D}/logo/08.svg`} alt="" width={674} height={410} className="h-auto w-[62%]" />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-black">camelwebs</p>
            <p className="truncate text-[13px] text-black/60">Software para camelidos</p>
          </div>
          <span className="ml-auto rounded-[8px] px-3.5 py-1.5 text-[12px] font-medium text-white" style={{ background: BLUE }}>
            Follow
          </span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-1.5">
          <div className="flex aspect-square items-center justify-center" style={{ background: BLUE }}>
            <Image src={`${D}/logo/08.svg`} alt="" width={674} height={410} className="h-auto w-[56%]" />
          </div>
          <div className="relative aspect-square overflow-hidden">
            <Image src={`${D}/knock-photo.webp`} alt="" fill sizes="200px" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/50 to-transparent px-3 pb-3 pt-8">
              <Image src={`${D}/logo/15.svg`} alt="" width={933} height={138} className="h-auto w-[80%]" />
            </div>
          </div>
          <div className="flex aspect-square items-center justify-center bg-black">
            <Image src={`${D}/logo/09.svg`} alt="" width={591} height={344} className="h-auto w-[66%]" />
          </div>
        </div>
      </div>
      <span className="sr-only">A social profile for CamelWebs: the symbol as the avatar and three posts in the brand colours</span>
    </Stage>
  );
}

function Mockups() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-12">
      <Reveal className="md:col-span-7"><Installer /></Reveal>
      <Reveal delay={0.06} className="md:col-span-5"><Desktop /></Reveal>
      <Reveal className="md:col-span-5"><EarTags /></Reveal>
      <Reveal delay={0.06} className="md:col-span-7"><Tablet /></Reveal>
      <Reveal className="md:col-span-6"><Patch /></Reveal>
      <Reveal delay={0.06} className="md:col-span-6"><Notebook /></Reveal>
      <Reveal className="md:col-span-7"><Cards /></Reveal>
      <Reveal delay={0.06} className="md:col-span-5"><Phone /></Reveal>
      <Reveal className="md:col-span-12"><Social /></Reveal>
    </div>
  );
}

/* the live home page in a browser, so the favicon and the title are seen
   where they actually show up */
function Browser() {
  return (
    <figure>
      <div className="overflow-hidden rounded-[16px] border border-[var(--v2-line)] bg-white">
        <div className="flex items-end gap-4 bg-[#DEE4EA] px-4 pt-2.5">
          <span aria-hidden className="mb-3 flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
            <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
            <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          </span>
          <span className="flex min-w-0 items-center gap-2 rounded-t-[10px] bg-white px-3.5 py-2 text-[12px] text-black">
            <Image src={`${D}/logo/06.svg`} alt="" width={674} height={410} className="h-auto w-4 shrink-0" />
            <span className="truncate">CamelWebs - Software para Camelidos</span>
          </span>
        </div>
        <div className="border-b border-[#E6ECF2] px-4 py-2">
          <span className="block rounded-full bg-[#F1F4F7] px-4 py-1.5 font-mono text-[12px] text-[#555]">camelwebs.com</span>
        </div>
        <Image src={`${D}/web-hero.webp`} alt="camelwebs.com home: the headline on a blue panel next to a photo of llamas in the mountains" width={2400} height={1667} sizes="(min-width: 1240px) 1180px, 100vw" className="block h-auto w-full" />
      </div>
      <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">Home</figcaption>
    </figure>
  );
}

/* ---------- page ---------- */

export function CamelWebsPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="v2-root font-sans">
        <TopBar />
        <main id="main" className="mx-auto max-w-[1240px] px-5 md:px-8">
          {/* the brand, and what it is for */}
          <section aria-labelledby="cw-title" className="grid grid-cols-1 gap-10 pb-16 pt-12 md:grid-cols-12 md:gap-8 md:pb-24 md:pt-20">
            <div className="md:col-span-5 md:pt-4">
              <p className="v2-rise flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-secondary)]">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: BLUE }} />
                <span style={{ color: BLUE }}>Brand identity</span>
                <span aria-hidden className="text-[var(--v2-label)]">&middot;</span>
                <span>2024</span>
              </p>
              <h1 id="cw-title" className="v2-rise v2-rise-1 mt-6 text-balance font-display text-[clamp(2.3rem,4.6vw,4rem)] font-extralight leading-[1.04] tracking-[-0.045em]">
                Software with <span className="font-normal">altitude</span>.
              </h1>
              <p className="v2-rise v2-rise-2 mt-6 max-w-[46ch] text-[16px] leading-relaxed text-[var(--v2-secondary)] md:text-[17px]">
                CamelWebs is farm software for camelid herds, alpacas and llamas,
                built around wool and fibre production. I designed its identity,
                its icon set, its website and its interface. This page is how the
                brand was made, and the guide that keeps it whole.
              </p>
              <dl className="v2-rise v2-rise-3 mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--v2-line)] pt-6">
                {[
                  ["Client", "Sadep, freelance"],
                  ["Studio", "Big-O, my studio"],
                  ["Role", "Identity, icons, web, UI"],
                  ["Year", "2024"],
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
                camelwebs.com ↗
              </a>
            </div>
            <div className="v2-rise v2-rise-2 md:col-span-7">
              <Tilt strength={0.5} drift={6}>
                <div className="grain relative flex aspect-[4/3] flex-col items-center justify-center gap-8 overflow-hidden rounded-[24px]" style={{ background: BLUE }}>
                  <Image src={`${D}/logo/08.svg`} alt="" width={674} height={410} priority className="h-auto w-[44%]" />
                  <Image src={`${D}/logo/15.svg`} alt="CamelWebs" width={933} height={138} priority className="h-auto w-[56%]" />
                </div>
              </Tilt>
            </div>
          </section>

          {/* 01 · the brief */}
          <section aria-label="Brief" className="border-t border-[var(--v2-line)] py-14 md:py-20">
            <SectionHead label="01 · Brief" title="Modern, technical, and still human.">
              Sadep already sold TaurusWebs to cattle farms. CamelWebs takes the
              same idea to camelid herds: eight modules, from drone photos that
              read a pasture to sensors that log heat stress every hour. It needed
              an identity of its own, one that ranchers, the wool industry and
              universities would all take seriously.
            </SectionHead>
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Reveal className="rounded-[20px] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-6">
                <Label>The ask</Label>
                <p className="mt-4 text-[15px]">A logo and visual identity that:</p>
                <ol className="mt-3 list-none space-y-2">
                  {objectives.map((o, k) => (
                    <li key={o} className="grid grid-cols-[1.5rem_1fr] text-[15px] leading-snug text-[var(--v2-secondary)]">
                      <span className="font-mono text-[11px] text-[var(--v2-label)]">{k + 1}</span>
                      {o}
                    </li>
                  ))}
                </ol>
              </Reveal>
              <Reveal delay={0.06} className="rounded-[20px] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-6">
                <Label>We are</Label>
                <ul className="mt-4 flex list-none flex-wrap gap-2">
                  {traits.map((t) => (
                    <li key={t} className="rounded-full border border-[var(--v2-line)] px-3 py-1.5 text-[14px]">
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.12} className="rounded-[20px] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-6">
                <Label>The product</Label>
                <ul className="mt-4 flex list-none flex-wrap gap-1.5">
                  {modules.map((m) => (
                    <li key={m} className="rounded-[8px] bg-[var(--v2-bg)] px-2.5 py-1 font-mono text-[11.5px] text-[var(--v2-secondary)]">
                      {m}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          {/* 02 · the concept */}
          <section aria-label="Concept" className="border-t border-[var(--v2-line)] py-14 md:py-20">
            <SectionHead label="02 · Concept" title="Imponencia.">
              One word to hang everything on: an imposing presence, the way the
              mountains these herds live on hold the horizon. The mood board asked
              for icons that are <em>llama-tivos</em> (in Spanish, <em>llamativo</em>{" "}
              means eye-catching), iconic photography, an imposing modern sans for
              headlines with a soft one for text, and digital colour that holds on
              any screen.
            </SectionHead>
            <Reveal className="mt-12">
              <div className="relative isolate aspect-[4/3] overflow-hidden rounded-[24px] border border-[var(--v2-line)] md:aspect-[16/8]">
                <Image src={`${D}/knock-photo.webp`} alt="" fill sizes="(min-width: 1240px) 1180px, 100vw" className="-z-10 object-cover object-[50%_35%]" />
                <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="flex h-full items-end p-6 md:p-10">
                  <Image src={`${D}/logo/04.svg`} alt="The CamelWebs logo in white over a photo of llamas in the Andes" width={2313} height={344} className="h-auto w-[78%] max-w-[560px]" />
                </div>
              </div>
            </Reveal>
          </section>

          {/* 03 · the mark */}
          <section aria-label="The mark" className="border-t border-[var(--v2-line)] py-14 md:py-20">
            <SectionHead label="03 · The mark" title="Three peaks and a llama." />
            <Knockout />
          </section>

          {/* 04 · the guide */}
          <section aria-labelledby="cw-guide" className="border-t border-[var(--v2-line)] py-14 md:py-20">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-5">
                <Label>04 · Brand guide</Label>
                <h2 id="cw-guide" className="mt-4 text-balance font-display text-[30px] font-extralight leading-[1.05] tracking-[-0.04em] md:text-[44px]">
                  Everything the brand is made of.
                </h2>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-16 md:gap-24">
              <LogoSystem />
              <Colours />

              <div>
                <Label>4.3 · Type</Label>
                <h3 className="mt-3 font-display text-[24px] font-light tracking-[-0.03em] md:text-[30px]">NB International, in two weights.</h3>
                <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-[var(--v2-secondary)]">
                  Square terminals on a rounded body: technical without going cold.
                  Bold sets the wordmark and every headline, Regular the text and the
                  interface.
                </p>
                <Reveal className="mt-6">
                  <Paper className="overflow-hidden">
                    <Image src={`${D}/type-nb.webp`} alt="Type specimen: NB International Pro Bold for headlines and the wordmark, NB International Regular for body and interface" width={2400} height={978} sizes="(min-width: 1240px) 1180px, 100vw" className="block h-auto w-full" />
                  </Paper>
                </Reveal>
              </div>

              <div>
                <Label>4.4 · Icons</Label>
                <h3 className="mt-3 font-display text-[24px] font-light tracking-[-0.03em] md:text-[30px]">171 icons, one weight.</h3>
                <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-[var(--v2-secondary)]">
                  Drawn for the desktop software, on one size and one line weight, in
                  the two brand colours: black for the object, blue for the accent.
                  Llamas and alpacas, wool, pasture read by drone, laboratory
                  reports, genetics, scales and the farm itself.
                </p>
                <Reveal className="mt-6">
                  <Paper className="p-3 md:p-6">
                    <IconSet />
                  </Paper>
                </Reveal>
              </div>
            </div>
          </section>

          {/* 05 · in context */}
          <section aria-label="In context" className="border-t border-[var(--v2-line)] py-14 md:py-20">
            <SectionHead label="05 · In context" title="Where it lives.">
              From the desk to the pasture: the software it installs, the tag in a
              llama&rsquo;s ear, the patch on a field technician&rsquo;s jacket, the tablet
              they carry. Mockups, built from the final files.
            </SectionHead>
            <Mockups />
          </section>

          {/* 06 · on the web */}
          <section aria-label="On the web" className="border-t border-[var(--v2-line)] py-14 md:py-20">
            <SectionHead label="06 · On the web" title="camelwebs.com">
              The website carries the whole system: the blue field, the cut out
              llama riding on a photo of the herd, NB International throughout,
              and the icon set leading every module.{" "}
              <a href={LIVE} target="_blank" rel="noopener noreferrer" className="text-[var(--v2-ink)] underline decoration-[var(--v2-line-strong)] underline-offset-4">
                See it live ↗
              </a>
            </SectionHead>
            <div className="mt-12 flex flex-col gap-4">
              <Reveal>
                <Browser />
              </Reveal>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <Reveal className="md:col-span-8">
                  <Shot src={`${D}/web-modules.webp`} w={2400} h={2917} alt="The modules section of camelwebs.com, eight cards each led by an icon from the set" caption="Modules, each led by its icon" sizes="(min-width: 768px) 66vw, 100vw" />
                </Reveal>
                <Reveal delay={0.08} className="md:col-span-4">
                  <Shot src={`${D}/web-mobile.webp`} w={1170} h={2532} alt="camelwebs.com on a phone" caption="Phone" sizes="(min-width: 768px) 33vw, 100vw" />
                </Reveal>
              </div>
              <Reveal>
                <Shot src={`${D}/web-migration.webp`} w={2400} h={747} alt="A blue band with a llama next to an illustrated database, promising fully assisted data migration" caption="Migration" />
              </Reveal>
              <Reveal>
                <Shot src={`${D}/web-footer.webp`} w={2400} h={917} alt="The camelwebs.com footer with the blue horizontal logo" caption="Footer" />
              </Reveal>
            </div>
          </section>
        </main>

        <footer className="mx-auto max-w-[1240px] px-5 pb-14 md:px-8 md:pb-20">
          <div className="grain relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[24px] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-7 md:flex-row md:items-center md:p-10">
            <div>
              <p className="font-display text-[26px] font-extralight leading-tight tracking-[-0.03em] md:text-[34px]">
                Need a brand that holds up on a screen?
              </p>
              <p className="mt-2 text-[15px] text-[var(--v2-secondary)]">Identity, icons and the interface, from one pair of hands.</p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-[var(--v2-line)] px-5 py-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--v2-secondary)] transition-colors duration-200 hover:border-[var(--v2-line-strong)] hover:text-[var(--v2-ink)]"
            >
              See all my work
            </Link>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
