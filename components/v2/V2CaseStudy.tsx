"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { TopBar } from "./TopBar";
import { V2BulkTable } from "./V2BulkTable";
import { V2Flow, type FlowSpec } from "./V2Flow";
import { V2DotStat, type DotRow } from "./V2DotStat";
import { wireframes, type WireSlug } from "./Wireframes";
import { V2Video } from "./V2Video";
import { ProjectFolder } from "./ProjectFolder";
import { type ScreenSlug } from "./ProductScreens";
import { CardDemo, screenAspect } from "./CardDemo";
import { work } from "./projects";
import { DURATION, EASE, reveal } from "./motion";

/* A case study in the v2 language: Outfit light for anything with a voice,
   Geist Mono uppercase for the numbering, one measure of running text.

   Two things keep it from reading as one long column of the same block:
   sections choose their own `layout` (a narrow two column split for reading,
   full width for anything you look at rather than read), and they can take a
   `tone`, which drops the whole section onto a tinted, grained band. The
   turning points of the story get the bands.

   Nothing on this page scrolls inside itself. The flows and the entry table
   are laid out rather than drawn at a fixed size, so they fit whatever width
   they are given. */

export type V2Stat = { number: string; caption: string };
export type V2Column = { title: string; body: string };
export type V2Item = { title: string; body: string };
export type V2Question = { question: string; hint: string };
/* real pixel dimensions, so the ratio is reserved and nothing letterboxes */
export type V2Image = { src: string; alt: string; caption?: string; w: number; h: number };

/* A 9:16 photo given the full column is a wall: it pushes everything around it
   off the screen and you scroll past one picture. Portrait frames render at
   half width and centre, so a tall photo takes the same amount of page as a
   wide one. The image itself is untouched, so nothing letterboxes. */
function isPortrait(img: V2Image) {
  return img.h > img.w;
}

type Common = {
  label: string;
  heading: string;
  body?: string[];
  /* "band" lifts the section onto a tinted panel, for a turning point */
  tone?: "plain" | "band";
};

export type V2Section = Common &
  (
    | { kind: "text"; image?: V2Image; stats?: V2Stat[]; lead?: boolean }
    | { kind: "columns"; columns: V2Column[]; meta?: string }
    | { kind: "list"; items: V2Item[] }
    | { kind: "questions"; items: V2Question[] }
    | { kind: "gallery"; columns: 2 | 3; images: V2Image[]; feature?: boolean }
    | { kind: "flow"; spec: FlowSpec; caption?: string }
    | { kind: "bulktable"; caption?: string }
    | { kind: "dots"; rows: DotRow[] }
    | { kind: "video"; src: string; poster?: string; caption?: string; ratio?: number }
    | {
        kind: "wires";
        /* a frame is either a drawn wireframe (`slug`) or a real screen
           exported from the design file (`src`). Real beats drawn: only reach
           for a wireframe when the artefact does not exist. */
        frames: {
          slug?: WireSlug;
          src?: string;
          w?: number;
          h?: number;
          title: string;
          note: string;
          chosen?: boolean;
        }[];
      }
  );

export type V2CaseMeta = {
  index: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  tags: string[];
  status: string;
};

export function V2CaseStudy({
  meta,
  cover,
  tint,
  tintDark,
  sections,
  currentSlug,
  coverScreen,
}: {
  meta: V2CaseMeta;
  /* a photograph or a rendered mock, when there is one */
  cover?: V2Image;
  /* and when there is not, the product screen itself, drawn at hero size */
  coverScreen?: ScreenSlug;
  tint: string;
  tintDark: string;
  sections: V2Section[];
  /* so the row at the foot leaves this project out */
  currentSlug: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="v2-root font-sans">
        <TopBar />
        <main id="main" className="mx-auto max-w-[1240px] px-5 md:px-8">
          <article>
            <Hero meta={meta} cover={cover} coverScreen={coverScreen} tint={tint} tintDark={tintDark} />
            <div className="pb-10">
              {sections.map((section, i) => (
                <SectionBlock key={section.label} section={section} index={i} />
              ))}
            </div>
          </article>
          <MoreWork currentSlug={currentSlug} />
        </main>
        <PageFoot />
      </div>
    </MotionConfig>
  );
}

