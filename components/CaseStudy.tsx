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
  variant?: "savee" | "erp" | "taurus-before" | "taurus-after";
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

type BulkTableSection = {
  kind: "bulktable";
  label: string;
  heading: string;
  body?: string[];
  footer?: string;
};

type Section =
  | TextSection
  | ListSection
  | QuestionsSection
  | ScreensSection
  | FlowSection
  | DemoSection
  | GallerySection
  | BulkTableSection;

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
          <div className="font-mono text-[13px] uppercase tracking-[0.22em] text-muted mb-6">
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

          <dl className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.22em] border-t border-border pt-8">
            <MetaItem label="Year" value={meta.year} />
            <MetaItem label="Role" value={meta.role} />
            <MetaItem label="Tags" value={meta.tags.join(" · ")} />
            <MetaItem label="Status" value={meta.status ?? `Concept · ${meta.year}`} />
          </dl>

          {meta.note && (
            <p className="mt-10 max-w-3xl font-mono text-[12px] md:text-[13px] uppercase tracking-[0.18em] text-muted border-l border-border pl-4">
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
        <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row md:items-center md:justify-between gap-6 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.22em]">
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
        <span className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.22em] text-muted">
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
                  <span className="col-span-2 md:col-span-1 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.22em] text-muted">
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
                    <p className="px-4 py-3 font-mono text-[12px] uppercase tracking-[0.18em] text-muted border-t border-border">
                      {img.caption}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}

        {section.kind === "bulktable" && (
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
            <BulkTable />
            {section.footer && (
              <p className="max-w-2xl text-sm md:text-base leading-relaxed text-muted border-l border-border pl-4">
                {section.footer}
              </p>
            )}
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
            <FlowDiagram variant={section.variant} />
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
          <span className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.18em] text-muted leading-relaxed">
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
        <figcaption className="mt-3 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
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
          <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-muted">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="font-display font-light text-lg md:text-xl tracking-[-0.01em] leading-snug">
            {item.question}
          </p>
          <span className="mt-auto font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-muted border-t border-border pt-4">
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

/* ─── Flow diagrams (ERP-Duo style) ────────────────────────────────────────── */

const F = {
  bg: "#ffffff",
  panel: "#f3f4f6",
  subtle: "#f5f5f2",
  border: "rgba(10,10,10,0.18)",
  borderSoft: "rgba(10,10,10,0.12)",
  dark: "#0a0a0a",
  white: "#ffffff",
  muted: "#6f6f6e",
  diamondFill: "#ffffff",
  yellow: "#fbf2cd",
  yellowBorder: "#d9c270",
  blue: "#d9ebfc",
  blueBorder: "#5fa3d8",
  blueText: "#0a0a0a",
  alert: "#fde6e3",
  alertBorder: "#d97a6d",
  alertText: "#7a2a1f",
  arrow: "#5a5a59",
  arrowDashed: "#5fa3d8",
  chipBg: "#ffffff",
  chipBorder: "rgba(10,10,10,0.18)",
};

// Shape helpers as plain SVG fragments
function Box({
  x, y, w, h, title, sub, kind = "default",
}: {
  x: number; y: number; w: number; h: number;
  title: string; sub?: string;
  kind?: "default" | "start" | "end" | "alert";
}) {
  const fill =
    kind === "start" || kind === "end" ? F.blue
      : kind === "alert" ? F.alert
        : F.bg;
  const stroke =
    kind === "start" || kind === "end" ? F.blueBorder
      : kind === "alert" ? F.alertBorder
        : F.borderSoft;
  const txt = kind === "alert" ? F.alertText : F.dark;
  const subTxt = kind === "alert" ? F.alertText : F.muted;
  const lines = title.split("\n");
  const totalH = lines.length * 14 + (sub ? 14 : 0);
  const startY = y + (h - totalH) / 2 + 11;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={fill} stroke={stroke} strokeWidth={kind === "start" || kind === "end" ? 1.5 : 1} />
      {lines.map((ln, i) => (
        <text key={i} x={x + w / 2} y={startY + i * 14} textAnchor="middle" fill={txt} fontSize="12" fontWeight={kind === "start" || kind === "end" ? 700 : 600} fontFamily="-apple-system,sans-serif">{ln}</text>
      ))}
      {sub && <text x={x + w / 2} y={startY + lines.length * 14} textAnchor="middle" fill={subTxt} fontSize="10" fontFamily="-apple-system,sans-serif">{sub}</text>}
    </g>
  );
}

function Fill({ x, y, w, h, lines }: { x: number; y: number; w: number; h: number; lines: string[] }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={F.bg} stroke={F.borderSoft} strokeWidth="1" />
      <text x={x + 10} y={y + 18} fill={F.dark} fontSize="11" fontWeight="700" fontFamily="-apple-system,sans-serif">FILL IN:</text>
      {lines.map((ln, i) => (
        <text key={i} x={x + 10} y={y + 34 + i * 13} fill={F.dark} fontSize="11" fontFamily="-apple-system,sans-serif">{ln}</text>
      ))}
    </g>
  );
}

function Auto({ x, y, w, h, title, sub }: { x: number; y: number; w: number; h: number; title: string; sub?: string }) {
  const skew = 14;
  const pts = `${x + skew},${y} ${x + w},${y} ${x + w - skew},${y + h} ${x},${y + h}`;
  return (
    <g>
      <polygon points={pts} fill={F.yellow} stroke={F.yellowBorder} strokeWidth="1" />
      <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" fill={F.dark} fontSize="12" fontWeight="600" fontFamily="-apple-system,sans-serif">{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fill={F.muted} fontSize="10" fontFamily="-apple-system,sans-serif">{sub}</text>}
    </g>
  );
}

