"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";
import { screens, type ScreenSlug } from "./ProductScreens";
import { CursorLoop, type CursorStop } from "./CursorLoop";
import { startRouteVeil } from "./RouteVeil";
import { EASE } from "./motion";

/* viewBox of each mockup, matched to its own <svg viewBox> in
   ProductScreens.tsx so the fake-cursor overlay lines up exactly. Savee is
   the real exported screenshot (780x1688), not a viewBox we drew, so the
   route below is an estimate of where a shopping-list's checkboxes sit. */
const screenBox: Record<ScreenSlug, string> = {
  "erp-duo": "0 0 360 240",
  "scan-memory": "0 0 360 240",
  taurus: "0 0 360 240",
  savee: "0 0 780 1688",
  meinerva: "0 0 170 320",
};

/* each product's own brand colour, pulled from its mockup in
   ProductScreens.tsx, so the cursor loop's glow reads as that product
   reacting rather than a generic system effect. */
const cursorAccent: Record<ScreenSlug, string> = {
  "erp-duo": "#2E8A77",
  "scan-memory": "#2E8A77",
  taurus: "#1F5FBF",
  savee: "#7ED957",
  meinerva: "#C6A96B",
};

/* one small "someone is using this" loop per product: on desktop screens the
   pointer hovers a nav item or row (the real control lights up, like an
   actual :hover) then clicks the thing that does something. Phone screens
   (Meinerva, Savee) don't hover — a finger only taps, so their routes are
   click-only. */
const cursorRoute: Record<ScreenSlug, CursorStop[]> = {
  "erp-duo": [
    { x: 64.5, y: 37, box: { x: 18, y: 14, w: 73, h: 46, rx: 8 } }, // stat: Revenue
    { x: 101, y: 110, box: { x: 18, y: 72, w: 166, h: 76, rx: 8 } }, // chart panel
    { x: 218, y: 101, click: true, box: { x: 196, y: 72, w: 146, h: 76, rx: 8 } }, // alerts panel
    { x: 289, y: 187, click: true, box: { x: 256, y: 176, w: 66, h: 22, rx: 11 } }, // status pill
  ],
  taurus: [
    { x: 153, y: 27, box: { x: 118, y: 16, w: 70, h: 22, rx: 11 } }, // "Pegar filas"
    { x: 64, y: 27, click: true, box: { x: 18, y: 16, w: 92, h: 22, rx: 11 } }, // "Carga múltiple"
    { x: 22.5, y: 58, box: { x: 18, y: 53.5, w: 9, h: 9, rx: 2 } }, // header checkbox
    { x: 298, y: 220, click: true, box: { x: 254, y: 210, w: 88, h: 20, rx: 10 } }, // "Guardar" button
  ],
  "scan-memory": [
    { x: 73, y: 29, box: { x: 18, y: 18, w: 110, h: 22, rx: 11 } }, // store picker
    { x: 287, y: 29, box: { x: 232, y: 18, w: 110, h: 22, rx: 11 } }, // scan field
    { x: 32.5, y: 90, click: true, box: { x: 28, y: 85.5, w: 9, h: 9, rx: 2.5 } }, // toggle first row
    { x: 294, y: 208, click: true, box: { x: 246, y: 198, w: 96, h: 20, rx: 10 } }, // accept button
  ],
  meinerva: [
    { x: 60, y: 68, click: true, box: { x: 40, y: 48, w: 40, h: 40, rx: 20 } }, // tap the artwork
    { x: 30, y: 234.5, click: true, box: { x: 18, y: 226, w: 76, h: 17, rx: 8.5 } }, // tap "Unlock hint"
    { x: 28, y: 275, click: true, box: { x: 18, y: 268, w: 134, h: 14, rx: 7 } }, // tap a critique
  ],
  savee: [
    { x: 90, y: 640, click: true },
    { x: 90, y: 800, click: true },
    { x: 90, y: 1120, click: true },
  ],
};

/* Card frame ported from flora.ai's "Process" triptych: the product shot
   floats centered in the card, smaller than the frame with room around it
   (not cropped edge to edge — flora's own cards never fill either), a
   number + title sit in the top corner, and the headline + meta line sit
   over the bottom gradient. The shot lifts slightly on hover, a plain CSS
   scale rather than a looping video. Kept from the old design: the site's
   own type voice (font-light display headline, mono uppercase meta) rather
   than flora's heavier weights, so the card frame changes but the page
   still reads as one typographic system. */

export type FolderProject = {
  slug: ScreenSlug;
  title: string;
  feature: string;
  headline: string;
  tags: string[];
  year: string;
  shape: "phone" | "desktop";
  bg: string;
  bgDark: string;
  dark?: boolean;
  href?: string;
  academic?: boolean;
};

/* matches the .v2-leave keyframe in globals.css */
const LEAVE_MS = 380;

