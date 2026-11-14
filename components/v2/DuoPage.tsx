"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { TopBar } from "./TopBar";
import { Tilt } from "./Tilt";
import { Label, SectionHead } from "./BrandKit";

/* Duo Sicilian Ice Cream, the brand as I have built it since 2024.

   What was there: one logo, inside an oval. What is mine: everything made
   from it. The logo taken out of the oval into the formats the shops use,
   and the graphic line around it: the characters, the line drawings on the
   jars, the wall menu, the counter print, the campaigns and the Sicilian
   Market. Every illustration here is mine.

   The photos of people in Duo shirts are AI generated mockups, and say so.
   The business card is shown from its logo side only: the front carries a
   colleague's details. Gift cards carry customer names and are left out.

   Type: Blorp for titles, Gotham for text. Gotham is licensed, so its
   specimen is an image composed from the installed font. */

const MINT = "#74D0BA";
const MINT_LIGHT = "#9CDECC";
const INK = "#2C363C";
const D = "/design/duo";
const LIVE = "https://duoicecream.de";
const SETTLE = "transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]";

/* ---------- content ---------- */

type Colour = { name: string; hex: string; rgb: string; print?: string; ink: string };

const colours: Colour[] = [
  { name: "Mint", hex: "#8BCFBC", rgb: "139 207 188", ink: INK },
  { name: "Ink", hex: INK, rgb: "44 54 60", ink: "#FFFFFF" },
  { name: "Lemon", hex: "#FFC80A", rgb: "255 200 10", print: "Pantone 109 U", ink: INK },
  { name: "Orange", hex: "#F58843", rgb: "245 136 67", print: "Pantone 2018 U", ink: INK },
];

const cast: { id: string; name: string; note: string }[] = [
  { id: "arancino", name: "Arancino", note: "Sicilian street food, out for a walk." },
  { id: "brot", name: "The bread brothers", note: "For the organic bread." },
  { id: "cannolo", name: "Cannolo", note: "Cool, and knows it." },
  { id: "gelato", name: "Gelato", note: "Melting, never in a hurry." },
];

/* the take home jars, one per flavour, as photographed for delivery */
const jars: { id: string; name: string }[] = [
  { id: "pistachio", name: "Pistachio" },
  { id: "cremino", name: "Cremino al pistacchio" },
  { id: "salty-pistachio", name: "Salty pistachio" },
  { id: "bacio", name: "Bacio siciliano" },
  { id: "brontesino", name: "Brontesino" },
  { id: "hazelnut", name: "Hazelnut" },
  { id: "gianduja", name: "Gianduja" },
  { id: "dark-chocolate", name: "Dark chocolate" },
  { id: "tiramisu", name: "Tiramisu" },
  { id: "sicily", name: "Sicily" },
  { id: "vanilla", name: "Vanilla" },
  { id: "mango", name: "Mango" },
  { id: "raspberry", name: "Raspberry" },
];

/* the wall menu: 33 gelato strips and 9 for the coffee bar, as printed */
const strips = [
  "Crema", "Umma Umma", "Stracciatella", "Lemon", "Walnut", "Vanilla", "Sicily", "Tiramisu", "Strawberry", "Raspberry", "Shalai",
  "Mango", "Pesto al pistacchio", "Pistacchiella", "Salty pistacchio", "Crunchy pistacchio", "Pistacchio", "Maracuja", "Etna",
  "Gianduja", "Hazelnut", "Coconut", "Fior di latte", "Dark chocolate", "Cremino al pistacchio", "Cannolo siciliano", "Chocolate",
  "Brontesino", "Bacio siciliano", "Sicilian caramel", "Espresso siciliano", "Il Modicano", "Amara amara",
  "Americano", "Cappuccino", "Latte macchiato", "Flat white", "Espresso", "Doppio espresso", "Affogato", "Hot chocolate", "Tea",
];

