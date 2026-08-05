"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { useState } from "react";
import { FluidName } from "./FluidName";
import { ProjectStage, type StageProject } from "./ProjectStage";

const EMAIL = "application@juliang.de";
const LINKEDIN = "https://www.linkedin.com/in/julian-gr/";
const CV = "/Julian_Giraldo_CV.pdf";

/* v2 palette: Apple-adjacent neutrals, AA+ contrast on white.
   ink #1d1d1f · secondary #55555a (7:1) · label #6e6e73 (4.9:1, >=12px) */
const INK = "#1d1d1f";
const SECONDARY = "#55555a";
const LABEL = "#6e6e73";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const work: StageProject[] = [
  {
    slug: "erp-duo",
    title: "ERP Duo",
    headline: "Nine locations. One system. Full control.",
    tags: ["Web", "B2B", "ERP"],
    year: "2026",
    image: "/projects/erp-duo/cover.webp",
    alt: "ERP Duo dashboard with inventory charts, shown on a desktop monitor",
    bg: "#F0F0EB",
  },
  {
    slug: "taurus",
    title: "TaurusWebs",
    headline: "From 6 hours to 1: digitizing a whole farm.",
    tags: ["Web", "SaaS", "Agtech"],
    year: "2025",
    image: "/projects/taurus/cover.webp",
    alt: "TaurusWebs bulk entry table for registering farm animals",
    bg: "#EAF1F9",
  },
  {
    slug: "savee",
    title: "Savee",
    headline: "Meal planning that makes food waste impossible.",
    tags: ["Mobile", "UX", "Sustainability"],
    year: "2025",
    image: "/projects/savee/cover.webp",
    alt: "Hand holding a phone with the glowing green Savee app splash screen",
    bg: "#ECF3ED",
  },
  {
    slug: "meinerva",
    title: "Meinerva",
    headline: "Look before you're told: making experimental art legible.",
    tags: ["Research", "UX", "Art & Tech"],
    year: "2025",
    image: "/projects/meinerva/cover.webp",
    alt: "Meinerva wordmark in dotted lettering on a dark background",
    bg: "#101013",
    dark: true,
    imgPosition: "object-center",
  },
];

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

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: EASE },
};

export function V2Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white font-sans" style={{ color: INK }}>
        <TopBar />
        <main id="main" className="mx-auto max-w-[1240px] px-5 md:px-8">
          <Intro />
          <SelectedWork />
          <OtherThings />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/70 backdrop-blur-xl">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#1d1d1f] focus:px-5 focus:py-3 focus:text-[14px] focus:text-white"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3 md:px-8">
        <Link
          href="/v2"
          className="rounded-md py-2 text-[14px] font-medium tracking-[-0.01em]"
        >
          Julian Giraldo
        </Link>
        <nav aria-label="Contact links" className="flex items-center gap-2">
          <Pill href={LINKEDIN}>LinkedIn</Pill>
          <Pill href={`mailto:${EMAIL}`} shortLabel="Email">
            {EMAIL}
          </Pill>
          <Pill href={CV}>CV</Pill>
        </nav>
      </div>
    </header>
  );
}

function Pill({
  href,
  children,
  shortLabel,
}: {
  href: string;
  children: React.ReactNode;
  shortLabel?: string;
}) {
  const external = href.startsWith("http") || href.endsWith(".pdf");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-cursor-hover
      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#1d1d1f] px-4 text-[13px] text-white transition-[opacity,transform] duration-200 hover:opacity-85 motion-safe:active:scale-[0.97]"
    >
      {shortLabel ? (
        <>
          <span className="sm:hidden">{shortLabel}</span>
          <span className="hidden sm:inline">{children}</span>
        </>
      ) : (
        children
      )}
      {external && (
        <>
          <span aria-hidden className="text-[0.8em] opacity-60">
            ↗
          </span>
          <span className="sr-only">(opens in new tab)</span>
        </>
      )}
    </a>
  );
}

function Intro() {
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section aria-label="Introduction" className="pb-16 pt-16 text-center md:pb-24 md:pt-28">
      <motion.p {...rise(0)} className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#F5F5F7] px-3.5 py-2 text-[12px] font-medium tracking-[0.02em] text-[#3a7d44]">
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#3a7d44]" />
          Open for work
        </span>
        <span className="rounded-full bg-[#F5F5F7] px-3.5 py-2 text-[12px] font-medium tracking-[0.02em]" style={{ color: SECONDARY }}>
          Berlin, DE
        </span>
      </motion.p>

      <motion.h1
        {...rise(0.08)}
        className="mx-auto mt-8 max-w-[820px] text-balance text-[clamp(1.9rem,4.2vw,3.35rem)] font-medium leading-[1.12] tracking-[-0.025em]"
      >
        Product Designer in Berlin. I make dense, data heavy products feel calm
        and usable.
      </motion.h1>

      <motion.p
        {...rise(0.16)}
        className="mx-auto mt-6 max-w-[560px] text-[16px] leading-relaxed md:text-[18px]"
        style={{ color: SECONDARY }}
      >
        4 years in product, 8+ years designing. I design products I also use
        myself: the ERP I built at Duo Sicilian Ice Cream runs daily across nine
        locations and six departments.
      </motion.p>
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
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <h2
        id={id}
        className="font-mono text-[12px] font-medium uppercase tracking-[0.18em]"
        style={{ color: INK }}
      >
        {children}
      </h2>
      {aside && (
        <span className="font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: LABEL }}>
          {aside}
        </span>
      )}
    </div>
  );
}