function Diamond({ cx, cy, w, h, title }: { cx: number; cy: number; w: number; h: number; title: string }) {
  const pts = `${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`;
  const lines = title.split("\n");
  const startY = cy - (lines.length - 1) * 7;
  return (
    <g>
      <polygon points={pts} fill={F.diamondFill} stroke={F.border} strokeWidth="1" />
      {lines.map((ln, i) => (
        <text key={i} x={cx} y={startY + i * 14 + 4} textAnchor="middle" fill={F.dark} fontSize="11.5" fontWeight="600" fontFamily="-apple-system,sans-serif">{ln}</text>
      ))}
    </g>
  );
}

function YesNo({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fill={F.muted} fontSize="11" fontStyle="italic" fontFamily="-apple-system,sans-serif">{label}</text>
  );
}

function FlowFrame({ phases, children, viewWidth, viewHeight }: { phases: string[]; children: React.ReactNode; viewWidth: number; viewHeight: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="w-full border border-border overflow-hidden"
    >
      <div className={`grid border-b border-border`} style={{ gridTemplateColumns: `repeat(${phases.length}, minmax(0, 1fr))` }}>
        {phases.map((p, i) => (
          <div key={i} className={`px-5 py-4 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-muted ${i < phases.length - 1 ? "border-r border-border" : ""}`}>{p}</div>
        ))}
      </div>
      <div className="w-full overflow-x-auto" style={{ background: F.panel }}>
        <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} width={viewWidth} xmlns="http://www.w3.org/2000/svg" style={{ display: "block", minWidth: `${viewWidth}px` }}>
          <defs>
            <marker id="fd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,1 L9,5 L0,9 z" fill={F.arrow} />
            </marker>
            <marker id="fd-arrow-dash" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,1 L9,5 L0,9 z" fill={F.arrowDashed} />
            </marker>
          </defs>
          {children}
        </svg>
      </div>
    </motion.div>
  );
}

function FlowDiagram({ variant }: { variant?: "savee" | "erp" | "taurus-before" | "taurus-after" }) {
  if (variant === "erp") return <ErpFlow />;
  if (variant === "taurus-before") return <TaurusBeforeFlow />;
  if (variant === "taurus-after") return <TaurusAfterFlow />;
  return <SaveeFlow />;
}

/* ═══════════════ TAURUS — BEFORE (one animal at a time) ═══════════════ */
function TaurusBeforeFlow() {
  return (
    <FlowFrame
      viewWidth={1820}
      viewHeight={820}
      phases={["1 · New record", "2 · Fill 6 fields", "3 · Save", "4 · Repeat 70×"]}
    >
      <g stroke="rgba(10,10,10,0.06)" strokeWidth="1" strokeDasharray="3 8">
        <line x1="455" y1="0" x2="455" y2="820" />
        <line x1="910" y1="0" x2="910" y2="820" />
        <line x1="1365" y1="0" x2="1365" y2="820" />
      </g>

      {/* ── ROW 1 (L→R): add one animal ── */}
      <Box x={40} y={215} w={150} h={70} title="NEW FARM" kind="start" />
      <Box x={250} y={215} w={160} h={70} title="Open animals" sub="registry module" />
      <Box x={520} y={215} w={160} h={70} title="+ Add animal" sub="single form" />
      <Fill x={740} y={200} w={200} h={110} lines={["tag #, breed,", "sex, birth date,", "weight, lot", "— ~5 min each"]} />
      <Diamond cx={1140} cy={250} w={180} h={120} title={"All fields\nfilled?"} />
      <YesNo x={1140} y={172} label="no" />
      <YesNo x={1252} y={242} label="yes" />
      <Box x={1045} y={48} w={190} h={62} title="⚠ Missing field" sub="blocks save" kind="alert" />
      <Box x={1340} y={215} w={150} h={70} title="Save" sub="one record" />
      <Box x={1560} y={215} w={180} h={70} title="Saved 1 / 70" sub="69 to go…" />

      <g stroke={F.arrow} strokeWidth="1.4" fill="none" markerEnd="url(#fd-arrow)">
        <line x1="190" y1="250" x2="250" y2="250" />
        <line x1="410" y1="250" x2="520" y2="250" />
        <line x1="680" y1="250" x2="740" y2="250" />
        <line x1="940" y1="250" x2="1050" y2="250" />
        <line x1="1230" y1="250" x2="1340" y2="250" />
        <line x1="1490" y1="250" x2="1560" y2="250" />
        {/* no ↑ to error */}
        <path d="M 1140 190 L 1140 110" />
      </g>
      {/* error loops back into the form (dashed) */}
      <g stroke={F.arrowDashed} strokeWidth="1.4" fill="none" strokeDasharray="5 4" markerEnd="url(#fd-arrow-dash)">
        <path d="M 1045 79 L 840 79 L 840 200" />
      </g>

      {/* return path down to row 2 (dashed) */}
      <g stroke={F.arrowDashed} strokeWidth="1.6" fill="none" strokeDasharray="6 4" markerEnd="url(#fd-arrow-dash)">
        <path d="M 1650 285 L 1650 440 L 155 440 L 155 562" />
      </g>

      {/* ── ROW 2 (L→R): repeat, fatigue, abandon ── */}
      <Diamond cx={155} cy={620} w={170} h={115} title={"More to\nadd?"} />
      <YesNo x={250} y={612} label="yes" />
      <YesNo x={155} y={702} label="no" />
      <Box x={80} y={735} w={150} h={58} title="All 70 done" sub="(rare)" />
      <Diamond cx={470} cy={620} w={160} h={115} title={"Give\nup?"} />
      <YesNo x={560} y={612} label="yes" />
      <YesNo x={448} y={546} label="no" />
      <Box x={660} y={585} w={170} h={70} title="GAVE UP" sub="only key animals" kind="alert" />
      <Box x={900} y={585} w={190} h={70} title="Tool abandoned" sub="data partial · distrust" kind="alert" />

      <g stroke={F.arrow} strokeWidth="1.4" fill="none" markerEnd="url(#fd-arrow)">
        {/* more yes → give up? */}
        <line x1="240" y1="620" x2="390" y2="620" />
        {/* more no ↓ all done */}
        <path d="M 155 677 L 155 735" />
        {/* give up yes → GAVE UP */}
        <line x1="550" y1="620" x2="660" y2="620" />
        {/* GAVE UP → abandoned */}
        <line x1="830" y1="620" x2="900" y2="620" />
      </g>
      {/* the grind: give-up "no" loops all the way back to the form */}
      <g stroke={F.arrowDashed} strokeWidth="1.6" fill="none" strokeDasharray="6 4" markerEnd="url(#fd-arrow-dash)">
        <path d="M 470 562 L 470 390 L 600 390 L 600 285" />
      </g>
      <text x={605} y={382} textAnchor="start" fill={F.muted} fontSize="11" fontStyle="italic" fontFamily="-apple-system,sans-serif">type the next one · ~5 min</text>
    </FlowFrame>
  );
}