const posts: { src: string; w: number; h: number; alt: string; caption: string }[] = [
  { src: "ten-years", w: 1000, h: 1415, alt: "Poster: 10 years of Duo Sicilian treats, a crowd of line drawn people inside the numbers, second scoop free for the day", caption: "Ten years, poster" },
  { src: "spots-melting", w: 1000, h: 1250, alt: "Post: spots are melting, a woman lying on the ground in a mint Duo shirt melting into pistachio gelato, with class dates and spots left", caption: "Spots are melting · AI photo" },
  { src: "cream-poster", w: 1000, h: 1415, alt: "Poster: pistachio cream, the Duo jar among pistachios on olive green, get it now", caption: "Pistachio cream, poster" },
  { src: "christmas", w: 1000, h: 1000, alt: "Post: the best Christmas gift in script, a tree and a jar of pistachio cream wearing a Santa hat", caption: "Christmas gift" },
  { src: "winter-season", w: 1000, h: 1251, alt: "Post: winter season starts today, the shop at night, closed in all shops except Skalitzer", caption: "Winter season" },
];

/* ---------- motion ----------

   One entrance for the whole page, slower and softer than the shared one:
   a long ease out (the curve settles rather than stops), a rise of 40px and a
   touch of scale, so a piece arrives like a print laid on a table. Inside a
   framed shot the image itself starts a little larger and settles to fit
   while its frame rises, which reads as depth. Transforms and opacity only. */

const SOFT = [0.22, 1, 0.36, 1] as const;