export function ProjectFolder({
  project,
  index,
  wide,
  compact = false,
  full = false,
  row = false,
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
  /* flora's triptych: siblings sit side by side as equal flex panels and the
     hovered one grows while the rest give up the width, pure CSS (`flex`
     is animatable, so no JS drives the expand) */
  row?: boolean;
}) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const Screen = screens[project.slug];
  const href = project.href ?? `/work/${project.slug}`;
  const phone = project.shape === "phone";

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
            : row
              ? "min-w-0 md:min-w-[80px] md:flex-1 md:transition-[flex-grow] md:duration-[600ms] md:[transition-timing-function:cubic-bezier(0.32,0.72,0,1)] md:hover:flex-[2.1] md:focus-within:flex-[2.1]"
              : `col-span-1 ${wide ? "md:col-span-7" : "md:col-span-5"}`
      }
    >
      <Link href={href} onClick={onClick} className="group block h-full">
        <div
          className={`v2-tint v2-card-bezel relative isolate flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--v2-line)] transition-colors duration-300 group-hover:border-[var(--v2-line-strong)] ${
            leaving ? "opacity-0" : ""
          } ${
            compact
              ? "h-[230px] md:h-[260px]"
              : full
                ? "h-[70vh] md:h-[85vh]"
                : row
                  ? "h-[380px] md:h-[560px]"
                  : "h-[400px] md:h-[520px]"
          }`}
          style={
            {
              "--tint": project.bg,
              "--tint-dark": project.bgDark,
              transition: "opacity 300ms ease",
              /* a project.dark card (Meinerva) keeps a near-black tint in
                 BOTH themes, so the ink tokens the text and line art read
                 must not flip to the light theme's dark values — that's
                 dark-on-dark, invisible. Pin them to the dark palette
                 (globals.css, [data-v2-theme="dark"] .v2-root) here, where
                 the cascade puts them ahead of the theme swap. */
              ...(project.dark
                ? {
                    "--v2-ink": "#f2f2f4",
                    "--v2-secondary": "#a8a8b0",
                    "--v2-label": "#8f8f98",
                    "--v2-line": "rgba(255, 255, 255, 0.1)",
                    "--v2-line-strong": "rgba(255, 255, 255, 0.24)",
                    "--v2-warn": "#e79170",
                    "--v2-invert-bg": "#f2f2f4",
                    "--v2-invert-ink": "#0c0c0e",
                  }
                : null),
            } as React.CSSProperties
          }
        >
          {/* header, footer and the art area are stacked in normal flow (not
              three overlaid absolute layers) so the art's slot is whatever
              space is actually left over, never a guessed padding number —
              header and footer can never be overlapped by it, however many
              lines their text wraps to. */}
          <div
            className={`z-10 flex shrink-0 items-center gap-2 font-mono uppercase tracking-[0.18em] text-[var(--v2-ink)] ${
              compact ? "p-4 text-[10px]" : "p-6 text-[11px] md:p-9"
            }`}
          >
            <span className="text-[var(--v2-label)]">{String(index + 1).padStart(2, "0")}</span>
            <span>{project.title}</span>
            {project.academic && (
              <span className="rounded-full border border-[var(--v2-line-strong)] px-2 py-0.5 text-[var(--v2-secondary)]">
                Academic
              </span>
            )}
          </div>

          {/* the product shot, centered in whatever's left between header
              and footer. No scrim behind it: the art is line work, not a
              photo, so it needs no darkening to keep the text above legible. */}
          <div
            className={`flex min-h-0 flex-1 items-center justify-center ${
              compact ? "px-5 py-2" : full ? "px-10 py-4 md:px-16 md:py-6" : "px-6 py-3 md:px-8 md:py-4"
            }`}
          >
            {/* h-full on both axes, not the width-driven h-auto this used to
                be: that let a wide screen compute its own height from the
                viewBox aspect ratio alone, ignoring how tall this flex-1
                slot actually is — on the short compact cards (the row at a
                case study's foot) it overflowed both into the header above
                and the footer below. preserveAspectRatio="meet" on the SVGs
                (ProductScreens.tsx) does the actual fitting: it shrinks to
                whatever box it's given, on both axes, never crops, never
                spills. */}
            <div className={`relative h-full ${phone ? "w-auto" : "w-full"}`}>
              <Screen
                className={`block h-full transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.05] ${
                  phone ? "w-auto" : "w-full"
                }`}
              />
              {!compact && !prefersReduced && (
                <CursorLoop
                  stops={cursorRoute[project.slug]}
                  viewBox={screenBox[project.slug]}
                  pointer={phone ? "touch" : "mouse"}
                  accent={cursorAccent[project.slug]}
                  className="transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.05]"
                />
              )}
            </div>
          </div>

          {/* footer: headline + meta line, bottom-left */}
          <div
            className={`z-10 shrink-0 ${compact ? "p-4" : "p-6 md:p-9"}`}
          >
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--v2-secondary)]">
              {project.feature}
            </p>
            <h3
              className={`max-w-[24ch] font-display font-light tracking-[-0.03em] text-[var(--v2-ink)] ${
                compact ? "text-[17px] leading-[1.2]" : "text-[24px] leading-[1.14] md:text-[30px]"
              }`}
            >
              {project.headline}
            </h3>
            {!compact && (
              <p className="mt-2.5 max-w-[30ch] font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-secondary)]">
                {project.year} · {project.tags.join(" · ")}
              </p>
            )}
          </div>

          {/* case-study affordance, bottom-right, on hover/focus only */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-6 right-6 z-10 hidden rounded-full border border-[var(--v2-line-strong)] bg-[var(--v2-invert-bg)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-invert-ink)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
          >
            Read case study
          </span>
        </div>
      </Link>
    </motion.li>
  );
}