/* ═══════════════ TAURUS — AFTER (one bulk table) ═══════════════ */
function TaurusAfterFlow() {
  return (
    <FlowFrame
      viewWidth={2100}
      viewHeight={820}
      phases={["1 · Choose paddock", "2 · Source of animals", "3 · Names & detail", "4 · Add to system"]}
    >
      <g stroke="rgba(10,10,10,0.06)" strokeWidth="1" strokeDasharray="3 8">
        <line x1="525" y1="0" x2="525" y2="820" />
        <line x1="1050" y1="0" x2="1050" y2="820" />
        <line x1="1575" y1="0" x2="1575" y2="820" />
      </g>

      {/* ── Start ── */}
      <Box x={40} y={350} w={200} h={120} title={"Create or select\npaddock to add\nanimals"} kind="start" />

      {/* ── Move existing animals? ── */}
      <Diamond cx={440} cy={410} w={200} h={140} title={"Move existing\nanimals?"} />
      <YesNo x={440} y={300} label="yes" />
      <YesNo x={415} y={510} label="no" />
      <Box x={345} y={150} w={190} h={60} title="Select animals" />

      {/* ── Import from sheet? ── */}
      <Diamond cx={440} cy={620} w={190} h={120} title={"Import from\nsheet?"} />
      <YesNo x={590} y={608} label="no" />
      <YesNo x={470} y={712} label="yes" />
      <Box x={655} y={587} w={215} h={66} title={"Create new animals:\nselect # of animals"} />
      <Auto x={672} y={375} w={180} h={70} title="Auto fill" sub="names" />
      <Auto x={672} y={705} w={185} h={70} title="Migrate" sub="information" />

      {/* ── Important note? ── */}
      <Diamond cx={1390} cy={410} w={210} h={150} title={"Important note\nabout specific\nanimals?"} />
      <YesNo x={1390} y={300} label="yes" />
      <YesNo x={1530} y={398} label="no" />
      <Box x={1560} y={160} w={160} h={60} title="Fill in" />

      {/* ── Add animals ── */}
      <Box x={1760} y={355} w={230} h={110} title="ADD ANIMALS" kind="end" />

      {/* Solid arrows */}
      <g stroke={F.arrow} strokeWidth="1.4" fill="none" markerEnd="url(#fd-arrow)">
        {/* start → move existing? */}
        <line x1="240" y1="410" x2="340" y2="410" />
        {/* yes ↑ select animals */}
        <path d="M 440 340 L 440 210" />
        {/* no ↓ import from sheet? */}
        <path d="M 440 480 L 440 560" />
        {/* import no → create new animals */}
        <line x1="535" y1="620" x2="655" y2="620" />
        {/* create new ↑ auto fill */}
        <path d="M 762 587 L 762 445" />
        {/* import yes ↓→ migrate */}
        <path d="M 440 680 L 440 740 L 672 740" />
        {/* merge → important note? */}
        <line x1="1180" y1="410" x2="1285" y2="410" />
        {/* important yes ↑→ fill in */}
        <path d="M 1390 335 L 1390 190 L 1560 190" />
        {/* fill in →↓ add animals */}
        <path d="M 1720 190 L 1875 190 L 1875 355" />
        {/* important no → add animals */}
        <line x1="1495" y1="410" x2="1760" y2="410" />
      </g>

      {/* Merge feeders (no arrowheads) into vertical at x=1180 */}
      <g stroke={F.arrow} strokeWidth="1.4" fill="none">
        <path d="M 535 180 L 1180 180 L 1180 410" />
        <path d="M 852 410 L 1180 410" />
        <path d="M 857 740 L 1180 740 L 1180 410" />
      </g>

      {/* Add animals → continues (dashed) */}
      <g stroke={F.arrowDashed} strokeWidth="1.6" fill="none" strokeDasharray="6 4" markerEnd="url(#fd-arrow-dash)">
        <path d="M 1990 410 L 2060 410" />
      </g>
    </FlowFrame>
  );
}