function Rise({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.1, delay, ease: SOFT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function DuoShot({ src, alt, w, h, caption, sizes = "(min-width: 1240px) 1180px, 100vw" }: { src: string; alt: string; w: number; h: number; caption?: string; sizes?: string }) {
  return (
    <figure className="group">
      <div className="v2-card-bezel overflow-hidden rounded-[20px] border border-[var(--v2-line)] transition-[border-color,transform,box-shadow] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:border-[var(--v2-line-strong)] group-hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)]">
        <motion.div
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.6, ease: SOFT }}
        >
          <Image src={src} alt={alt} width={w} height={h} sizes={sizes} className={`block h-auto w-full ${SETTLE} group-hover:scale-[1.025]`} />
        </motion.div>
      </div>
      {caption && <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">{caption}</figcaption>}
    </figure>
  );
}

/* ---------- pieces ---------- */

/* The hero: the cast walks along the brand's floor line under the wordmark.
   Each character image carries its own line at 57.6% of its height, so the
   strip is placed to put that line exactly on the panel's; the two mints are
   sampled from the images, so the seams disappear. Two copies of the cast
   slide half their width forever; reduced motion leaves them standing. */
function Parade() {
  const still = useReducedMotion();
  const row = [...cast, ...cast];
  return (
    <div
      className="grain relative aspect-[4/3] overflow-hidden rounded-[24px]"
      style={{ background: `linear-gradient(180deg, ${MINT} 0 70%, ${MINT_LIGHT} 70% 100%)` }}
    >
      <Image
        src={`${D}/logo/wordmark-ink.svg`}
        alt="The Duo Sicilian Ice Cream wordmark in ink on mint"
        width={797}
        height={538}
        priority
        className="absolute left-1/2 top-[4%] z-10 h-auto w-[36%] -translate-x-1/2"
      />
      {/* the floor */}
      <span aria-hidden className="absolute inset-x-0 top-[calc(70%-1px)] h-[2px] bg-[#1d1d1b]" />
      <motion.div
        aria-hidden
        className="absolute left-0 top-[35.4%] flex h-[60%] w-max"
        animate={still ? undefined : { x: ["-50%", "0%"] }}
        transition={{ duration: 26, ease: "linear", repeat: Infinity }}
      >
        {row.map((c, i) => (
          <Image
            key={`${c.id}-${i}`}
            src={`${D}/cast/${c.id}.webp`}
            alt=""
            width={900}
            height={1350}
            sizes="200px"
            priority={i < 4}
            className="block h-full w-auto"
          />
        ))}
      </motion.div>
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
      <ul className="grid list-none grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {colours.map((c, k) => (
          <li key={c.hex}>
            <Rise delay={k * 0.05}>
              <motion.button
                onClick={() => copy(c.hex)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", duration: 0.35, bounce: 0.25 }}
                aria-label={`Copy ${c.name} ${c.hex}`}
                className="flex aspect-[4/5] w-full flex-col justify-between rounded-[20px] border border-[var(--v2-line)] p-5 text-left"
                style={{ background: c.hex, color: c.ink }}
              >
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] opacity-70">{copied === c.hex ? "Copied" : `0${k + 1}`}</span>
                <span>
                  <span className="block text-[15px] font-medium">{c.name}</span>
                  <span className="mt-1 block font-mono text-[13px]">{c.hex}</span>
                  <span className="block font-mono text-[11px] opacity-70">RGB {c.rgb}</span>
                  {c.print && <span className="block font-mono text-[11px] opacity-70">{c.print}</span>}
                </span>
              </motion.button>
            </Rise>
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">{copied ? `${copied} copied to clipboard` : ""}</p>
    </div>
  );
}

/* One character: standing on the line, or, on hover, focus or a tap, up
   close the way it sits on the shop window. */
function CastCard({ c, i }: { c: (typeof cast)[number]; i: number }) {
  const [close, setClose] = useState(false);
  return (
    <Rise delay={(i % 4) * 0.05}>
      <figure>
        <button
          type="button"
          onClick={() => setClose((v) => !v)}
          onPointerEnter={(e) => e.pointerType === "mouse" && setClose(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setClose(false)}
          aria-pressed={close}
          aria-label={`${c.name}: show ${close ? "standing" : "up close"}`}
          className="relative block aspect-[2/3] w-full overflow-hidden rounded-[20px] border border-[var(--v2-line)]"
          style={{ background: MINT }}
        >
          <Image src={`${D}/cast/${c.id}.webp`} alt={`${c.name}, line drawn, walking on the mint line`} fill sizes="(min-width: 768px) 25vw, 50vw" className={`object-cover transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${close ? "scale-110 opacity-0" : "scale-100 opacity-100"}`} />
          <Image src={`${D}/cast/${c.id}-close.webp`} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className={`object-cover transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${close ? "scale-100 opacity-100" : "scale-90 opacity-0"}`} />
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-black">
            {close ? "Window" : "Walk"}
          </span>
        </button>
        <figcaption className="mt-3">
          <span className="block text-[15px] font-medium">{c.name}</span>
          <span className="block text-[13px] text-[var(--v2-secondary)]">{c.note}</span>
        </figcaption>
      </figure>
    </Rise>
  );
}

/* Every flavour its own jar: one label system, a new name and drawing each
   time. Pick a flavour, or step through them. */
function Jars() {
  const [i, setI] = useState(0);
  const j = jars[i];
  const step = (d: number) => setI((v) => (v + d + jars.length) % jars.length);
  return (
    <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
      <Rise className="md:col-span-8">
        <div className="relative overflow-hidden rounded-[24px] border border-[var(--v2-line)] bg-white">
          <div className="relative aspect-[4/3]">
            <AnimatePresence initial={false}>
              <motion.div
                key={j.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: SOFT }}
                className="absolute inset-0"
              >
                <Image src={`${D}/flavours/${j.id}.webp`} alt={`An open Duo jar of ${j.name.toLowerCase()} gelato with its mint label`} fill sizes="(min-width: 1240px) 780px, (min-width: 768px) 66vw, 100vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-6">
            <span className="rounded-full px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-black" style={{ background: MINT }} aria-live="polite">
              {String(i + 1).padStart(2, "0")} · {j.name}
            </span>
            <span className="flex gap-2">
              {[-1, 1].map((d) => (
                <motion.button
                  key={d}
                  type="button"
                  onClick={() => step(d)}
                  whileTap={{ scale: 0.92 }}
                  aria-label={d < 0 ? "Previous flavour" : "Next flavour"}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black"
                >
                  <span aria-hidden className={d < 0 ? "-scale-x-100" : ""}>→</span>
                </motion.button>
              ))}
            </span>
          </div>
        </div>
      </Rise>
      <Rise delay={0.06} className="md:col-span-4">
        <ul className="flex list-none flex-wrap gap-1.5 md:flex-col md:flex-nowrap md:gap-1" aria-label="Flavours">
          {jars.map((f, k) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => setI(k)}
                aria-pressed={k === i}
                className={`flex w-full items-center justify-between gap-3 rounded-full border px-3.5 py-1.5 text-left text-[13px] transition-colors duration-200 md:rounded-[12px] md:py-2 ${
                  k === i ? "border-transparent text-black" : "border-[var(--v2-line)] text-[var(--v2-secondary)] hover:text-[var(--v2-ink)]"
                }`}
                style={k === i ? { background: MINT } : undefined}
              >
                <span>{f.name}</span>
                <span aria-hidden className="hidden font-mono text-[10.5px] opacity-60 md:inline">{String(k + 1).padStart(2, "0")}</span>
              </button>
            </li>
          ))}
        </ul>
      </Rise>
    </div>
  );
}