/* ── the image reveal used everywhere ────────────────────────────────────────
   The picture starts slightly oversized behind a mask that opens upward, so it
   settles into place instead of simply fading in. Both halves are transforms,
   so the whole thing runs on the compositor. */
function Reveal({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: DURATION.base, delay, ease: EASE }}
      style={style}
      className={`overflow-hidden ${className}`}
    >
      <motion.div
        initial={{ scale: 1.07 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: DURATION.slow, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function Hero({
  meta,
  cover,
  coverScreen,
  tint,
  tintDark,
}: {
  meta: V2CaseMeta;
  cover?: V2Image;
  coverScreen?: ScreenSlug;
  tint: string;
  tintDark: string;
}) {
  /* a phone drawn at the full width of the panel is about two thousand pixels
     tall and reads as a mistake, so phone shaped covers are capped and centred
     while desktop ones still fill the plate */
  const coverPhone =
    !!coverScreen && work.find((p) => p.slug === coverScreen)?.shape === "phone";
  return (
    <section aria-labelledby="case-title" className="pt-14 md:pt-20">
      <p className="v2-rise font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--v2-label)]">
        {meta.index} · Case study
      </p>

      <h1
        id="case-title"
        className="v2-rise v2-rise-1 mt-5 max-w-[16ch] font-display text-[clamp(2.6rem,8vw,5.5rem)] font-extralight leading-[0.98] tracking-[-0.045em]"
      >
        {meta.title}
      </h1>

      <p className="v2-rise v2-rise-2 mt-7 max-w-[52ch] text-[17px] leading-relaxed text-[var(--v2-secondary)] md:text-[19px]">
        {meta.subtitle}
      </p>

      <dl className="v2-rise v2-rise-3 mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-[var(--v2-line)] pt-7 md:grid-cols-4">
        <MetaItem label="Year" value={meta.year} />
        <MetaItem label="Role" value={meta.role} />
        <MetaItem label="Platform" value={meta.tags.join(" · ")} />
        <MetaItem label="Status" value={meta.status} />
      </dl>

      {/* the cover is the LCP element, so its entrance is a keyframe too */}
      <figure
        className="v2-tint grain v2-rise v2-rise-2 v2-settle relative mt-12 overflow-hidden rounded-[28px] md:mt-16"
        style={
          {
            "--tint": tint,
            "--tint-dark": tintDark,
            /* Meinerva's plate is near-black in both themes, so the line
               art's ink tokens must not flip to the light theme's dark
               values (dark-on-dark, invisible) — same pinning as
               ProjectFolder does for its `dark` cards. Keyed off the tint
               itself so any future always-dark plate gets it too. */
            ...(coverScreen === "meinerva"
              ? {
                  "--v2-ink": "#f2f2f4",
                  "--v2-secondary": "#a8a8b0",
                  "--v2-label": "#8f8f98",
                  "--v2-line": "rgba(255, 255, 255, 0.1)",
                  "--v2-line-strong": "rgba(255, 255, 255, 0.24)",
                  "--v2-warn": "#e79170",
                }
              : null),
          } as React.CSSProperties
        }
      >
        {coverScreen ? (
          <div className={coverPhone ? "px-6 py-10 md:py-16" : "px-[6%] py-[5%]"}>
            {/* the hero runs the same live demo as the home card — the case
               study opens on the product being used, not a screenshot of it.
               aspect-ratio reserves the exact box the mockup's own viewBox
               needs (screenAspect), so nothing letterboxes and there is no
               layout shift once CardDemo mounts. */}
            <div
              className={coverPhone ? "mx-auto max-w-[240px] md:max-w-[280px]" : "w-full"}
              style={{ aspectRatio: screenAspect(coverScreen) }}
            >
              <CardDemo slug={coverScreen} phone={coverPhone} />
            </div>
          </div>
        ) : cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.w}
            height={cover.h}
            priority
            sizes="(min-width: 1240px) 1176px, 100vw"
            className="h-auto w-full"
          />
        ) : null}
      </figure>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-label)]">
        {label}
      </dt>
      <dd className="mt-2 text-[15px] leading-snug">{value}</dd>
    </div>
  );
}

/* ── the section frame ──────────────────────────────────────────────────────
   `split` is for text you read: the heading parks on the left and the prose
   runs in a narrower measure beside it. `wide` is for things you look at: the
   heading sits above and the content takes the full width, which is what lets
   the flows breathe instead of scrolling. */