/* ═══════════════ SAVEE FLOW ═══════════════ */
function SaveeFlow() {
  return (
    <FlowFrame
      viewWidth={2000}
      viewHeight={920}
      phases={["1 · Onboarding", "2 · Discover", "3 · Plan & Shop", "4 · Cook & Loop"]}
    >
      {/* Phase dividers */}
      <g stroke="rgba(10,10,10,0.06)" strokeWidth="1" strokeDasharray="3 8">
        <line x1="500" y1="0" x2="500" y2="920" />
        <line x1="1000" y1="0" x2="1000" y2="920" />
        <line x1="1500" y1="0" x2="1500" y2="920" />
      </g>

      {/* ── ROW 1 ── */}
      {/* Start */}
      <Box x={40} y={240} w={140} h={70} title="OPEN APP" kind="start" />
      {/* Logged in? */}
      <Diamond cx={290} cy={275} w={160} h={110} title="Logged in?" />
      {/* yes → home (line continues right) */}
      <YesNo x={400} y={265} label="yes" />
      {/* no ↓ */}
      <YesNo x={300} y={355} label="no" />
      {/* Fill in sign up */}
      <Fill x={220} y={400} w={170} h={70} lines={["email", "password,", "name"]} />
      {/* Auto-fill preferences */}
      <Auto x={420} y={400} w={170} h={70} title="Auto-fill" sub="profile defaults" />
      {/* Set preferences? diamond */}
      <Diamond cx={680} cy={275} w={170} h={120} title={"Set diet,\nskill, goals?"} />
      <YesNo x={680} y={205} label="yes" />
      <YesNo x={780} y={265} label="no" />
      {/* Fill in preferences (above) */}
      <Fill x={595} y={70} w={170} h={88} lines={["diet, skill,", "household,", "weekly goals"]} />
      {/* HOME FEED */}
      <Box x={830} y={240} w={150} h={70} title="HOME FEED" kind="start" />

      {/* Phase 2: Discover */}
      <Diamond cx={1090} cy={275} w={150} h={110} title="Interested?" />
      <YesNo x={1100} y={205} label="yes" />
      <YesNo x={1200} y={265} label="no" />
      {/* Like / Save */}
      <Fill x={1015} y={70} w={170} h={70} lines={["♥ like or", "🔖 save"]} />
      {/* No → loop back arrow handled later */}
      {/* Add to plan? */}
      <Diamond cx={1320} cy={275} w={160} h={110} title="Add to plan?" />
      <YesNo x={1430} y={265} label="yes" />
      <YesNo x={1320} y={400} label="no" />
      {/* Save for later (below) */}
      <Box x={1245} y={420} w={160} h={60} title="Save for later" sub="recipe library" />
      {/* Pick date FILL IN */}
      <Fill x={1450} y={240} w={170} h={70} lines={["cooking date,", "servings"]} />

      {/* ADD TO LIST (right end of row 1) */}
      <Box x={1670} y={240} w={170} h={70} title="ADD TO LIST" kind="end" />

      {/* Arrows row 1 */}
      <g stroke={F.arrow} strokeWidth="1.4" fill="none" markerEnd="url(#fd-arrow)">
        {/* Start → Logged in? */}
        <line x1="180" y1="275" x2="210" y2="275" />
        {/* yes → Set prefs diamond */}
        <line x1="370" y1="275" x2="595" y2="275" />
        {/* no ↓ Fill */}
        <path d="M 290 330 L 290 400" />
        {/* Fill → Auto */}
        <line x1="390" y1="435" x2="420" y2="435" />
        {/* Auto → Set prefs (up + right) */}
        <path d="M 590 435 L 680 435 L 680 335" />
        {/* yes ↑ Fill diet */}
        <path d="M 680 215 L 680 158" />
        {/* Fill diet → back down (merge to HOME) */}
        <path d="M 765 105 L 905 105 L 905 240" />
        {/* no → HOME */}
        <line x1="765" y1="275" x2="830" y2="275" />
        {/* HOME → Interested? */}
        <line x1="980" y1="275" x2="1015" y2="275" />
        {/* yes ↑ Like/Save */}
        <path d="M 1090 220 L 1090 140" />
        {/* Like/Save → Add to plan (right + down) */}
        <path d="M 1185 105 L 1240 105 L 1240 240" />
        {/* no → Add to plan */}
        <line x1="1165" y1="275" x2="1240" y2="275" />
        {/* yes → Pick date */}
        <line x1="1400" y1="275" x2="1450" y2="275" />
        {/* no → save for later */}
        <path d="M 1320 330 L 1320 420" />
        {/* Pick date → ADD TO LIST */}
        <line x1="1620" y1="275" x2="1670" y2="275" />
      </g>

      {/* Interested? "no" loop back to HOME */}
      <g stroke={F.arrow} strokeWidth="1.3" fill="none" strokeDasharray="4 4" markerEnd="url(#fd-arrow)">
        <path d="M 1090 330 L 1090 380 L 905 380 L 905 310" />
      </g>

      {/* Cross-row dashed connector ADD TO LIST → SHOPPING */}
      <g stroke={F.arrowDashed} strokeWidth="1.6" fill="none" strokeDasharray="6 4" markerEnd="url(#fd-arrow-dash)">
        <path d="M 1755 310 L 1755 550 L 150 550 L 150 615" />
      </g>

      {/* ── ROW 2 ── */}
      {/* Shopping list start */}
      <Box x={70} y={615} w={170} h={70} title="SHOPPING LIST" kind="start" />
      {/* Shopping day? */}
      <Diamond cx={350} cy={650} w={150} h={110} title="Shopping day?" />
      <YesNo x={460} y={640} label="yes" />
      <YesNo x={350} y={770} label="no" />
      {/* Wait (loop) */}
      <Box x={275} y={790} w={150} h={50} title="Wait" sub="notify later" />
      {/* Buy & check FILL IN */}
      <Fill x={500} y={615} w={170} h={70} lines={["check items", "as bought"]} />
      {/* Auto pantry update */}
      <Auto x={700} y={615} w={170} h={70} title="Auto-update" sub="pantry stock" />
      {/* Expiring? */}
      <Diamond cx={970} cy={650} w={160} h={110} title="Expiring soon?" />
      <YesNo x={970} y={580} label="yes" />
      <YesNo x={1075} y={640} label="no" />
      {/* Urgent recipe alert */}
      <Box x={885} y={460} w={180} h={68} title="⚠ Urgent recipe" sub="anti-waste suggest" kind="alert" />
      {/* Cook reminder */}
      <Box x={1180} y={615} w={160} h={70} title="Cook today" sub="reminder" />
      {/* FILL IN rating, waste */}
      <Fill x={1370} y={605} w={180} h={88} lines={["mark cooked,", "rating,", "waste logged"]} />
      {/* Week complete diamond */}
      <Diamond cx={1700} cy={650} w={160} h={110} title={"Week\ncomplete?"} />
      <YesNo x={1800} y={640} label="yes" />
      <YesNo x={1700} y={770} label="no" />
      {/* SAVED WEEK end */}
      <Box x={1830} y={615} w={150} h={70} title="SAVED ✓" kind="end" />

      {/* Arrows row 2 */}
      <g stroke={F.arrow} strokeWidth="1.4" fill="none" markerEnd="url(#fd-arrow)">
        {/* Shopping list → Shopping day? */}
        <line x1="240" y1="650" x2="275" y2="650" />
        {/* yes → Buy */}
        <line x1="425" y1="650" x2="500" y2="650" />
        {/* no ↓ Wait */}
        <path d="M 350 705 L 350 790" />
        {/* Buy → Auto pantry */}
        <line x1="670" y1="650" x2="700" y2="650" />
        {/* Auto → Expiring? */}
        <line x1="870" y1="650" x2="895" y2="650" />
        {/* yes ↑ Urgent recipe */}
        <path d="M 970 595 L 970 528" />
        {/* Urgent recipe → Cook today (right & down merge) */}
        <path d="M 1065 494 L 1260 494 L 1260 615" />
        {/* no → Cook today */}
        <line x1="1050" y1="650" x2="1180" y2="650" />
        {/* Cook today → FILL IN */}
        <line x1="1340" y1="650" x2="1370" y2="650" />
        {/* FILL IN → Week complete? */}
        <line x1="1550" y1="650" x2="1625" y2="650" />
        {/* yes → SAVED */}
        <line x1="1775" y1="650" x2="1830" y2="650" />
      </g>

      {/* Week complete? "no" loop back to home/feed (dashed) */}
      <g stroke={F.arrowDashed} strokeWidth="1.3" fill="none" strokeDasharray="4 4" markerEnd="url(#fd-arrow-dash)">
        <path d="M 1700 705 L 1700 860 L 70 860 L 70 685" />
      </g>

      {/* Wait loop back to Shopping day */}
      <g stroke={F.arrow} strokeWidth="1.2" fill="none" strokeDasharray="3 5" markerEnd="url(#fd-arrow)">
        <path d="M 425 815 L 470 815 L 470 705" />
      </g>
    </FlowFrame>
  );
}