/* The wall: every strip as printed, stacked the way they hang. */
function MenuWall() {
  /* 42 strips is too many motion components; the wall flips one attribute
     when it comes into view and CSS runs each strip's entrance on the
     compositor, staggered by its delay (globals.css, .duo-wall) */
  const [seen, setSeen] = useState(false);
  return (
    <Rise className="mt-12">
      <motion.div
        onViewportEnter={() => setSeen(true)}
        viewport={{ once: true, amount: 0.1 }}
        data-in={seen}
        className="duo-wall rounded-[24px] p-3 md:p-5"
        style={{ background: "#1E2428" }}
      >
        <ul className="grid list-none grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-3">
          {strips.map((name, i) => (
            <li
              key={name}
              className="duo-strip relative hover:z-10"
              style={{ animationDelay: `${(i % 14) * 45 + Math.floor(i / 14) * 90}ms` }}
            >
              <Image
                src={`${D}/menu/${String(i + 1).padStart(2, "0")}.webp`}
                alt={`Menu strip: ${name}`}
                width={1400}
                height={260}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                className="block h-auto w-full"
              />
            </li>
          ))}
        </ul>
      </motion.div>
    </Rise>
  );
}

function Panel({ children, bg, caption, className = "" }: { children: React.ReactNode; bg: string; caption: string; className?: string }) {
  return (
    <figure className="group h-full">
      <div className={`relative flex items-center justify-center overflow-hidden rounded-[24px] border border-[var(--v2-line)] ${className}`} style={{ background: bg }}>
        {children}
      </div>
      <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">{caption}</figcaption>
    </figure>
  );
}

/* ---------- page ---------- */

const SECTION = "scroll-mt-24 border-t border-[var(--v2-line)] py-14 md:py-20";

