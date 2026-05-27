"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";

type Stat = { number: string; caption: string; icon?: StatIcon };
type StatIcon = "percent" | "bolt" | "globe" | "leaf" | "triangle" | "dot";
type ListItem = { title: string; body: string };
type QuestionItem = { question: string; hint: string };
type ScreenItem = { src: string; alt: string };
type SectionImage = {
  src: string;
  alt: string;
  /** "below" (default) stacks under text · "right" / "left" places beside text */
  position?: "below" | "right" | "left";
  caption?: string;
  bg?: string;
  width?: string;
};

type TextSection = {
  kind: "text";
  label: string;
  heading: string;
  body?: string[];
  stats?: Stat[];
  footer?: string;
  image?: SectionImage;
};

type ListSection = {
  kind: "list";
  label: string;
  heading: string;
  body?: string[];
  items: ListItem[];
};

type QuestionsSection = {
  kind: "questions";
  label: string;
  heading: string;
  body?: string[];
  items: QuestionItem[];
};

type ScreensSection = {
  kind: "screens";
  label: string;
  heading: string;
  body?: string[];
  images: ScreenItem[];
};

type FlowSection = {
  kind: "flow";
  label: string;
  heading: string;
  body?: string[];
};

type DemoSection = {
  kind: "demo";
  label: string;
  heading: string;
  body?: string[];
  url: string;
};

type GallerySection = {
  kind: "gallery";
  label: string;
  heading: string;
  body?: string[];
  images: Array<{ src: string; alt: string; caption?: string }>;
};

type Section =
  | TextSection
  | ListSection
  | QuestionsSection
  | ScreensSection
  | FlowSection
  | DemoSection
  | GallerySection;

type Meta = {
  index: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  tags: string[];
  note?: string;
  status?: string;
};