function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="pb-6">
      <SectionHeading id="work-heading" aside="4 projects">
        Selected work
      </SectionHeading>
      <ul className="grid list-none grid-cols-1 gap-10 md:grid-cols-12 md:gap-x-5 md:gap-y-16">
        {work.map((p, i) => (
          <ProjectStage key={p.slug} project={p} index={i} wide={i % 2 === 0} />
        ))}
      </ul>
    </section>
  );
}

function OtherThings() {
  return (
    <section id="other" aria-labelledby="other-heading" className="pt-16 md:pt-24">
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
              <figure className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-[#F5F5F7]">
                <div className={`relative w-full overflow-hidden ${tile.ratio}`}>
                  <Image
                    src={tile.src as string}
                    alt={tile.alt as string}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="px-5 py-4">
                  <span className="block text-[14px] font-medium tracking-[-0.01em]">
                    {tile.caption}
                  </span>
                  <span className="mt-1 block text-[14px] leading-relaxed" style={{ color: SECONDARY }}>
                    {tile.note}
                  </span>
                </figcaption>
              </figure>
            ) : (
              <div className="flex h-full flex-col rounded-[24px] bg-[#F5F5F7] px-6 py-7">
                <span className="font-mono text-[12px] uppercase tracking-[0.16em]" style={{ color: LABEL }}>
                  {tile.years}
                </span>
                <h3 className="mt-3 text-[19px] font-medium leading-[1.2] tracking-[-0.015em] md:text-[21px]">
                  {tile.caption}
                </h3>
                <p className="mt-2.5 max-w-[62ch] text-[14px] leading-relaxed" style={{ color: SECONDARY }}>
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
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <footer aria-labelledby="contact-heading" className="mx-auto max-w-[1240px] px-5 pb-14 pt-20 md:px-8 md:pb-20 md:pt-28">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 id="contact-heading" className="text-[28px] font-medium tracking-[-0.02em] md:text-[34px]">
            Get in touch
          </h2>
          <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed" style={{ color: SECONDARY }}>
            Open to Product Design roles in Berlin or remote. Happy to walk you
            through any of these projects.
          </p>
        </div>

        <div className="w-full space-y-2 md:col-span-7 md:max-w-[460px] md:justify-self-end">
          <LinkRow href={CV} label="CV, PDF" />
          <LinkRow href={LINKEDIN} label="LinkedIn" />
          <div className="flex items-center gap-2">
            <LinkRow href={`mailto:${EMAIL}`} label={EMAIL} className="flex-1" />
            <button
              type="button"
              onClick={copy}
              data-cursor-hover
              className="min-h-[48px] shrink-0 rounded-2xl border border-black/[0.12] px-4 text-[13px] font-medium transition-colors duration-200 hover:border-black/40 motion-safe:active:scale-[0.97]"
              style={{ color: SECONDARY }}
            >
              {copied ? "Copied" : "Copy"}
              <span className="sr-only"> email address</span>
            </button>
            <span aria-live="polite" className="sr-only">
              {copied ? "Email address copied to clipboard" : ""}
            </span>
          </div>
          <LinkRow href="/" label="Portfolio v1" />
        </div>
      </div>

      <div className="mt-16 md:mt-20">
        <FluidName text="JulianG" />
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-black/[0.06] pt-6 font-mono text-[12px] uppercase tracking-[0.16em] md:flex-row md:items-center md:justify-between" style={{ color: LABEL }}>
        <span>© {new Date().getFullYear()} · Julian Giraldo</span>
        <span>Berlin · 52.5200°N 13.4050°E</span>
      </div>
    </footer>
  );
}

function LinkRow({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const external = href.startsWith("http") || href.endsWith(".pdf");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-cursor-hover
      className={`group flex min-h-[48px] items-center justify-between gap-3 rounded-2xl bg-[#F5F5F7] px-5 text-[14px] font-medium transition-colors duration-200 hover:bg-[#1d1d1f] hover:text-white motion-safe:active:scale-[0.99] ${className}`}
    >
      <span className="truncate">{label}</span>
      {external && <span className="sr-only">(opens in new tab)</span>}
      <span aria-hidden className="opacity-50 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5">
        ↗
      </span>
    </a>
  );
}
