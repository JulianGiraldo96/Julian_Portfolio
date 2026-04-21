"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Stat = { number: string; caption: string; icon?: StatIcon };
type StatIcon = "percent" | "bolt" | "globe" | "leaf" | "triangle" | "dot";
type ListItem = { title: string; body: string };
type SectionImage = {
  src: string;
  alt: string;
  aspect?: string;
  bg?: string;
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
  items: ListItem[];
};

type Section = TextSection | ListSection;

type Meta = {
  index: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  tags: string[];
  note?: string;
};

export function CaseStudy({
  meta,
  cover,
  sections,
}: {
  meta: Meta;
  cover: { src: string; alt: string };
  sections: Section[];
}) {
  return (
    <main className="relative pb-24">
      <header className="px-6 md:px-10 pt-28 md:pt-40 pb-10 md:pb-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-6">
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

          <dl className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] border-t border-border pt-8">
            <MetaItem label="Year" value={meta.year} />
            <MetaItem label="Role" value={meta.role} />
            <MetaItem label="Tags" value={meta.tags.join(" · ")} />
            <MetaItem label="Status" value="Concept · 2025" />
          </dl>

          {meta.note && (
            <p className="mt-10 max-w-3xl font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-muted border-l border-border pl-4">
              // {meta.note}
            </p>
          )}
        </div>
      </header>

      <Cover src={cover.src} alt={cover.alt} />

      <div className="px-6 md:px-10 mt-20 md:mt-32">
        <div className="mx-auto max-w-[1400px] space-y-24 md:space-y-32">
          {sections.map((s, i) => (
            <SectionBlock key={i} section={s} />
          ))}
        </div>
      </div>

      <footer className="mt-24 md:mt-40 px-6 md:px-10 border-t border-border pt-10 pb-10">
        <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row md:items-center md:justify-between gap-6 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em]">
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

function Cover({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div
      ref={ref}
      className="relative mx-6 md:mx-10 aspect-[16/9] md:aspect-[16/8] overflow-hidden bg-[#0a0a0a]"
    >
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </motion.div>
    </div>
  );
}

function SectionBlock({ section }: { section: Section }) {
  return (
    <section className="grid grid-cols-12 gap-6 md:gap-10">
      <div className="col-span-12 md:col-span-3 md:sticky md:top-28 md:self-start">
        <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-muted">
          {section.label}
        </span>
      </div>

      <div className="col-span-12 md:col-span-9 space-y-8 md:space-y-12">
        <HeadingReveal>
          <h2 className="font-display font-extralight tracking-[-0.025em] leading-[1.05] text-[clamp(1.75rem,3.6vw,3rem)] max-w-3xl">
            {section.heading}
          </h2>
        </HeadingReveal>

        {section.kind === "text" && (
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

            {section.stats && <StatsRow stats={section.stats} />}

            {section.footer && (
              <p className="max-w-2xl text-sm md:text-base leading-relaxed text-muted border-l border-border pl-4">
                {section.footer}
              </p>
            )}

            {section.image && <SectionMedia image={section.image} />}
          </>
        )}

        {section.kind === "list" && (
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
                <span className="col-span-2 md:col-span-1 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-muted">
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
        )}
      </div>
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
          <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-muted leading-relaxed">
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
          <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3.6 12h16.8M12 3.6c2.6 3 2.6 13.8 0 16.8M12 3.6c-2.6 3-2.6 13.8 0 16.8" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M20 4c0 9-6 16-16 16 0-9 6-16 16-16zM4 20 14 10" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M12 4 21 20H3L12 4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full overflow-hidden max-h-[420px] md:max-h-[520px] ${image.aspect || "aspect-[16/9]"
        } ${image.bg || "bg-subtle"}`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 768px) 66vw, 100vw"
        className="object-contain"
      />
    </motion.div>
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
