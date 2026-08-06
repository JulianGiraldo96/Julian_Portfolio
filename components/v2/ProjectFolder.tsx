"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { screens, type ScreenSlug } from "./ProductScreens";
import { startRouteVeil } from "./RouteVeil";
import { EASE, SPRING } from "./motion";

/* Each project card is a tinted panel with the product screen sitting on it,
   nothing in front of it. On hover or keyboard focus the screen rises and
   grows past the card's edges, and the keyword cards are dealt one at a time
   from behind it along the bottom. Clicking blurs the page away and the case
   study arrives in its place.
   The keywords are decoration, aria-hidden: the same words sit in the meta line
   under every card. */

export type FolderProject = {
  slug: ScreenSlug;
  title: string;
  /* what the tool does, in the plainest two words available. The headline
     sells the outcome and the meta line names the product; without this you
     can read a card and still not know what the thing actually does. Keep it
     literal: "Bulk Action", not "bulk farm setup workflow". */
  feature: string;
  headline: string;
  tags: string[];
  year: string;
  /* phones are sized by height, desktop windows by width, so both sit on the
     card at the same visual weight */
  shape: "phone" | "desktop";
  bg: string;
  /* the same tint reworked for the dark theme, swapped in pure CSS */
  bgDark: string;
  /* dark tint in the light theme, so the chips flip to frosted */
  dark?: boolean;
  /* set when the project has a v2 styled case study of its own */
  href?: string;
  /* university work. It gets its own section on the home page and carries a
     badge everywhere else, so a recruiter never has to guess which of these
     shipped to real users. */
  academic?: boolean;
};

/* matches the .v2-leave keyframe in globals.css */
const LEAVE_MS = 380;

/* The screen is large enough to span the card, so the cards are dealt into the
   strip below it, spread like a hand rather than a row. Offsets are
   percentages of the stage, so the fan scales with the column. */
const fan = [
  { x: "-30%", y: "42%", rotate: -7 },
  { x: "0%", y: "46%", rotate: 2 },
  { x: "30%", y: "42%", rotate: 8 },
  { x: "-15%", y: "48%", rotate: -3 },
];

function deal(i: number) {
  return fan[i % fan.length];
}