export function CaseStudy({
  meta,
  cover,
  sections,
  currentSlug,
}: {
  meta: Meta;
  cover: { src?: string; alt: string; gradient?: string };
  sections: Section[];
  currentSlug?: string;
}) {
  return (
    <main className="relative pb-24">
      <header className="px-6 md:px-10 pt-28 md:pt-40 pb-10 md:pb-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="font-mono text-[12px] uppercase tracking-[0.22em] text-muted mb-6">
            <span className="text-foreground">[ {meta.index} ]</span>
            <span className="mx-3 opacity-40">/</span>
            case study
          </div>
          <HeadingReveal>
            <h1 className="font-display font-extralight uppercase tracking-[-0.04em] leading-[0.9] text-[clamp(3rem,11vw,9rem)]">
              {meta.title}
            </h1>
          </HeadingReveal>
          <p className="mt-6 md:mt-10 max-w-2xl font-display font-light text-xl md:text-2xl tracking-[-0.01em] text-muted">
            {meta.subtitle}
          </p>

          <dl className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.22em] border-t border-border pt-8">
            <MetaItem label="Year" value={meta.year} />
            <MetaItem label="Role" value={meta.role} />
            <MetaItem label="Tags" value={meta.tags.join(" · ")} />
            <MetaItem label="Status" value={meta.status ?? `Concept · ${meta.year}`} />
          </dl>

          {meta.note && (
            <p className="mt-10 max-w-3xl font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-muted border-l border-border pl-4">
              // {meta.note}
            </p>
          )}
        </div>
      </header>

      <Cover src={cover.src} alt={cover.alt} gradient={cover.gradient} />

      <div className="px-6 md:px-10 mt-20 md:mt-32">
        <div className="mx-auto max-w-[1400px] space-y-24 md:space-y-32">
          {sections.map((s, i) => (
            <SectionBlock key={i} section={s} />
          ))}
        </div>
      </div>

      <MoreWork currentSlug={currentSlug} />

      <footer className="mt-16 px-6 md:px-10 border-t border-border pt-10 pb-10">
        <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row md:items-center md:justify-between gap-6 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.22em]">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 hover:text-muted transition-colors"
            data-cursor-hover
          >
            ← back to index
          </Link>
          <span className="text-muted">
            © {new Date().getFullYear()} · julian giraldo · v.2026.04
          </span>
        </div>
      </footer>
    </main>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function Cover({ src, alt, gradient }: { src?: string; alt: string; gradient?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div
      ref={ref}
      className={`relative mx-6 md:mx-10 aspect-[16/9] md:aspect-[16/8] overflow-hidden ${gradient ? "bg-[#0a0a0a]" : "bg-[#e8e8e6]"}`}
    >
      <motion.div style={{ y }} className={`absolute inset-0 scale-110 ${gradient ?? ""}`}>
        {src && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
      </motion.div>
    </div>
  );
}

function SectionBlock({ section }: { section: Section }) {
  return (
    <section className="grid grid-cols-12 gap-6 md:gap-10">
      <div className="col-span-12 md:col-span-3 md:sticky md:top-28 md:self-start">
        <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.22em] text-muted">
          {section.label}
        </span>
      </div>

      <div className={`col-span-12 space-y-8 md:space-y-12 ${section.kind === "demo" ? "" : "md:col-span-9"}`}>
        <HeadingReveal>
          <h2 className="font-display font-extralight tracking-[-0.025em] leading-[1.05] text-[clamp(1.75rem,3.6vw,3rem)] max-w-3xl">
            {section.heading}
          </h2>
        </HeadingReveal>

        {section.kind === "text" && (() => {
          const img = section.image;
          const beside = img && (img.position === "right" || img.position === "left");
          const textBlock = (
            <div className="space-y-6 md:space-y-8">
              {section.body &&
                section.body.map((p, i) => (
                  <p key={i} className="max-w-2xl text-base md:text-lg leading-relaxed text-muted">
                    {p}
                  </p>
                ))}
              {section.stats && <StatsRow stats={section.stats} />}
              {section.footer && (
                <p className="max-w-2xl text-sm md:text-base leading-relaxed text-muted border-l border-border pl-4">
                  {section.footer}
                </p>
              )}
            </div>
          );
          if (beside) {
            const left = img.position === "left";
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start">
                {left && <SectionMedia image={img} />}
                {textBlock}
                {!left && <SectionMedia image={img} />}
              </div>
            );
          }
          return (
            <>
              {textBlock}
              {img && <SectionMedia image={img} />}
            </>
          );
        })()}

        {section.kind === "list" && (
          <>
            {section.body &&
              section.body.map((p, i) => (
                <p
                  key={i}
                  className="max-w-2xl text-base md:text-lg leading-relaxed text-muted"
                >
                  {p}
                </p>
              ))}
            <ol className="divide-y divide-border border-t border-border">
              {section.items.map((item, i) => (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.9,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="grid grid-cols-12 gap-4 md:gap-10 py-7 md:py-9"
                >
                  <span className="col-span-2 md:col-span-1 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.22em] text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="col-span-10 md:col-span-4 font-display font-light text-lg md:text-2xl tracking-[-0.01em]">
                    {item.title}
                  </h3>
                  <p className="col-span-12 md:col-span-7 text-sm md:text-base leading-relaxed text-muted">
                    {item.body}
                  </p>
                </motion.li>
              ))}
            </ol>
          </>
        )}

        {section.kind === "questions" && (
          <>
            {section.body &&
              section.body.map((p, i) => (
                <p
                  key={i}
                  className="max-w-2xl text-base md:text-lg leading-relaxed text-muted"
                >
                  {p}
                </p>
              ))}
            <QuestionsGrid items={section.items} />
          </>
        )}

        {section.kind === "screens" && (
          <>
            {section.body &&
              section.body.map((p, i) => (
                <p
                  key={i}
                  className="max-w-2xl text-base md:text-lg leading-relaxed text-muted"
                >
                  {p}
                </p>
              ))}
            <ScreensGrid images={section.images} />
          </>
        )}

        {section.kind === "gallery" && (
          <>
            {section.body &&
              section.body.map((p, i) => (
                <p key={i} className="max-w-2xl text-base md:text-lg leading-relaxed text-muted">{p}</p>
              ))}
            <div className="space-y-4 md:space-y-6">
              {section.images.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.85, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full overflow-hidden border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt} className="block w-full h-auto" />
                  {img.caption && (
                    <p className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted border-t border-border">
                      {img.caption}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}

        {section.kind === "flow" && (
          <>
            {section.body &&
              section.body.map((p, i) => (
                <p
                  key={i}
                  className="max-w-2xl text-base md:text-lg leading-relaxed text-muted"
                >
                  {p}
                </p>
              ))}
            <FlowDiagram />
          </>
        )}

        {section.kind === "demo" && (
          <>
            {section.body &&
              section.body.map((p, i) => (
                <p
                  key={i}
                  className="max-w-2xl text-base md:text-lg leading-relaxed text-muted"
                >
                  {p}
                </p>
              ))}
          </>
        )}
      </div>

      {section.kind === "demo" && (
        <div className="col-span-12 mt-2">
          <DemoFrame url={section.url} />
        </div>
      )}
    </section>
  );
}

function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 pt-4 border-t border-border">
      {stats.map((s, i) => (
        <motion.div
          key={s.number}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.9,
            delay: i * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col gap-4 pt-6"
        >
          <StatGlyph icon={s.icon ?? inferIcon(s.number)} />
          <span className="font-display font-extralight text-5xl md:text-6xl tracking-[-0.03em] leading-none">
            {s.number}
          </span>
          <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-muted leading-relaxed">
            {s.caption}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function inferIcon(num: string): StatIcon {
  if (num.includes("%")) return "percent";
  if (/B\+?$|M\+?$/i.test(num)) return "globe";
  return "dot";
}

function StatGlyph({ icon }: { icon: StatIcon }) {
  const common = "w-5 h-5 text-foreground";
  switch (icon) {
    case "percent":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <circle cx="7" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="17" cy="17" r="2.4" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 19 19 5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path
            d="M13 3 5 14h6l-1 7 8-11h-6l1-7z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M3.6 12h16.8M12 3.6c2.6 3 2.6 13.8 0 16.8M12 3.6c-2.6 3-2.6 13.8 0 16.8"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path
            d="M20 4c0 9-6 16-16 16 0-9 6-16 16-16zM4 20 14 10"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path
            d="M12 4 21 20H3L12 4z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      );
  }
}

function SectionMedia({ image }: { image: SectionImage }) {
  const beside = image.position === "right" || image.position === "left";

  let content: React.ReactNode;
  if (beside) {
    // Natural proportions — no fixed container, no letterboxing
    content = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.src}
        alt={image.alt}
        className="block w-full h-auto"
      />
    );
  } else {
    // Below: full width, bg wrapper hugs the image proportionally
    const img = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.src}
        alt={image.alt}
        style={image.width ? { width: image.width, maxWidth: image.width } : undefined}
        className={`block h-auto${image.width ? " mx-auto" : " w-full"}`}
      />
    );
    content = image.bg ? (
      <div
        className={`${image.bg}${image.width ? " mx-auto" : " w-full"}`}
        style={image.width ? { width: image.width } : undefined}
      >
        {img}
      </div>
    ) : img;
  }

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="m-0"
    >
      {content}
      {image.caption && (
        <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {image.caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

function QuestionsGrid({ items }: { items: QuestionItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px border border-border bg-border overflow-hidden">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="bg-background p-6 md:p-8 flex flex-col gap-5"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="font-display font-light text-lg md:text-xl tracking-[-0.01em] leading-snug">
            {item.question}
          </p>
          <span className="mt-auto font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-muted border-t border-border pt-4">
            {item.hint}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function ScreensGrid({ images }: { images: Array<{ src: string; alt: string }> }) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-3 md:gap-5" style={{ minWidth: "max-content" }}>
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.85, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 bg-[#0a0a0a] overflow-hidden border border-border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              className="block h-[480px] md:h-[560px] w-auto"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Light-theme flow diagram ─────────────────────────────────────────────── */

const F = {
  bg: "#ffffff",
  subtle: "#f5f5f2",
  border: "rgba(10,10,10,0.12)",
  dark: "#0a0a0a",
  white: "#ffffff",
  muted: "#8a8a88",
  diamond: "#fdf9ed",
  diamondBorder: "rgba(10,10,10,0.18)",
  alert: "#fdfbf0",
  alertBorder: "rgba(160,120,0,0.35)",
  alertText: "#6b4f00",
  arrowMain: "#0a0a0a",
  arrowBack: "rgba(10,10,10,0.28)",
  arrowAlert: "rgba(160,120,0,0.7)",
  divider: "rgba(10,10,10,0.07)",
  loop: "rgba(10,10,10,0.18)",
};

function FlowDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="w-full border border-border overflow-hidden"
    >
      {/* Phase header */}
      <div className="grid grid-cols-4 border-b border-border">
        {[
          "1 · Onboarding",
          "2 · Discover & Schedule",
          "3 · Shop & Cook",
          "4 · Track & Loop",
        ].map((p, i) => (
          <div
            key={i}
            className={`px-5 py-4 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-muted ${i < 3 ? "border-r border-border" : ""
              }`}
          >
            {p}
          </div>
        ))}
      </div>

      {/* SVG canvas */}
      <div className="w-full overflow-x-auto bg-background">
        <svg
          viewBox="0 0 3300 760"
          width="3300"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", minWidth: "3300px" }}
        >
          <defs>
            {/* Arrow markers */}
            <marker
              id="lf-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,1 L9,5 L0,9 z" fill={F.arrowMain} />
            </marker>
            <marker
              id="lf-arrowBack"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,1 L9,5 L0,9 z" fill={F.arrowBack} />
            </marker>
            <marker
              id="lf-arrowAlert"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0,1 L9,5 L0,9 z" fill={F.arrowAlert} />
            </marker>
          </defs>

          {/* Phase dividers */}
          <g stroke={F.divider} strokeWidth="1" strokeDasharray="3 9">
            <line x1="760" y1="0" x2="760" y2="760" />
            <line x1="1720" y1="0" x2="1720" y2="760" />
            <line x1="2520" y1="0" x2="2520" y2="760" />
          </g>

          {/* ═══ PHASE 1: ONBOARDING ═══ */}

          {/* Open Savee — filled dark */}
          <rect x="40" y="330" width="155" height="82" rx="6" fill={F.dark} />
          <text x="117" y="366" textAnchor="middle" fill={F.white} fontSize="13" fontWeight="700" fontFamily="-apple-system,sans-serif">Open Savee</text>
          <text x="117" y="385" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="-apple-system,sans-serif">launch app</text>

          {/* Sign up / Log in */}
          <rect x="226" y="330" width="174" height="82" rx="6" fill={F.subtle} stroke={F.border} strokeWidth="1" />
          <text x="313" y="366" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">Sign up / Log in</text>
          <text x="313" y="385" textAnchor="middle" fill={F.muted} fontSize="10" fontFamily="-apple-system,sans-serif">Email · Apple · Google</text>

          {/* Preferences — circle */}
          <circle cx="522" cy="371" r="72" fill={F.bg} stroke={F.border} strokeWidth="1.2" />
          <text x="522" y="361" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">Answer</text>
          <text x="522" y="379" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">preferences</text>
          <text x="522" y="397" textAnchor="middle" fill={F.muted} fontSize="10" fontFamily="-apple-system,sans-serif">diet · skill · goals</text>

          {/* Profile ready — filled dark */}
          <rect x="622" y="330" width="98" height="82" rx="6" fill={F.dark} />
          <text x="671" y="366" textAnchor="middle" fill={F.white} fontSize="12" fontWeight="700" fontFamily="-apple-system,sans-serif">Profile</text>
          <text x="671" y="385" textAnchor="middle" fill={F.white} fontSize="12" fontWeight="700" fontFamily="-apple-system,sans-serif">ready ✓</text>

          {/* Phase 1 arrows */}
          <g stroke={F.arrowMain} strokeWidth="1.5" fill="none" markerEnd="url(#lf-arrow)">
            <line x1="196" y1="371" x2="220" y2="371" />
            <line x1="400" y1="371" x2="444" y2="371" />
            <line x1="597" y1="371" x2="616" y2="371" />
            <line x1="721" y1="371" x2="762" y2="371" />
          </g>

          {/* ═══ PHASE 2: DISCOVER & SCHEDULE ═══ */}

          {/* Home Feed — filled dark */}
          <rect x="776" y="330" width="154" height="82" rx="6" fill={F.dark} />
          <text x="853" y="366" textAnchor="middle" fill={F.white} fontSize="13" fontWeight="700" fontFamily="-apple-system,sans-serif">Home Feed</text>
          <text x="853" y="385" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="-apple-system,sans-serif">video scroll</text>

          {/* Watch recipe — circle */}
          <circle cx="1024" cy="371" r="66" fill={F.bg} stroke={F.border} strokeWidth="1.2" />
          <text x="1024" y="363" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">Watch</text>
          <text x="1024" y="381" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">recipe video</text>

          {/* Interested? — diamond */}
          <polygon points="1150,371 1232,293 1314,371 1232,449" fill={F.diamond} stroke={F.diamondBorder} strokeWidth="1.2" />
          <text x="1232" y="366" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">Interested?</text>
          <text x="1232" y="384" textAnchor="middle" fill={F.muted} fontSize="11" fontFamily="-apple-system,sans-serif">♥</text>

          {/* ♥ Like */}
          <rect x="1152" y="170" width="162" height="66" rx="6" fill={F.subtle} stroke={F.border} strokeWidth="1" />
          <text x="1233" y="199" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">♥ Like</text>
          <text x="1233" y="218" textAnchor="middle" fill={F.muted} fontSize="10" fontFamily="-apple-system,sans-serif">feeds algorithm</text>

          {/* 🔖 Save */}
          <rect x="1152" y="506" width="162" height="66" rx="6" fill={F.subtle} stroke={F.border} strokeWidth="1" />
          <text x="1233" y="535" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">Save</text>
          <text x="1233" y="554" textAnchor="middle" fill={F.muted} fontSize="10" fontFamily="-apple-system,sans-serif">for later</text>

          {/* Add to list — filled dark */}
          <rect x="1358" y="330" width="164" height="82" rx="6" fill={F.dark} />
          <text x="1440" y="366" textAnchor="middle" fill={F.white} fontSize="13" fontWeight="700" fontFamily="-apple-system,sans-serif">🍴+ Add recipe</text>
          <text x="1440" y="385" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="-apple-system,sans-serif">to shopping list</text>

          {/* Pick date — circle */}
          <circle cx="1622" cy="371" r="66" fill={F.bg} stroke={F.border} strokeWidth="1.2" />
          <text x="1622" y="357" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">Pick cooking</text>
          <text x="1622" y="375" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">date</text>
          <text x="1622" y="393" textAnchor="middle" fill={F.muted} fontSize="10" fontFamily="-apple-system,sans-serif">calendar view</text>

          {/* Phase 2 arrows */}
          <g stroke={F.arrowMain} strokeWidth="1.5" fill="none" markerEnd="url(#lf-arrow)">
            <line x1="930" y1="371" x2="954" y2="371" />
            <line x1="1090" y1="371" x2="1144" y2="371" />
            <line x1="1314" y1="371" x2="1352" y2="371" />
            <line x1="1522" y1="371" x2="1550" y2="371" />
            {/* branch up to ♥ Like */}
            <path d="M 1232 293 L 1232 240" />
            {/* branch down to 🔖 Save */}
            <path d="M 1232 449 L 1232 503" />
          </g>

          {/* NO — back to watch */}
          <g stroke={F.arrowBack} strokeWidth="1.3" fill="none" strokeDasharray="5 5" markerEnd="url(#lf-arrowBack)">
            <path d="M 1232 449 Q 1232 625 1024 625 Q 1024 625 1024 440" />
          </g>
          <rect x="1090" y="612" width="44" height="22" rx="3" fill={F.subtle} stroke={F.border} strokeWidth="1" />
          <text x="1112" y="628" textAnchor="middle" fill={F.muted} fontSize="10" fontWeight="700" fontFamily="-apple-system,sans-serif">NO</text>

          {/* ═══ PHASE 3: SHOP & COOK ═══ */}

          {/* Shopping list auto-updated */}
          <rect x="1700" y="330" width="172" height="82" rx="6" fill={F.dark} />
          <text x="1786" y="366" textAnchor="middle" fill={F.white} fontSize="13" fontWeight="700" fontFamily="-apple-system,sans-serif">Shopping list</text>
          <text x="1786" y="385" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="-apple-system,sans-serif">auto-updated</text>

          {/* Shopping day notification */}
          <rect x="1900" y="330" width="170" height="82" rx="6" fill={F.subtle} stroke={F.border} strokeWidth="1" />
          <text x="1985" y="366" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">Shopping day</text>
          <text x="1985" y="385" textAnchor="middle" fill={F.muted} fontSize="10" fontFamily="-apple-system,sans-serif">notification</text>

          {/* Buy & check — circle */}
          <circle cx="2158" cy="371" r="66" fill={F.bg} stroke={F.border} strokeWidth="1.2" />
          <text x="2158" y="361" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">Buy &amp; check</text>
          <text x="2158" y="379" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">items</text>
          <text x="2158" y="397" textAnchor="middle" fill={F.muted} fontSize="10" fontFamily="-apple-system,sans-serif">→ pantry updated</text>

          {/* Cook-today reminder */}
          <rect x="2256" y="330" width="172" height="82" rx="6" fill={F.subtle} stroke={F.border} strokeWidth="1" />
          <text x="2342" y="366" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">Cook-today</text>
          <text x="2342" y="385" textAnchor="middle" fill={F.muted} fontSize="10" fontFamily="-apple-system,sans-serif">reminder</text>

          {/* ⚠ Ingredient expiring — alert */}
          <rect x="1902" y="504" width="266" height="82" rx="6" fill={F.alert} stroke={F.alertBorder} strokeWidth="1.2" />
          <text x="2035" y="534" textAnchor="middle" fill={F.alertText} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">⚠ Ingredient expiring</text>
          <text x="2035" y="552" textAnchor="middle" fill={F.alertText} fontSize="11" fontFamily="-apple-system,sans-serif">suggest recipe today</text>
          <text x="2035" y="570" textAnchor="middle" fill={F.muted} fontSize="9" fontFamily="-apple-system,sans-serif">anti-waste trigger</text>

          {/* Phase 3 arrows */}
          <g stroke={F.arrowMain} strokeWidth="1.5" fill="none" markerEnd="url(#lf-arrow)">
            <line x1="1688" y1="371" x2="1694" y2="371" />
            <line x1="1872" y1="371" x2="1894" y2="371" />
            <line x1="2070" y1="371" x2="2086" y2="371" />
            <line x1="2224" y1="371" x2="2250" y2="371" />
            <line x1="2428" y1="371" x2="2462" y2="371" />
          </g>
          {/* Alert → cook today */}
          <g stroke={F.arrowAlert} strokeWidth="1.3" fill="none" strokeDasharray="5 5" markerEnd="url(#lf-arrowAlert)">
            <path d="M 2168 546 Q 2295 546 2342 416" />
          </g>

          {/* ═══ PHASE 4: TRACK & LOOP ═══ */}

          {/* Follow recipe — filled dark */}
          <rect x="2465" y="330" width="170" height="82" rx="6" fill={F.dark} />
          <text x="2550" y="366" textAnchor="middle" fill={F.white} fontSize="13" fontWeight="700" fontFamily="-apple-system,sans-serif">Follow recipe</text>
          <text x="2550" y="385" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="-apple-system,sans-serif">adjust portions</text>

          {/* Cooked? — diamond */}
          <polygon points="2677,371 2759,293 2841,371 2759,449" fill={F.diamond} stroke={F.diamondBorder} strokeWidth="1.2" />
          <text x="2759" y="366" textAnchor="middle" fill={F.dark} fontSize="13" fontWeight="600" fontFamily="-apple-system,sans-serif">Cooked?</text>
          <text x="2759" y="384" textAnchor="middle" fill={F.muted} fontSize="10" fontFamily="-apple-system,sans-serif">mark complete</text>

          {/* Move to Cooked */}
          <rect x="2889" y="190" width="168" height="82" rx="6" fill={F.dark} />
          <text x="2973" y="222" textAnchor="middle" fill={F.white} fontSize="13" fontWeight="700" fontFamily="-apple-system,sans-serif">Move to</text>
          <text x="2973" y="241" textAnchor="middle" fill={F.white} fontSize="13" fontWeight="700" fontFamily="-apple-system,sans-serif">&quot;Cooked&quot;</text>
          <text x="2973" y="259" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="-apple-system,sans-serif">+ rate recipe</text>

          {/* Waste saved */}
          <rect x="2889" y="490" width="168" height="82" rx="6" fill={F.dark} />
          <text x="2973" y="522" textAnchor="middle" fill={F.white} fontSize="13" fontWeight="700" fontFamily="-apple-system,sans-serif">Waste saved</text>
          <text x="2973" y="541" textAnchor="middle" fill={F.white} fontSize="13" fontWeight="700" fontFamily="-apple-system,sans-serif">logged</text>
          <text x="2973" y="559" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="-apple-system,sans-serif">profile stats</text>

          {/* Phase 4 arrows */}
          <g stroke={F.arrowMain} strokeWidth="1.5" fill="none" markerEnd="url(#lf-arrow)">
            <line x1="2635" y1="371" x2="2671" y2="371" />
            {/* YES — up to Cooked */}
            <path d="M 2759 293 Q 2759 232 2883 232" />
            {/* Cooked → Waste saved */}
            <path d="M 2973 272 L 2973 485" />
          </g>

          {/* YES label */}
          <rect x="2777" y="242" width="44" height="22" rx="3" fill={F.bg} stroke={F.border} strokeWidth="1" />
          <text x="2799" y="258" textAnchor="middle" fill={F.dark} fontSize="10" fontWeight="700" fontFamily="-apple-system,sans-serif">YES</text>

          {/* NO — back to Follow recipe */}
          <g stroke={F.arrowBack} strokeWidth="1.3" fill="none" strokeDasharray="5 5" markerEnd="url(#lf-arrowBack)">
            <path d="M 2759 449 Q 2759 530 2630 530 Q 2550 530 2550 416" />
          </g>
          <rect x="2614" y="518" width="44" height="22" rx="3" fill={F.subtle} stroke={F.border} strokeWidth="1" />
          <text x="2636" y="534" textAnchor="middle" fill={F.muted} fontSize="10" fontWeight="700" fontFamily="-apple-system,sans-serif">NO</text>

          {/* ═══ DAILY LOOP — back to feed ═══ */}
          <g stroke={F.loop} strokeWidth="2" fill="none" strokeDasharray="10 7" markerEnd="url(#lf-arrowBack)">
            <path d="M 2973 572 Q 2973 690 1860 690 Q 900 690 853 690 Q 853 690 853 416" />
          </g>
          <rect x="1632" y="672" width="262" height="30" rx="4" fill={F.bg} stroke={F.border} strokeWidth="1" />
          <text x="1763" y="692" textAnchor="middle" fill={F.muted} fontSize="10" fontWeight="700" letterSpacing="2" fontFamily="-apple-system,sans-serif">DAILY LOOP  ·  BACK TO FEED</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 px-6 py-5 border-t border-border bg-background">
        {[
          { fill: F.dark, label: "Primary action / screen" },
          { fill: F.subtle, border: F.border, label: "System state" },
          { fill: F.bg, border: F.border, label: "User activity", circle: true },
          { fill: F.diamond, border: F.diamondBorder, label: "Decision point" },
          { fill: F.alert, border: F.alertBorder, label: "Anti-waste alert" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            {item.circle ? (
              <svg width="16" height="16" viewBox="0 0 16 16">
                <circle
                  cx="8"
                  cy="8"
                  r="6.5"
                  fill={item.fill}
                  stroke={item.border}
                  strokeWidth="1"
                />
              </svg>
            ) : (
              <span
                className="w-4 h-4 flex-shrink-0"
                style={{
                  background: item.fill,
                  border: item.border ? `1px solid ${item.border}` : undefined,
                  borderRadius: "3px",
                }}
              />
            )}
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const IFRAME_W = 1440;
const IFRAME_H = 900;

function DemoFrame({ url }: { url: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / IFRAME_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const containerHeight = Math.round(IFRAME_H * scale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="w-full border border-border overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-subtle">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          interactive demo · 1440px viewport
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground hover:text-muted transition-colors"
          data-cursor-hover
        >
          open full ↗
        </a>
      </div>
      <div ref={wrapRef} style={{ height: `${containerHeight}px`, overflow: "hidden" }}>
        <iframe
          src={url}
          title="Duo ERP Dashboard — live demo"
          style={{
            width: `${IFRAME_W}px`,
            height: `${IFRAME_H}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            border: "none",
            display: "block",
          }}
        />
      </div>
    </motion.div>
  );
}

const allMoreWorkProjects = [
  {
    title: "Savee",
    headline: "Meal planning that makes food waste impossible.",
    types: ["Mobile", "UX", "Sustainability"],
    year: "2025",
    slug: "savee" as string | null,
    image: "/projects/savee/cover.png",
    tone: "",
    accent: "",
  },
  {
    title: "ERP Duo",
    headline: "Nine locations. One system. Full control.",
    types: ["Web", "B2B", "ERP"],
    year: "2026",
    slug: "erp-duo" as string | null,
    image: "/projects/erp-duo/cover.png",
    tone: "",
    accent: "",
  },
  {
    title: "Tierra Viva",
    headline: "",
    types: [] as string[],
    year: "2024",
    slug: null as string | null,
    image: "",
    tone: "bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-300",
    accent: "after:bg-[radial-gradient(circle_at_70%_30%,#f7d89c_0%,transparent_60%)]",
  },
  {
    title: "Casa Nomad",
    headline: "",
    types: [] as string[],
    year: "2024",
    slug: null as string | null,
    image: "",
    tone: "bg-gradient-to-br from-[#c26f3c] via-[#8f4a24] to-[#d48c5a]",
    accent: "after:bg-[radial-gradient(circle_at_20%_30%,#e6a46e_0%,transparent_60%)]",
  },
];

function MoreWork({ currentSlug }: { currentSlug?: string }) {
  const moreWorkProjects = allMoreWorkProjects
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 3);
  return (
    <div className="mt-24 md:mt-40 px-6 md:px-10 border-t border-border pt-16 pb-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between mb-10 md:mb-14 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.22em]">
          <span className="text-muted">
            <span className="text-foreground">[ more ]</span>
            <span className="mx-3 opacity-40">/</span>
            other projects
          </span>
          <Link
            href="/#work"
            className="text-muted hover:text-foreground transition-colors"
            data-cursor-hover
          >
            see all ↗
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {moreWorkProjects.map((p, i) => {
            const href = p.slug ? `/work/${p.slug}` : "/#work";
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={href} className="group block" data-cursor-hover>
                  <div className={`relative aspect-[4/3] overflow-hidden bg-subtle ${p.tone} ${p.accent ? `after:content-[''] after:absolute after:inset-0 ${p.accent}` : ""}`}>
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/8 transition-colors duration-500" />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
                    {/* top row */}
                    <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
                        {String(allMoreWorkProjects.findIndex(x => x.title === p.title) + 1).padStart(2, "0")} /{" "}
                        {String(allMoreWorkProjects.length).padStart(2, "0")}
                      </span>
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        {p.slug ? (
                          p.types.map((t) => (
                            <span key={t} className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/80 bg-black/25 backdrop-blur-sm px-2 py-0.5 rounded-sm">
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 bg-black/25 px-2 py-1 rounded-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            coming soon
                          </span>
                        )}
                      </div>
                    </div>
                    {/* bottom row */}
                    {p.slug && (
                      <div className="absolute bottom-5 left-5 right-5">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 mb-1.5">
                          {p.title} · {p.year}
                        </span>
                        <h3 className="font-display font-light text-lg md:text-2xl text-white tracking-[-0.02em] leading-tight drop-shadow-lg">
                          {p.headline}
                        </h3>
                      </div>
                    )}
                  </div>
                  {!p.slug && (
                    <div className="mt-4">
                      <p className="font-display font-light text-xl md:text-2xl tracking-[-0.02em] text-foreground/30">
                        Project incoming
                      </p>
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HeadingReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
