"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";

const EMAIL = "application@juliang.de";
const LINKEDIN = "https://www.linkedin.com/in/julian-gr/";
const CV = "/Julian_Giraldo_CV.pdf";

type Project = {
  slug: string;
  title: string;
  headline: string;
  tags: string[];
  year: string;
  image: string;
  span: string;
  bg: string;
  dark?: boolean;
  imgPosition?: string;
};

const work: Project[] = [
  {
    slug: "erp-duo",
    title: "ERP Duo",
    headline: "Nine locations. One system. Full control.",
    tags: ["Web", "B2B", "ERP"],
    year: "2026",
    image: "/projects/erp-duo/cover.webp",
    span: "md:col-span-7",
    bg: "#EDEDE8",
  },
  {
    slug: "taurus",
    title: "TaurusWebs",
    headline: "From 6 hours to 1: digitizing a whole farm.",
    tags: ["Web", "SaaS", "Agtech"],
    year: "2025",
    image: "/projects/taurus/cover.webp",
    span: "md:col-span-5",
    bg: "#E6EEFA",
  },
  {
    slug: "savee",
    title: "Savee",
    headline: "Meal planning that makes food waste impossible.",
    tags: ["Mobile", "UX", "Sustainability"],
    year: "2025",
    image: "/projects/savee/cover.webp",
    span: "md:col-span-5",
    bg: "#E7F1E9",
  },
  {
    slug: "meinerva",
    title: "Meinerva",
    headline: "Look before you're told: making experimental art legible.",
    tags: ["Research", "UX", "Art & Tech"],
    year: "2025",
    image: "/projects/meinerva/cover.webp",
    span: "md:col-span-7",
    bg: "#151513",
    dark: true,
    imgPosition: "object-center",
  },
];

type Tile = {
  kind: "image" | "text";
  span: string;
  ratio?: string;
  src?: string;
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
    caption: "Field research, Colombia",
    note: "On site with the TaurusWebs team before touching a screen.",
  },
  {
    kind: "image",
    span: "lg:col-span-1",
    ratio: "aspect-[4/3]",
    src: "/projects/meinerva/app-icon.webp",
    caption: "Meinerva, app icon",
    note: "Dotted lettering for the thesis project.",
  },
  {
    kind: "image",
    span: "lg:col-span-1",
    ratio: "aspect-[4/3]",
    src: "/projects/taurus/bootcamp-night.jpg",
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

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export function V2Home() {
  return (
    <main className="relative bg-background text-foreground">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <TopBar />
        <Intro />
        <SelectedWork />
        <OtherThings />
        <Footer />
      </div>
    </main>
  );
}

function TopBar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-6">
      <Link
        href="/v2"
        className="font-mono text-[13px] uppercase tracking-[0.16em]"
        data-cursor-hover
      >
        Julian Giraldo
      </Link>
      <nav className="flex items-center gap-2">
        <Pill href={LINKEDIN}>linkedin</Pill>
        <Pill href={`mailto:${EMAIL}`}>{EMAIL}</Pill>
        <Pill href={CV}>cv</Pill>
      </nav>
    </header>
  );
}

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http") || href.endsWith(".pdf");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-cursor-hover
      className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-[12px] md:text-[13px] lowercase text-background transition-opacity hover:opacity-80"
    >
      {children}
      <span aria-hidden className="text-[0.85em] opacity-70">
        ↗
      </span>
    </a>
  );
}

function Intro() {
  return (
    <section className="pt-16 pb-14 md:pt-28 md:pb-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-center justify-center gap-2 mb-8"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-subtle px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/70">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          open for work
        </span>
        <span className="rounded-full bg-subtle px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/70">
          Berlin, DE
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[860px] font-display font-light tracking-[-0.025em] leading-[1.16] text-[clamp(1.7rem,3.7vw,3rem)]"
      >
        Product Designer in Berlin. I work on B2B SaaS, internal tools and data
        heavy interfaces, where dense information has to feel calm and usable.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="mx-auto mt-7 max-w-[560px] text-[15px] md:text-[17px] leading-relaxed text-muted"
      >
        4 years in product, 8+ years designing. I design products I also use
        myself: the ERP I built at Duo Sicilian Ice Cream runs daily across nine
        locations and six departments.
      </motion.p>
    </section>
  );
}