export function DuoPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="v2-root font-sans [overflow-x:clip]">
        <TopBar />
        <main id="main" className="mx-auto max-w-[1240px] px-5 md:px-8">
          {/* the brand, and what I did for it */}
          <section aria-labelledby="duo-title" className="grid grid-cols-1 gap-10 pb-16 pt-12 md:grid-cols-12 md:gap-8 md:pb-24 md:pt-20">
            <div className="md:col-span-5 md:pt-4">
              <p className="v2-rise flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-secondary)]">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: MINT }} />
                <span style={{ color: MINT }}>Brand</span>
                <span aria-hidden className="text-[var(--v2-label)]">&middot;</span>
                <span>Berlin</span>
              </p>
              <h1 id="duo-title" className="v2-rise v2-rise-1 mt-6 text-balance font-display text-[clamp(2.3rem,4.6vw,4rem)] font-extralight leading-[1.04] tracking-[-0.045em]">
                One logo, grown into a <span className="font-normal">whole shop</span>.
              </h1>
              <p className="v2-rise v2-rise-2 mt-6 max-w-[46ch] text-[16px] leading-relaxed text-[var(--v2-secondary)] md:text-[17px]">
                Duo makes Sicilian gelato in Berlin. When I started, the brand was
                one logo, inside an oval. I took it out of the oval into the formats
                the shops use, drew a cast of characters and a line of drawings for
                the jars, and designed the shirts, the menus, the counter print, the
                campaigns and the events around them.
              </p>
              <dl className="v2-rise v2-rise-3 mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--v2-line)] pt-6">
                {[
                  ["Client", "Duo Sicilian Ice Cream"],
                  ["Role", "In house designer"],
                  ["Made", "Logo, illustration, packaging, print, social"],
                  ["Years", "2024 to now"],
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
                duoicecream.de ↗︎
              </a>
            </div>
            <div className="v2-rise v2-rise-2 md:col-span-7">
              <Tilt strength={0.4} drift={4}>
                <Parade />
              </Tilt>
            </div>
          </section>

          {/* 01 · the shirts */}
          <section id="worn" aria-label="Shirts" className={SECTION}>
            <SectionHead label="01 · Shirts" title="The brand on people.">
              The team shirt carries the scoops on the chest and a caped superhero
              on the back: I make gelato disappear, what&rsquo;s your superpower?
              The apron carries the logo. The photos of people are AI generated
              mockups.
            </SectionHead>
            <div className="mt-12 grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-12">
              <Rise className="md:col-span-7">
                <DuoShot src={`${D}/mockups/tshirts.webp`} w={1400} h={934} alt="Two mint Duo shirts, front with the scoops, back with the superhero" caption="Team shirt, front and back" sizes="(min-width: 768px) 58vw, 100vw" />
              </Rise>
              <Rise delay={0.06} className="md:col-span-5">
                <DuoShot src={`${D}/mockups/apron.webp`} w={1200} h={900} alt="A black apron with the Duo logo" caption="Apron" sizes="(min-width: 768px) 42vw, 100vw" />
              </Rise>
              {[
                { src: "metro", w: 1100, h: 1467, alt: "Two people from behind on a metro platform in mint Duo shirts with the superhero on the back", caption: "Metro · AI mockup" },
                { src: "sea", w: 1100, h: 1375, alt: "A man with white curls licking a gelato cone by the sea, in a mint Duo shirt", caption: "By the sea · AI mockup" },
                { src: "meltdown", w: 1100, h: 1467, alt: "A woman lying on the ground in a mint Duo shirt, melting into pistachio gelato", caption: "Meltdown · AI mockup" },
              ].map((m, k) => (
                <Rise key={m.src} delay={k * 0.06} className="md:col-span-4">
                  <DuoShot src={`${D}/mockups/${m.src}.webp`} w={m.w} h={m.h} alt={m.alt} caption={m.caption} sizes="(min-width: 768px) 33vw, 100vw" />
                </Rise>
              ))}
            </div>
          </section>

          {/* 02 · the logo */}
          <section id="logo" aria-label="Logo" className={SECTION}>
            <SectionHead label="02 · Logo" title="Out of the oval.">
              The logo came as one file, inside an oval. I took it out and rebuilt
              it in the formats the shops use, on mint, on white and in ink, from
              the shop window down to the spoon. This is the one that leads.
            </SectionHead>
            <Rise className="mt-12">
              <div className="group overflow-hidden rounded-[24px] border border-[var(--v2-line)]" style={{ background: "#8BCFBC" }}>
                <div className="mx-auto max-w-[760px]">
                  <Image src={`${D}/logo/logo.webp`} alt="The Duo logo: Duo in hand lettering, since 1972, an orange and a lemon scoop, Sicilian Ice Cream, ink on mint" width={1400} height={1400} sizes="(min-width: 1240px) 760px, 100vw" className={`block h-auto w-full ${SETTLE} group-hover:scale-[1.03]`} />
                </div>
              </div>
            </Rise>
          </section>

          {/* 03 · colour and type */}
          <section id="type" aria-label="Colour and type" className={SECTION}>
            <SectionHead label="03 · Colour and type" title="Mint and ink, with a scoop of lemon.">
              Mint is the shop. Ink carries the words. Lemon and orange come from
              the two scoops in the logo and only ever as accents. Blorp sets the
              titles, Gotham the text. Click a colour to copy it.
            </SectionHead>
            <div className="mt-12 flex flex-col gap-4">
              <Colours />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Rise>
                  <div className="overflow-hidden rounded-[20px] border border-[var(--v2-line)]">
                    <Image src={`${D}/type/blorp.webp`} alt="Type specimen: Blorp for titles, posters and menus, Gelato in ink and Sicilian Street Food in white on mint" width={2400} height={1720} sizes="(min-width: 768px) 50vw, 100vw" className="block h-auto w-full" />
                  </div>
                </Rise>
                <Rise delay={0.06}>
                  <div className="overflow-hidden rounded-[20px] border border-[var(--v2-line)]">
                    <Image src={`${D}/type/gotham.webp`} alt="Type specimen: Gotham in Light, Book, Medium and Bold for text, labels and menus, ink on white" width={2400} height={1720} sizes="(min-width: 768px) 50vw, 100vw" className="block h-auto w-full" />
                  </div>
                </Rise>
              </div>
            </div>
          </section>

          {/* 04 · the cast */}
          <section id="cast" aria-label="Characters" className={SECTION}>
            <SectionHead label="04 · Characters" title="A cast for the counter.">
              Thick line, white fill, a mint floor to walk on. Each one stands for
              something on the counter, walks across posts and stories, and goes up
              close on the shop windows. Hover or tap one to see it on the glass.
              All drawn by me.
            </SectionHead>
            <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-4">
              {cast.map((c, i) => (
                <CastCard key={c.id} c={c} i={i} />
              ))}
            </div>
          </section>

          {/* 05 · packaging */}
          <section id="packaging" aria-label="Packaging" className={SECTION}>
            <SectionHead label="05 · Packaging" title="Every flavour, its own jar.">
              One label for every flavour to take home: the mint band, the logo,
              the name and a line drawing of what is inside. Then the cups, the
              lid and the spoon.
            </SectionHead>
            <Jars />
            <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-12">
              <Rise className="md:col-span-12">
                <DuoShot src={`${D}/pack/group.webp`} w={1800} h={1201} alt="A row of Duo jars on white: mango, raspberry, dark chocolate and more, each with its mint label" caption="The range" />
              </Rise>
              <Rise className="md:col-span-6">
                <DuoShot src={`${D}/pack/cup.webp`} w={1200} h={900} alt="A kraft Duo cup filled with pistachio and chocolate gelato" caption="Cup" sizes="(min-width: 768px) 50vw, 100vw" />
              </Rise>
              <Rise delay={0.06} className="md:col-span-6">
                <DuoShot src={`${D}/pack/cream-jar.webp`} w={1200} h={900} alt="A jar of Duo pistachio cream with its label" caption="Pistachio cream" sizes="(min-width: 768px) 50vw, 100vw" />
              </Rise>
              <Rise className="md:col-span-4">
                <DuoShot src={`${D}/pack/tub-dark.webp`} w={1400} h={1050} alt="A Duo gelato tub with a black lid" caption="Tub" sizes="(min-width: 768px) 33vw, 100vw" />
              </Rise>
              <Rise delay={0.06} className="md:col-span-4">
                <Panel bg="#F4F1EA" caption="Lid, 5.5 litre tub" className="aspect-[4/3]">
                  <Image src={`${D}/pack/lid.webp`} alt="The round lid of the 5.5 litre tub: handmade from the best ingredients in the world, with line drawn scoops" width={1000} height={1000} sizes="(min-width: 768px) 25vw, 70vw" className={`h-[88%] w-auto ${SETTLE} group-hover:rotate-[8deg]`} />
                </Panel>
              </Rise>
              <Rise delay={0.1} className="md:col-span-4">
                <Panel bg="#FFFFFF" caption="Spoon" className="aspect-[4/3]">
                  <Image src={`${D}/pack/spoon.webp`} alt="A wooden spoon printed: stay cool, eat Duo gelato" width={900} height={904} sizes="(min-width: 768px) 25vw, 70vw" className={`h-[86%] w-auto ${SETTLE} group-hover:-rotate-6`} />
                </Panel>
              </Rise>
            </div>
          </section>

          {/* 06 · the wall menu */}
          <section id="menu" aria-label="Wall menu" className={SECTION}>
            <SectionHead label="06 · Wall menu" title="Forty two strips, one wall.">
              Every flavour gets a strip in its own colour, with a line on what it
              is, a drawing of what is in it and a mark for vegan. When the counter
              changes, one strip is reprinted, not the wall.
            </SectionHead>
            <MenuWall />
          </section>

          {/* 07 · the counter */}
          <section id="counter" aria-label="Stamp card" className={SECTION}>
            <SectionHead label="07 · Counter" title="Ten stamps, then a free scoop.">
              The stamp card: a scoop shaped stamp for every gelato, the scoop in
              sunglasses keeping count, and the eleventh one on the house.
            </SectionHead>
            <Rise className="mx-auto mt-12 max-w-[860px]">
              <DuoShot src={`${D}/shop/stamp-card.webp`} w={1400} h={1400} alt="The stamp card, front and back: of course you're loyal to us, ten scoop shaped stamps and the scoop in sunglasses" caption="Stamp card, front and back" sizes="(min-width: 900px) 860px, 100vw" />
            </Rise>
          </section>

          {/* 08 · campaigns */}
          <section id="campaigns" aria-label="Campaigns" className={SECTION}>
            <SectionHead label="08 · Campaigns" title="Posts, posters and two festivals.">
              The year at Duo in its own voice: the tenth birthday, Christmas, a
              class that sells out, the pistachio cream, the winter break. Then
              the two festivals, drawn by hand on crumpled paper in red and yellow:
              the Sicilian Market and the Sicilian Street Food Festival.
            </SectionHead>
            {/* column widths are the inverse of each piece's height to width,
                so every row ends level without cropping a single poster */}
            <div className="mt-12 grid grid-cols-1 items-start gap-x-4 gap-y-8 md:grid-cols-[0.707fr_0.8fr_0.707fr]">
              {posts.slice(0, 3).map((p, k) => (
                <Rise key={p.src} delay={k * 0.08}>
                  <DuoShot src={`${D}/social/${p.src}.webp`} w={p.w} h={p.h} alt={p.alt} caption={p.caption} sizes="(min-width: 768px) 33vw, 100vw" />
                </Rise>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-1 items-start gap-x-4 gap-y-8 md:grid-cols-[1fr_0.8fr]">
              {posts.slice(3).map((p, k) => (
                <Rise key={p.src} delay={k * 0.08}>
                  <DuoShot src={`${D}/social/${p.src}.webp`} w={p.w} h={p.h} alt={p.alt} caption={p.caption} sizes="(min-width: 768px) 50vw, 100vw" />
                </Rise>
              ))}
            </div>
            <div className="mt-8">
              <Label>8.1 · Sicilian Market</Label>
              <div className="mt-6 grid grid-cols-1 items-start gap-x-4 gap-y-8 md:grid-cols-[0.706fr_1fr_1fr]">
                <Rise>
                  <DuoShot src={`${D}/event/poster.webp`} w={1000} h={1416} alt="Sicilian Market poster in red and yellow: a crowd of drawn characters, come and enjoy with us, music, comedy, ice cream, food" caption="Poster, A1" sizes="(min-width: 768px) 33vw, 100vw" />
                </Rise>
                <Rise delay={0.06}>
                  <DuoShot src={`${D}/event/post.webp`} w={1100} h={1100} alt="Sicilian Market post: 10th to 11th November at the Duo ice cream shop, Skalitzer Strasse, 10 euro, the title in a crowd of drawn characters, come and enjoy with us" caption="Announcement post" sizes="(min-width: 768px) 33vw, 100vw" />
                </Rise>
                <Rise delay={0.1}>
                  <DuoShot src={`${D}/event/coming-soon.webp`} w={1100} h={1096} alt="Post on crumpled paper: something is yet to come, music, comedy, ice cream, food and more, with a dog, two cups and a pizza truck drawn in line" caption="Coming soon post" sizes="(min-width: 768px) 33vw, 100vw" />
                </Rise>
              </div>
            </div>

            <div className="mt-16">
              <Label>8.2 · Sicilian Street Food Festival</Label>
              <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-[var(--v2-secondary)]">
                Two days at Festsaal Kreuzberg: live music from Acireale, a DJ set,
                masterclasses, street food and gelato. The same hand and the same
                paper, grown into a poster, a save the date, one post per artist,
                and the banner.
              </p>
              <div className="mt-6 grid grid-cols-1 items-start gap-x-4 gap-y-8 md:grid-cols-3">
                {[
                  { src: "save-the-date", alt: "Post: save the date, Sicilian Street Food Festival, 25th to 26th April", caption: "Save the date" },
                  { src: "i-beddi", alt: "Post: live music from Acireale, I Beddi, a drawn microphone singing", caption: "Artist post · I Beddi" },
                  { src: "marco-meli", alt: "Post: DJ set for Marco Meli, a drawn DJ at the decks", caption: "Artist post · Marco Meli" },
                ].map((f, k) => (
                  <Rise key={f.src} delay={k * 0.08}>
                    <DuoShot src={`${D}/festival/${f.src}.webp`} w={1000} h={1204} alt={f.alt} caption={f.caption} sizes="(min-width: 768px) 33vw, 100vw" />
                  </Rise>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-1 items-start gap-x-4 gap-y-8 md:grid-cols-[0.71fr_1.908fr]">
                <Rise>
                  <DuoShot src={`${D}/festival/poster.webp`} w={1100} h={1549} alt="Sicilian Street Food Festival poster, A1: 25th to 26th April at Festsaal Kreuzberg, the title in a crowd of drawn characters on red and yellow crumpled paper" caption="Poster, A1" sizes="(min-width: 768px) 28vw, 100vw" />
                </Rise>
                <Rise delay={0.08}>
                  <DuoShot src={`${D}/festival/banner.webp`} w={1600} h={838} alt="Facebook banner for the festival, the poster laid out wide" caption="Banner" sizes="(min-width: 768px) 72vw, 100vw" />
                </Rise>
              </div>
            </div>
          </section>
        </main>

        <footer className="mx-auto max-w-[1240px] px-5 pb-14 md:px-8 md:pb-20">
          <div className="grain relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[24px] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-7 md:flex-row md:items-center md:p-10">
            <div>
              <p className="font-display text-[26px] font-extralight leading-tight tracking-[-0.03em] md:text-[34px]">
                Got one logo and a lot of things to put it on?
              </p>
              <p className="mt-2 text-[15px] text-[var(--v2-secondary)]">The logo, the drawings and the print that carry it.</p>
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