/* ═══════════════ ERP DUO FLOW ═══════════════ */
function ErpFlow() {
  return (
    <FlowFrame
      viewWidth={2100}
      viewHeight={980}
      phases={["1 · New document", "2 · Items & status", "3 · Role-based review", "4 · Production"]}
    >
      <g stroke="rgba(10,10,10,0.06)" strokeWidth="1" strokeDasharray="3 8">
        <line x1="540" y1="0" x2="540" y2="980" />
        <line x1="1080" y1="0" x2="1080" y2="980" />
        <line x1="1600" y1="0" x2="1600" y2="980" />
      </g>

      {/* ── ROW 1 ── */}
      <Box x={40} y={240} w={160} h={70} title="NEW DOCUMENT" kind="start" />
      <Diamond cx={310} cy={275} w={180} h={130} title={"Existing\ndocument type?"} />
      <YesNo x={420} y={265} label="yes" />
      <YesNo x={310} y={425} label="no" />
      {/* yes → autofill template */}
      <Auto x={460} y={240} w={180} h={70} title="Auto-load" sub="template fields" />
      {/* no → pick from 40+ */}
      <Fill x={235} y={465} w={170} h={70} lines={["choose from", "40+ doc types"]} />
      {/* Customer/supplier exists? */}
      <Diamond cx={780} cy={275} w={180} h={130} title={"Customer or\nsupplier exists?"} />
      <YesNo x={780} y={205} label="yes" />
      <YesNo x={890} y={265} label="no" />
      {/* yes → autofill customer */}
      <Auto x={695} y={70} w={180} h={70} title="Auto-fill" sub="contact data" />
      {/* no → fill in customer */}
      <Fill x={910} y={240} w={170} h={88} lines={["tax #, legal", "name, address,", "contact"]} />
      {/* Contract based? */}
      <Diamond cx={1190} cy={275} w={170} h={120} title={"Contract\nbased?"} />
      <YesNo x={1190} y={205} label="yes" />
      <YesNo x={1300} y={265} label="no" />
      {/* yes → fill contract # */}
      <Fill x={1105} y={80} w={170} h={70} lines={["contract #,", "validity"]} />
      {/* Always fill: invoice info */}
      <Fill x={1370} y={245} w={170} h={70} lines={["invoice #,", "due dates"]} />
      {/* ADD ITEMS */}
      <Box x={1600} y={240} w={160} h={70} title="ADD ITEMS" kind="start" />

      {/* Arrows row 1 */}
      <g stroke={F.arrow} strokeWidth="1.4" fill="none" markerEnd="url(#fd-arrow)">
        <line x1="200" y1="275" x2="220" y2="275" />
        {/* yes → Auto-load */}
        <line x1="400" y1="275" x2="460" y2="275" />
        {/* no ↓ Fill choose */}
        <path d="M 310 340 L 310 465" />
        {/* Fill choose → Auto-load (right + up) */}
        <path d="M 405 500 L 550 500 L 550 310" />
        {/* Auto-load → Customer? */}
        <line x1="640" y1="275" x2="690" y2="275" />
        {/* yes ↑ Auto-fill contact */}
        <path d="M 780 210 L 780 140" />
        {/* Auto-fill contact → merge into Contract? entry */}
        <path d="M 875 105 L 1090 105 L 1090 275 L 1105 275" />
        {/* no → Fill customer */}
        <line x1="870" y1="275" x2="910" y2="275" />
        {/* Fill customer → Contract? */}
        <line x1="1080" y1="285" x2="1105" y2="275" />
        {/* yes ↑ contract # */}
        <path d="M 1190 215 L 1190 150" />
        {/* contract → invoice (right + down) */}
        <path d="M 1275 115 L 1370 115 L 1370 245" />
        {/* no → invoice */}
        <line x1="1275" y1="275" x2="1370" y2="280" />
        {/* invoice → ADD ITEMS */}
        <line x1="1540" y1="280" x2="1600" y2="275" />
      </g>

      {/* Cross-row dashed connector */}
      <g stroke={F.arrowDashed} strokeWidth="1.6" fill="none" strokeDasharray="6 4" markerEnd="url(#fd-arrow-dash)">
        <path d="M 1680 310 L 1680 600 L 150 600 L 150 665" />
      </g>

      {/* ── ROW 2 ── */}
      <Box x={70} y={665} w={160} h={70} title="ADD ITEMS" kind="start" />
      {/* Fill item details */}
      <Fill x={265} y={665} w={180} h={88} lines={["product,", "qty, unit,", "price"]} />
      {/* Stock check auto */}
      <Auto x={480} y={665} w={180} h={70} title="Auto stock" sub="check available" />
      {/* Diamond status */}
      <Diamond cx={770} cy={710} w={170} h={130} title={"Stock\nstatus?"} />
      <YesNo x={770} y={620} label="ok" />
      <YesNo x={770} y={810} label="warn / critical" />
      {/* OK ↑ next */}
      <Box x={700} y={510} w={150} h={60} title="OK ✓" sub="proceed" />
      {/* Warn ↓ alert */}
      <Box x={685} y={840} w={180} h={68} title="⚠ Low / Expiring" sub="surface to user" kind="alert" />
      {/* More items? */}
      <Diamond cx={1020} cy={710} w={170} h={120} title={"More\nitems?"} />
      <YesNo x={1020} y={635} label="yes" />
      <YesNo x={1130} y={700} label="no" />
      {/* Special requests? */}
      <Diamond cx={1260} cy={710} w={170} h={120} title={"Special\nrequests?"} />
      <YesNo x={1260} y={635} label="yes" />
      <YesNo x={1370} y={700} label="no" />
      <Fill x={1175} y={520} w={170} h={70} lines={["packaging,", "equipment"]} />
      {/* SAVE / Role view */}
      <Box x={1460} y={680} w={150} h={70} title="SAVE DRAFT" kind="start" />
      {/* Approval needed? */}
      <Diamond cx={1730} cy={715} w={170} h={120} title={"Needs\napproval?"} />
      <YesNo x={1730} y={640} label="yes" />
      <YesNo x={1840} y={705} label="no" />
      {/* Manager review */}
      <Fill x={1645} y={525} w={170} h={70} lines={["manager", "reviews & signs"]} />
      {/* SEND TO PRODUCTION */}
      <Box x={1900} y={680} w={170} h={70} title="SEND TO PROD" kind="end" />

      {/* Arrows row 2 */}
      <g stroke={F.arrow} strokeWidth="1.4" fill="none" markerEnd="url(#fd-arrow)">
        <line x1="230" y1="700" x2="265" y2="700" />
        <line x1="445" y1="700" x2="480" y2="700" />
        <line x1="660" y1="700" x2="685" y2="700" />
        {/* OK ↑ */}
        <path d="M 770 645 L 770 570" />
        {/* warn ↓ */}
        <path d="M 770 775 L 770 840" />
        {/* OK → More items (right + down) */}
        <path d="M 850 540 L 1020 540 L 1020 650" />
        {/* warn → More items (right + up) */}
        <path d="M 865 874 L 1020 874 L 1020 770" />
        {/* yes ↑ loop back to ADD ITEMS */}
        <path d="M 1020 650 L 1020 460 L 155 460 L 155 665" />
        {/* no → Special? */}
        <line x1="1105" y1="710" x2="1175" y2="710" />
        {/* yes ↑ Fill */}
        <path d="M 1260 650 L 1260 590" />
        {/* Fill → SAVE (right + down) */}
        <path d="M 1345 555 L 1490 555 L 1490 680" />
        {/* no → SAVE */}
        <line x1="1345" y1="710" x2="1460" y2="710" />
        {/* SAVE → Approval? */}
        <line x1="1610" y1="715" x2="1645" y2="715" />
        {/* yes ↑ Manager */}
        <path d="M 1730 655 L 1730 595" />
        {/* Manager → SEND (right + down) */}
        <path d="M 1815 560 L 1935 560 L 1935 680" />
        {/* no → SEND */}
        <line x1="1815" y1="715" x2="1900" y2="715" />
      </g>

      {/* Stock warn → loop back (dashed) */}
      <g stroke={F.arrowDashed} strokeWidth="1.2" fill="none" strokeDasharray="4 4" markerEnd="url(#fd-arrow-dash)">
        <path d="M 775 908 L 155 908 L 155 735" />
      </g>
    </FlowFrame>
  );
}