function SelectedWork() {
  return (
    <section id="work" className="pb-8">
      <SectionLabel left="selected work" right={`${work.length} projects`} />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
        {work.map((p, i) => (
          <WorkCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function WorkCard({ project, index }: { project: Project; index: number }) {
  const dark = project.dark;
  return (
    <motion.article
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: (index % 2) * 0.06 }}
      className={`${project.span} col-span-1`}
    >
      <Link
        href={`/work/${project.slug}`}
        data-cursor-hover
        className="group relative flex h-[440px] md:h-[520px] flex-col overflow-hidden rounded-[28px] p-6 md:p-9"
        style={{ backgroundColor: project.bg }}
      >
        <div className="relative z-10 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                dark ? "bg-white/12 text-white/75" : "bg-white/70 text-foreground/60"
              }`}
            >
              {t}
            </span>
          ))}
        </div>

        <h3
          className={`relative z-10 mt-5 max-w-[15ch] font-display font-light tracking-[-0.025em] leading-[1.08] text-[26px] md:text-[34px] ${
            dark ? "text-white" : "text-foreground"
          }`}
        >
          {project.headline}
        </h3>

        <span
          className={`relative z-10 mt-4 font-mono text-[11px] uppercase tracking-[0.16em] ${
            dark ? "text-white/50" : "text-foreground/45"
          }`}
        >
          {project.title} · {project.year}
        </span>

        <div className="relative z-10 mt-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-[13px] text-foreground shadow-sm transition-transform duration-300 group-hover:translate-x-1">
            Read
            <span aria-hidden>→</span>
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-6 bottom-0 h-[46%] md:inset-x-9 md:h-[48%] translate-y-[14%] overflow-hidden rounded-t-2xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={`object-cover ${project.imgPosition ?? "object-top"} transition-transform duration-700 ease-out group-hover:scale-[1.04]`}
            priority={index < 2}
          />
        </div>
      </Link>
    </motion.article>
  );
}

function OtherThings() {
  return (
    <section id="other" className="pt-20 md:pt-28">
      <SectionLabel left="design and other things" right="visual work" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {other.map((tile, i) => (
          <motion.div
            key={tile.caption}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: (i % 3) * 0.05 }}
            className={`col-span-1 ${tile.span}`}
          >
            {tile.kind === "image" ? (
              <figure className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-subtle">
                <div className={`relative w-full ${tile.ratio}`}>
                  <Image
                    src={tile.src as string}
                    alt={tile.caption}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="px-5 py-4">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/70">
                    {tile.caption}
                  </span>
                  <span className="mt-1.5 block text-[14px] leading-relaxed text-muted">
                    {tile.note}
                  </span>
                </figcaption>
              </figure>
            ) : (
              <div className="flex h-full flex-col rounded-[22px] bg-subtle px-6 py-7">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/70">
                  {tile.years}
                </span>
                <h3 className="mt-3 font-display font-light text-[20px] md:text-[23px] leading-[1.15] tracking-[-0.02em]">
                  {tile.caption}
                </h3>
                <p className="mt-3 max-w-[60ch] text-[14px] leading-relaxed text-muted">
                  {tile.note}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SectionLabel({ left, right }: { left: string; right: string }) {
  return (
    <div className="mb-5 flex items-end justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
      <span className="text-foreground">{left}</span>
      <span>{right}</span>
    </div>
  );
}

function Footer() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <footer id="contact" className="pt-20 pb-14 md:pt-28 md:pb-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <h2 className="font-display font-light text-[28px] md:text-[36px] tracking-[-0.025em] leading-[1.1]">
            Get in touch
          </h2>
          <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-muted">
            Open to Product Design roles in Berlin or remote. Happy to walk you
            through any of these projects.
          </p>
        </div>

        <div className="md:col-span-7 md:max-w-[460px] md:justify-self-end w-full space-y-2">
          <LinkRow href={CV} label="CV, PDF" />
          <LinkRow href={LINKEDIN} label="LinkedIn" />
          <div className="flex items-center gap-2">
            <LinkRow href={`mailto:${EMAIL}`} label={EMAIL} className="flex-1" />
            <button
              type="button"
              onClick={copy}
              data-cursor-hover
              aria-label="Copy email address"
              className="shrink-0 rounded-2xl border border-border px-4 py-3.5 text-[13px] text-muted transition-colors hover:border-foreground hover:text-foreground"
            >
              {copied ? "copied" : "copy"}
            </button>
          </div>
          <LinkRow href="/" label="Portfolio v1" />
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} · julian giraldo</span>
        <span>berlin · 52.5200°N 13.4050°E</span>
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
      className={`group flex items-center justify-between gap-3 rounded-2xl bg-subtle px-5 py-3.5 text-[14px] transition-colors hover:bg-foreground hover:text-background ${className}`}
    >
      <span className="truncate">{label}</span>
      <span aria-hidden className="opacity-50 transition-transform duration-300 group-hover:translate-x-0.5">
        ↗
      </span>
    </a>
  );
}