function SectionShell({
  label,
  heading,
  layout,
  tone = "plain",
  children,
}: {
  label: string;
  heading: string;
  layout: "split" | "wide";
  tone?: "plain" | "band";
  children?: React.ReactNode;
}) {
  const band = tone === "band";

  const head = (
    <>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: DURATION.fast, ease: EASE }}
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--v2-label)]"
      >
        {label}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: DURATION.base, delay: 0.06, ease: EASE }}
        className={
          layout === "split"
            ? "mt-4 max-w-[18ch] font-display text-[26px] font-light leading-[1.1] tracking-[-0.035em] md:sticky md:top-24 md:text-[32px]"
            : "mt-4 max-w-[22ch] font-display text-[28px] font-light leading-[1.08] tracking-[-0.035em] md:text-[36px]"
        }
      >
        {heading}
      </motion.h2>
    </>
  );

  return (
    <section
      className={`mt-20 md:mt-28 ${
        band
          ? "grain relative overflow-hidden rounded-[32px] bg-[var(--v2-surface)] px-5 py-10 md:px-10 md:py-14"
          : ""
      }`}
    >
      {/* a hairline that draws itself, so a new section announces the change of
          subject before the words do */}
      {!band && (
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: DURATION.slow, ease: EASE }}
          className="mb-8 h-px w-full origin-left bg-[var(--v2-line)]"
        />
      )}

      <div className={band ? "relative z-10" : ""}>
        {layout === "split" ? (
          <div className="md:grid md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4">{head}</div>
            <div className="mt-7 md:col-span-8 md:mt-0">{children}</div>
          </div>
        ) : (
          <>
            <div className="max-w-[46ch]">{head}</div>
            <div className="mt-9">{children}</div>
          </>
        )}
      </div>
    </section>
  );
}

function Body({ body, lead = false }: { body?: string[]; lead?: boolean }) {
  if (!body?.length) return null;
  return (
    <div className="space-y-5">
      {body.map((p, i) => (
        <motion.p
          key={p.slice(0, 30)}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: DURATION.base, delay: i * 0.07, ease: EASE }}
          className={
            lead
              ? "max-w-[46ch] text-[19px] leading-[1.55] md:text-[22px]"
              : "max-w-[66ch] text-[16px] leading-[1.7] text-[var(--v2-secondary)]"
          }
        >
          {p}
        </motion.p>
      ))}
    </div>
  );
}

function Stats({ stats }: { stats: V2Stat[] }) {
  return (
    <ul className="mt-10 grid list-none grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-3">
      {stats.map((s, i) => (
        <motion.li
          key={s.number}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: DURATION.base, delay: i * 0.1, ease: EASE }}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: DURATION.base, delay: 0.12 + i * 0.1, ease: EASE }}
            className="mb-4 block h-px w-full origin-left bg-[var(--v2-line-strong)]"
          />
          <p className="font-display text-[clamp(2.2rem,5vw,3.1rem)] font-extralight leading-none tracking-[-0.045em]">
            {s.number}
          </p>
          <p className="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-[var(--v2-secondary)]">
            {s.caption}
          </p>
        </motion.li>
      ))}
    </ul>
  );
}