const IFRAME_W = 1440;
const IFRAME_H = 900;

function DemoFrame({ url }: { url: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / IFRAME_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

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
        <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-muted">
          interactive demo · 1440px viewport
        </span>
        <div className="flex items-center gap-4">
          {active && (
            <button
              type="button"
              onClick={() => setActive(false)}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted hover:text-foreground transition-colors"
              data-cursor-hover
            >
              × exit (esc)
            </button>
          )}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[12px] uppercase tracking-[0.18em] text-foreground hover:text-muted transition-colors"
            data-cursor-hover
          >
            open full ↗
          </a>
        </div>
      </div>
      <div
        ref={wrapRef}
        className="relative"
        style={{ height: `${containerHeight}px`, overflow: "hidden" }}
      >
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
            pointerEvents: active ? "auto" : "none",
          }}
        />
        {!active && (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-foreground/[0.06] backdrop-blur-[2px] hover:bg-foreground/[0.10] transition-colors group"
            data-cursor-hover
            aria-label="Activate demo"
          >
            <span className="inline-flex items-center gap-2 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.22em] text-foreground bg-background border border-border px-4 py-2.5 rounded-sm group-hover:border-foreground transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              click to use the ERP
            </span>
            <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-muted">
              press esc or × exit to release scroll
            </span>
          </button>
        )}
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
    image: "/projects/savee/cover.webp",
    tone: "",
    accent: "",
  },
  {
    title: "ERP Duo",
    headline: "Nine locations. One system. Full control.",
    types: ["Web", "B2B/B2C", "ERP"],
    year: "2026",
    slug: "erp-duo" as string | null,
    image: "/projects/erp-duo/cover.webp",
    tone: "",
    accent: "",
  },
  {
    title: "TaurusWebs",
    headline: "From 6 hours to 1: digitizing a whole farm.",
    types: ["Web", "SaaS", "Agtech"],
    year: "2025",
    slug: "taurus" as string | null,
    image: "/projects/taurus/cover.webp",
    tone: "",
    accent: "",
  },
  {
    title: "Meinerva",
    headline: "Look before you're told: making experimental art legible.",
    types: ["Research", "UX", "Art & Tech"],
    year: "2025",
    slug: "meinerva" as string | null,
    image: "/projects/meinerva/cover.webp",
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
        <div className="flex items-end justify-between mb-10 md:mb-14 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.22em]">
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
                      <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-white/60">
                        {String(allMoreWorkProjects.findIndex(x => x.title === p.title) + 1).padStart(2, "0")} /{" "}
                        {String(allMoreWorkProjects.length).padStart(2, "0")}
                      </span>
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        {p.slug ? (
                          p.types.map((t) => (
                            <span key={t} className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/80 bg-black/25 backdrop-blur-sm px-2 py-0.5 rounded-sm">
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 bg-black/25 px-2 py-1 rounded-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            coming soon
                          </span>
                        )}
                      </div>
                    </div>
                    {/* bottom row */}
                    {p.slug && (
                      <div className="absolute bottom-5 left-5 right-5">
                        <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 mb-1.5">
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

/* ─── Bulk Farm Setup — the table-actions centerpiece (Taurus) ─────────────── */

type Animal = {
  tag: string;
  breed: string;
  sex: "M" | "H";
  birth: string;
  weight: string;
  lot: string;
  preset?: boolean;
};

const HERD: Animal[] = [
  { tag: "CO-0412", breed: "Brahman", sex: "H", birth: "2022-03-14", weight: "438", lot: "Lote A", preset: true },
  { tag: "CO-0413", breed: "Brahman", sex: "H", birth: "2022-04-02", weight: "451", lot: "Lote A", preset: true },
  { tag: "CO-0418", breed: "Gyr", sex: "M", birth: "2021-11-28", weight: "612", lot: "Lote A" },
  { tag: "CO-0421", breed: "F1 Brahman×Gyr", sex: "H", birth: "2023-01-09", weight: "286", lot: "Lote B", preset: true },
  { tag: "CO-0426", breed: "Cebú", sex: "H", birth: "2022-08-21", weight: "394", lot: "Lote B" },
  { tag: "CO-0430", breed: "Brahman", sex: "M", birth: "2021-06-30", weight: "705", lot: "Potrero 3", preset: true },
  { tag: "CO-0435", breed: "Gyr", sex: "H", birth: "2023-02-17", weight: "248", lot: "Potrero 3" },
];

const TOTAL_ROWS = 70;

function BulkTable() {
  const [view, setView] = useState<"before" | "after">("after");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="w-full border border-border overflow-hidden bg-background"
    >
      {/* Toolbar: segmented before/after */}
      <div className="flex items-center justify-between gap-4 px-4 md:px-5 py-3 border-b border-border bg-subtle">
        <div className="inline-flex border border-border rounded-sm overflow-hidden font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em]">
          <button
            type="button"
            onClick={() => setView("before")}
            data-cursor-hover
            className={`px-3 md:px-4 py-2 transition-colors ${view === "before" ? "bg-foreground text-background" : "text-muted hover:text-foreground"}`}
          >
            Before · one by one
          </button>
          <button
            type="button"
            onClick={() => setView("after")}
            data-cursor-hover
            className={`px-3 md:px-4 py-2 border-l border-border transition-colors ${view === "after" ? "bg-foreground text-background" : "text-muted hover:text-foreground"}`}
          >
            After · bulk table
          </button>
        </div>
        <span className="hidden sm:block font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {view === "before" ? "≈ 5 min / animal" : "70 animals · 1 table"}
        </span>
      </div>

      {view === "before" ? <BeforeForm /> : <AfterTable />}
    </motion.div>
  );
}

function BeforeForm() {
  const fields = [
    { label: "Tag #", value: "CO-0412" },
    { label: "Breed", value: "Brahman" },
    { label: "Sex", value: "Hembra" },
    { label: "Birth date", value: "2022-03-14" },
    { label: "Weight (kg)", value: "438" },
    { label: "Lot", value: "Lote A" },
  ];
  return (
    <div className="relative px-5 md:px-8 py-8 md:py-10 bg-[#f5f5f3]">
      {/* stacked-cards illusion of endless repetition */}
      <div className="relative mx-auto max-w-md">
        <div className="absolute -bottom-3 left-3 right-3 h-full border border-border bg-background/60 rounded-sm" aria-hidden />
        <div className="absolute -bottom-1.5 left-1.5 right-1.5 h-full border border-border bg-background/80 rounded-sm" aria-hidden />
        <div className="relative border border-border bg-background rounded-sm p-5 md:p-6">
          <div className="flex items-center justify-between mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span>Add animal</span>
            <span>Animal 01 / {TOTAL_ROWS}</span>
          </div>
          <div className="space-y-3">
            {fields.map((f) => (
              <div key={f.label} className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{f.label}</span>
                <div className="border border-border rounded-sm px-3 py-2 text-sm bg-background">{f.value}</div>
              </div>
            ))}
          </div>
          <button
            type="button"
            data-cursor-hover
            className="mt-6 w-full border border-foreground bg-foreground text-background font-mono text-[11px] uppercase tracking-[0.2em] py-2.5 rounded-sm"
          >
            Save & add another
          </button>
        </div>
      </div>
      <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        70 animals × 5 min = ~6 h · clients gave up and only loaded a few
      </p>
    </div>
  );
}

function AfterTable() {
  const [selected, setSelected] = useState<Set<number>>(() => new Set(HERD.map((_, i) => i)));
  const allOn = selected.size === HERD.length;

  const toggle = (i: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  const toggleAll = () =>
    setSelected(allOn ? new Set() : new Set(HERD.map((_, i) => i)));

  const cell = "px-3 py-2.5 text-left align-middle whitespace-nowrap";
  const head =
    "px-3 py-3 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-muted whitespace-nowrap";

  return (
    <div>
      {/* secondary toolbar: search + breed/lot presets (the table actions from testing) */}
      <div className="flex items-center gap-2 px-4 md:px-5 py-3 border-b border-border overflow-x-auto">
        <span className="shrink-0 inline-flex items-center gap-2 border border-border rounded-sm px-3 py-1.5 text-[12px] text-muted min-w-[140px] md:min-w-[200px]">
          <span className="opacity-50">⌕</span> Search herd
        </span>
        <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted hidden sm:inline mr-1">
          presets →
        </span>
        {["Brahman", "Gyr", "Apply lot ▾"].map((c) => (
          <span
            key={c}
            className="shrink-0 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.16em] px-2.5 py-1.5 rounded-sm border border-[#5fa3d8] text-[#2b6da3]"
          >
            {c}
          </span>
        ))}
        <span className="shrink-0 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.16em] px-2.5 py-1.5 rounded-sm bg-foreground text-background">
          Paste sheet
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: "720px" }}>
          <thead>
            <tr className="border-b border-border bg-subtle">
              <th className="px-3 py-3 w-10">
                <button
                  type="button"
                  onClick={toggleAll}
                  data-cursor-hover
                  aria-label="Select all"
                  className={`w-4 h-4 rounded-[3px] border flex items-center justify-center ${allOn ? "bg-foreground border-foreground" : "border-border"}`}
                >
                  {allOn && <span className="text-background text-[9px] leading-none">✓</span>}
                </button>
              </th>
              <th className={head}>Tag #</th>
              <th className={head}>Breed</th>
              <th className={head}>Sex</th>
              <th className={head}>Birth</th>
              <th className={head}>Weight kg</th>
              <th className={head}>Lot</th>
            </tr>
          </thead>
          <tbody>
            {HERD.map((a, i) => {
              const on = selected.has(i);
              return (
                <tr
                  key={a.tag}
                  className={`border-b border-border transition-colors ${on ? "bg-background" : "bg-background opacity-45"} hover:bg-subtle`}
                >
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      data-cursor-hover
                      aria-label={`Select ${a.tag}`}
                      className={`w-4 h-4 rounded-[3px] border flex items-center justify-center ${on ? "bg-foreground border-foreground" : "border-border"}`}
                    >
                      {on && <span className="text-background text-[9px] leading-none">✓</span>}
                    </button>
                  </td>
                  <td className={`${cell} font-mono text-[13px]`}>{a.tag}</td>
                  <td className={cell}>
                    <span className={a.preset ? "border-b border-dashed border-[#5fa3d8]" : ""}>{a.breed}</span>
                  </td>
                  <td className={`${cell} font-mono text-[13px]`}>{a.sex}</td>
                  <td className={`${cell} font-mono text-[13px] text-muted`}>{a.birth}</td>
                  <td className={`${cell} font-mono text-[13px] text-right tabular-nums`}>{a.weight}</td>
                  <td className={`${cell} text-[13px]`}>{a.lot}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 md:px-5 py-4 border-t border-border bg-subtle">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <span className="text-foreground">{selected.size}</span> selected ·{" "}
          <span className="text-foreground">{TOTAL_ROWS}</span> rows ready to ingest
        </span>
        <button
          type="button"
          data-cursor-hover
          className="inline-flex items-center justify-center gap-2 border border-foreground bg-foreground text-background font-mono text-[11px] uppercase tracking-[0.2em] px-5 py-2.5 rounded-sm"
        >
          Ingest herd →
        </button>
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