export function ProjectFolder({
  project,
  index,
  wide,
  compact = false,
  full = false,
}: {
  project: FolderProject;
  index: number;
  wide: boolean;
  /* an odd number of projects leaves the last one without a partner, so it
     takes the whole row rather than sitting in half of one */
  full?: boolean;
  /* the row at the foot of a case study: the same card, sized to sit three
     across instead of two */
  compact?: boolean;
}) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const Screen = screens[project.slug];
  const phone = project.shape === "phone";
  const href = project.href ?? `/work/${project.slug}`;

  /* Touch has no hover, so on those devices the card opens itself once it is
     well inside the viewport. Pointer devices keep the hover reveal. */
  const [openInView, setOpenInView] = useState(false);
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !window.matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => setOpenInView(entry.intersectionRatio > 0.6),
      { threshold: [0, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* pointer position inside the card, in pixels, for the trailing pill and the
     light that follows it */
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const x = useSpring(cx, { stiffness: 380, damping: 32, mass: 0.6 });
  const y = useSpring(cy, { stiffness: 380, damping: 32, mass: 0.6 });

  /* and the same position normalised to -0.5…0.5, which is what the screen
     leans on. A product shot that turns slightly toward you reads as an object
     on the card rather than a picture pasted onto it. */
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const tilt = { stiffness: 170, damping: 20, mass: 0.7 };
  const rotateY = useSpring(useTransform(nx, (v) => v * 8), tilt);
  const rotateX = useSpring(useTransform(ny, (v) => v * -6), tilt);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (!mouse) setMouse(true);
    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;
    cx.set(lx);
    cy.set(ly);
    nx.set(lx / rect.width - 0.5);
    ny.set(ly / rect.height - 0.5);
  };

  const onLeave = () => {
    setMouse(false);
    nx.set(0);
    ny.set(0);
  };

  /* Click blurs the page away and the case study arrives behind it. Modified
     clicks and reduced motion navigate the ordinary way. */
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (prefersReduced) return;
      e.preventDefault();
      setLeaving(true);
      /* the veil lives in the root layout, so it survives this page unmounting
         and there is never an uncovered frame */
      startRouteVeil();
      window.setTimeout(() => router.push(href), LEAVE_MS - 60);
    },
    [prefersReduced, router, href],
  );

  const stageState = leaving || openInView ? "open" : "rest";

  /* At rest the window already fills most of the card, and on hover it grows
     past the edges. Its layer is unclipped so nothing cuts it off. It stays
     inside the card on small screens, where there is no room either side
     before the viewport edge. */
  const screenSize = compact
    ? phone
      ? "h-[74%]"
      : "w-[86%]"
    : full
      ? phone
        ? "h-[80%] md:h-[88%]"
        : "w-[84%] md:w-[66%]"
      : phone
      ? "h-[70%] md:h-[80%]"
      : wide
        ? "w-[82%] md:w-[88%]"
        : "w-[84%] md:w-[94%]";

  return (
    <motion.li
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.07, ease: EASE }}
      className={
        compact
          ? "col-span-1"
          : full
            ? "col-span-1 md:col-span-12"
            : `col-span-1 ${wide ? "md:col-span-7" : "md:col-span-5"}`
      }
    >
      <Link href={href} onClick={onClick} className="group block">
        <motion.div
          ref={stageRef}
          initial="rest"
          animate={stageState}
          whileHover="open"
          whileFocus="open"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className={`relative isolate ${
            compact
              ? "h-[230px] md:h-[260px]"
              : full
                ? phone
                  ? "h-[360px] md:h-[440px]"
                  : "h-[420px] md:h-[560px]"
                : "h-[400px] md:h-[520px]"
          }`}
        >
          {/* layer 1: the tinted panel and the keyword cards, clipped.
              `grain` lays a static noise tile over the tint, so the colour has
              some tooth instead of reading as flat fill. */}
          <div
            className={`v2-tint grain absolute inset-0 overflow-hidden rounded-[28px] ${
              project.dark ? "grain-dark" : ""
            }`}
            style={
              {
                "--tint": project.bg,
                "--tint-dark": project.bgDark,
              } as React.CSSProperties
            }
          >
            {/* the light the pointer carries. A fixed size disc translated by
                the pointer springs, so it is a transform and never a repaint.
                Blend rather than paint, so it lifts the tint instead of
                greying it. */}
            <motion.span
              aria-hidden
              style={prefersReduced || !mouse ? { opacity: 0 } : { x, y }}
              variants={{ rest: { opacity: 0 }, open: { opacity: mouse && !prefersReduced ? 1 : 0 } }}
              transition={{ duration: 0.35, ease: EASE }}
              className={`pointer-events-none absolute left-0 top-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full ${
                project.dark ? "mix-blend-soft-light" : "mix-blend-overlay"
              }`}
            >
              <span className="block h-full w-full rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_68%)]" />
            </motion.span>

            {!compact && project.tags.map((tag, i) => {
              const d = deal(i);
              return (
                <motion.div
                  key={tag}
                  aria-hidden
                  variants={{
                    rest: { x: 0, y: "16%", opacity: 0 },
                    open: { x: d.x, y: d.y, opacity: 1 },
                  }}
                  transition={{ ...SPRING, delay: 0.1 + i * 0.075 }}
                  className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
                >
                  <motion.span
                    variants={{
                      rest: { rotate: 0, scale: 0.7 },
                      open: { rotate: d.rotate, scale: 1 },
                    }}
                    transition={{ ...SPRING, delay: 0.1 + i * 0.075 }}
                    className={`v2-chip inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] shadow-[0_18px_36px_-18px_rgba(0,0,0,0.75)] ${
                      project.dark ? "v2-chip--ondark" : ""
                    }`}
                  >
                    <span className="v2-chip__dot h-1 w-1 shrink-0 rounded-full" />
                    {tag}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>

          {/* layer 2: the screen, unclipped so it can grow past the card.
              The perspective lives on the wrapper, so the lean is real
              rotation rather than a skew. */}
          <div
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ perspective: 1100 }}
          >
            <motion.div
              variants={{
                rest: { scale: 1, y: "0%" },
                open: compact
                  ? { scale: 1.07, y: "-3%" }
                  : { scale: 1.14, y: "-7%" },
              }}
              style={prefersReduced ? undefined : { rotateX, rotateY }}
              transition={SPRING}
              className={`flex items-center justify-center shadow-[0_22px_44px_-8px_rgba(0,0,0,0.28)] ${
                phone ? "rounded-[30px]" : "rounded-[18px]"
              } ${compact ? "shadow-[0_14px_28px_-8px_rgba(0,0,0,0.26)]" : ""} ${screenSize}`}
            >
              <Screen className={phone ? "h-full w-auto" : "h-auto w-full"} />
            </motion.div>
          </div>

          {/* cursor companion, mouse only */}
          <motion.span
            aria-hidden
            style={prefersReduced || !mouse ? undefined : { x, y }}
            variants={{
              rest: { opacity: 0, scale: 0.8 },
              open: { opacity: mouse && !prefersReduced && !leaving ? 1 : 0, scale: 1 },
            }}
            transition={{ duration: 0.2, ease: EASE }}
            className="pointer-events-none absolute left-0 top-0 z-30 -translate-x-1/2 translate-y-5 whitespace-nowrap rounded-full bg-[var(--v2-invert-bg)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-invert-ink)]"
          >
            Read case study
          </motion.span>
        </motion.div>

        <div className={compact ? "mt-4 px-1" : "mt-5 px-1"}>
          <p className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--v2-ink)]">
            {project.feature}
            {project.academic && (
              <span className="rounded-full border border-[var(--v2-line-strong)] px-2 py-0.5 text-[var(--v2-label)]">
                Academic
              </span>
            )}
          </p>
          <h3
            className={`max-w-[24ch] font-display font-light tracking-[-0.03em] transition-opacity duration-300 group-hover:opacity-70 ${
              compact
                ? "text-[17px] leading-[1.2]"
                : "text-[24px] leading-[1.14] md:text-[30px]"
            }`}
          >
            {project.headline}
          </h3>
          <p className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-label)]">
            {compact
              ? `${project.title} · ${project.year}`
              : `${project.title} · ${project.year} · ${project.tags.join(" · ")}`}
          </p>
        </div>
      </Link>

    </motion.li>
  );
}