function SectionBlock({ section, index }: { section: V2Section; index: number }) {
  const { label, heading, tone } = section;

  switch (section.kind) {
    case "columns":
      return (
        <SectionShell label={label} heading={heading} tone={tone} layout="split">
          <Body body={section.body} />
          <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-3">
            {section.columns.map((c, i) => (
              <motion.li
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: DURATION.base, delay: i * 0.08, ease: EASE }}
                className="grain relative overflow-hidden rounded-[20px] border border-[var(--v2-line)] bg-[var(--v2-bg)] px-5 py-6"
              >
                <h3 className="relative z-10 font-mono text-[11px] uppercase tracking-[0.16em]">
                  {c.title}
                </h3>
                <p className="relative z-10 mt-3 text-[14px] leading-relaxed text-[var(--v2-secondary)]">
                  {c.body}
                </p>
              </motion.li>
            ))}
          </ul>
          {section.meta && (
            <motion.p
              {...reveal}
              className="mt-6 border-l-2 border-[var(--v2-ink)] pl-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-[var(--v2-label)]"
            >
              {section.meta}
            </motion.p>
          )}
        </SectionShell>
      );

    case "list":
      return (
        <SectionShell label={label} heading={heading} tone={tone} layout="split">
          <Body body={section.body} />
          <ul className="mt-9 grid list-none grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
            {section.items.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: DURATION.base, delay: (i % 2) * 0.08, ease: EASE }}
              >
                <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--v2-label)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-[20px] font-light leading-[1.18] tracking-[-0.025em]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--v2-secondary)]">
                  {item.body}
                </p>
              </motion.li>
            ))}
          </ul>
        </SectionShell>
      );

    case "questions":
      return (
        <SectionShell label={label} heading={heading} tone={tone} layout="wide">
          <Body body={section.body} />
          <ul className="mt-8 grid list-none grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((q, i) => (
              <motion.li
                key={q.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: DURATION.base, delay: (i % 3) * 0.07, ease: EASE }}
                className="grain relative overflow-hidden rounded-[18px] border border-[var(--v2-line)] bg-[var(--v2-bg)] px-5 py-5"
              >
                <p className="relative z-10 text-[15px] leading-snug">{q.question}</p>
                <p className="relative z-10 mt-2.5 text-[13px] italic leading-snug text-[var(--v2-label)]">
                  {q.hint}
                </p>
              </motion.li>
            ))}
          </ul>
        </SectionShell>
      );

    case "gallery": {
      /* The first frame of a featured gallery runs the full width, so a set of
         pictures does not arrive as three identical tiles every time. It only
         works for a landscape image: a portrait one given three columns is
         taller than the viewport and dwarfs everything beside it. */
      const feature = section.feature && !isPortrait(section.images[0]);
      return (
        <SectionShell label={label} heading={heading} tone={tone} layout="wide">
          <Body body={section.body} />
          <ul
            className={`mt-8 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 ${
              section.columns === 3 ? "lg:grid-cols-3" : ""
            }`}
          >
            {section.images.map((img, i) => (
              <li
                key={img.src}
                className={feature && i === 0 ? "sm:col-span-2 lg:col-span-3" : ""}
              >
                <Reveal
                  delay={(i % 3) * 0.06}
                  className={`grain relative rounded-[20px] bg-[var(--v2-surface)] ${
                    isPortrait(img) ? "mx-auto max-w-[50%]" : ""
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.w}
                    height={img.h}
                    sizes={
                      isPortrait(img)
                        ? "(min-width: 1024px) 17vw, (min-width: 640px) 25vw, 50vw"
                        : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    }
                    className="h-auto w-full"
                  />
                </Reveal>
                <p
                  className={`mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)] ${
                    isPortrait(img) ? "text-center" : ""
                  }`}
                >
                  {img.caption}
                </p>
              </li>
            ))}
          </ul>
        </SectionShell>
      );
    }

    case "flow":
      return (
        <SectionShell label={label} heading={heading} tone={tone ?? "band"} layout="wide">
          <Body body={section.body} />
          <div className="mt-9">
            <V2Flow spec={section.spec} caption={section.caption} />
          </div>
        </SectionShell>
      );

    case "wires":
      return (
        <SectionShell label={label} heading={heading} tone={tone} layout="wide">
          <Body body={section.body} />
          <ul className="mt-9 grid list-none grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {section.frames.map((f, i) => {
              const Wire = f.slug ? wireframes[f.slug] : null;
              return (
                <motion.li
                  key={f.src ?? f.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: DURATION.base, delay: (i % 4) * 0.07, ease: EASE }}
                >
                  {/* the frame label sits above the frame, the way it does on a
                      Figma canvas */}
                  <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">
                    {String(i + 1).padStart(2, "0")} · {f.title}
                    {f.chosen && (
                      <span className="rounded-full bg-[var(--v2-accent-bg)] px-2 py-0.5 text-[var(--v2-accent)]">
                        Shipped
                      </span>
                    )}
                  </p>
                  <div
                    className={`overflow-hidden rounded-[14px] border text-[var(--v2-ink)] ${
                      Wire ? "p-3" : ""
                    } ${
                      f.chosen
                        ? "border-[var(--v2-accent)] bg-[var(--v2-bg)]"
                        : "border-[var(--v2-line)] bg-[var(--v2-bg)]"
                    }`}
                  >
                    {Wire ? (
                      <Wire />
                    ) : (
                      <Image
                        src={f.src as string}
                        alt={f.title}
                        width={f.w ?? 390}
                        height={f.h ?? 844}
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="h-auto w-full"
                      />
                    )}
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-[var(--v2-secondary)]">
                    {f.note}
                  </p>
                </motion.li>
              );
            })}
          </ul>
        </SectionShell>
      );

    case "video":
      return (
        <SectionShell label={label} heading={heading} tone={tone} layout="wide">
          <Body body={section.body} />
          <div className="mt-9">
            <V2Video
              src={section.src}
              poster={section.poster}
              caption={section.caption}
              ratio={section.ratio}
            />
          </div>
        </SectionShell>
      );

    case "dots":
      return (
        <SectionShell label={label} heading={heading} tone={tone ?? "band"} layout="wide">
          <Body body={section.body} />
          <div className="mt-10">
            <V2DotStat rows={section.rows} />
          </div>
        </SectionShell>
      );

    case "bulktable":
      return (
        <SectionShell label={label} heading={heading} tone={tone ?? "band"} layout="wide">
          <Body body={section.body} />
          <div className="mt-9">
            <V2BulkTable caption={section.caption} />
          </div>
        </SectionShell>
      );

    case "text":
    default:
      return (
        <SectionShell
          label={label}
          heading={heading}
          tone={tone}
          layout={section.lead ? "wide" : "split"}
        >
          <Body body={section.body} lead={section.lead} />
          {section.image && (
            <figure
              className={`mt-9 ${isPortrait(section.image) ? "max-w-[50%]" : ""}`}
            >
              <Reveal
                delay={index % 2 === 0 ? 0 : 0.05}
                className="grain relative rounded-[20px] bg-[var(--v2-surface)]"
              >
                <Image
                  src={section.image.src}
                  alt={section.image.alt}
                  width={section.image.w}
                  height={section.image.h}
                  sizes={
                    isPortrait(section.image)
                      ? "(min-width: 768px) 33vw, 50vw"
                      : "(min-width: 768px) 66vw, 100vw"
                  }
                  className="h-auto w-full"
                />
              </Reveal>
              {section.image.caption && (
                <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">
                  {section.image.caption}
                </figcaption>
              )}
            </figure>
          )}
          {section.stats && <Stats stats={section.stats} />}
        </SectionShell>
      );
  }
}

/* The end of a case study is the best moment to offer another one, so it ends
   with the same cards the home page uses rather than a line of text. Same
   component, same `row` treatment as the home page's "Selected work" triptych
   (flex siblings, the hovered one grows, taller cards) rather than a
   `compact` grid: `compact`'s fixed 230-260px card was too short for the art
   at its natural size, and shrinking the art to fit read worse than just
   giving it the room the home cards already have. */
function MoreWork({ currentSlug }: { currentSlug: string }) {
  /* three, so the row stays one clean line however long the list grows */
  const rest = work.filter((p) => p.slug !== currentSlug).slice(0, 3);

  return (
    <section aria-labelledby="more-work" className="mt-24 border-t border-[var(--v2-line)] pt-8">
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <h2
          id="more-work"
          className="font-mono text-[12px] uppercase tracking-[0.2em]"
        >
          Keep watching
        </h2>
        <Link
          href="/#work"
          className="-my-2 py-2 font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--v2-label)] transition-colors hover:text-[var(--v2-ink)]"
        >
          All work ↗
        </Link>
      </div>

      <ul className="flex list-none flex-col gap-6 md:flex-row md:items-stretch md:gap-4">
        {rest.map((project, i) => (
          <ProjectFolder key={project.slug} project={project} index={i} wide={false} row />
        ))}
      </ul>
    </section>
  );
}

function PageFoot() {
  return (
    <footer className="mx-auto mt-20 max-w-[1240px] px-5 pb-14 md:px-8">
      <div className="flex flex-col gap-3 border-t border-[var(--v2-line)] pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-label)] md:flex-row md:items-center md:justify-between">
        <Link href="/" className="-my-2 inline-block py-2 transition-colors hover:text-[var(--v2-ink)]">
          ← All work
        </Link>
        <span>© {new Date().getFullYear()} · Julian Giraldo · Berlin</span>
      </div>
    </footer>
  );
}
