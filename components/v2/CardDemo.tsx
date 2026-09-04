"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import { motion, useInView, useReducedMotion, type Easing } from "motion/react";
import { EASE } from "./motion";
import { screens, type ScreenSlug } from "./ProductScreens";

/* the v2 theme, so a result that has to paint over the mockup (relabel a
   dropdown, dim a deleted row) can use the card's own tint. Mirrors Theme.tsx:
   the attribute is on <html>, the bootstrap opens every visit dark. */
function useV2Dark() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("v2themechange", cb);
      return () => window.removeEventListener("v2themechange", cb);
    },
    () => document.documentElement.getAttribute("data-v2-theme") === "dark",
    () => true,
  );
}

/* The product screen on a card, being used.

   A still SVG mockup reads as a poster. This wraps that same mockup and runs a
   short recording over it: a pointer moves through the screen with real
   acceleration, aims at a control, presses it, and the screen answers — a box
   checks, a row of checks cascades, a button floods, a confirmation stamps in.
   On one beat per loop the whole frame pushes in on the thing being pressed,
   the way a screen recording zooms to a detail, then pulls back out.

   The three cards never move as one: each demo has its own `phase` (a start
   offset) and `tempo` (loop-length multiplier), and the routes differ in shape
   and dwell, so their loops never begin together and never drift back into
   sync.

   The screen itself is never modified — every result is drawn here as an
   overlay in the screen's own viewBox coordinates, and the zoom is a transform
   on a <g> that wraps both the screen and the overlay, so they push in
   together and stay aligned. The outer <svg> clips anything the zoom pushes
   past the frame. No CSS/SVG filters (a filter region on a scaled element is
   the ghost-rectangle bug); depth is layered opacity only.

   Inert until the card is near the viewport (`useInView`); under
   prefers-reduced-motion nothing animates — the static screen is all there is. */

type Box = { x: number; y: number; w: number; h: number; rx?: number };

type Label = {
  text: string;
  tx: number;
  ty: number;
  size: number;
  anchor?: "start" | "middle" | "end";
  fill?: "ink" | "accent";
  weight?: number;
};

type Result =
  | { kind: "check"; at: Box }
  | { kind: "checkSeq"; at: Box[] }
  | { kind: "flood"; at: Box }
  | { kind: "strike"; x: number; y: number; w: number }
  /* a select opening: a small panel drops under `at`, one option lights up,
     it closes again — not held, a flash during the press */
  | { kind: "dropdown"; at: Box; options: string[]; pick: number }
  /* paint the card tint over `cover` and draw new text — a value changing in
     place (a picker's label, a running total) */
  | { kind: "relabel"; cover: Box; label: Label }
  /* a row being removed: the tint dims it and a line strikes through */
  | { kind: "rowOut"; row: Box; strike: { x: number; y: number; w: number } };

type Stop = {
  x: number;
  y: number;
  /* seconds; defaults to 0.55 for a hover, 0.9 for a click */
  dwell?: number;
  click?: boolean;
  /* the real control under this stop — it takes a hover / press glow */
  box?: Box;
  /* push the whole frame in on the pointer while it presses here — the zoom is
     always centred on the cursor, so the frame is always on the action, and
     the translate is clamped so the push-in never reveals the card behind */
  zoom?: number;
  /* what the press produced, drawn as an overlay, held to the loop's end.
     Everything is drawn ON its control (a check in the box, a flood over the
     button) — nothing floats, nothing can overlap anything else. */
  results?: Result[];
};

type Demo = {
  slug: ScreenSlug;
  vbw: number;
  vbh: number;
  accent: string;
  phase: number;
  tempo: number;
  pointer: "mouse" | "touch";
  /* the card's tint (light / dark), for results that paint over the mockup */
  tint?: [string, string];
  /* Savee's screen is a raster export, not an SVG, so it cannot be nested for
     the zoom — its overlay just sits on top and never zooms */
  raster?: boolean;
  stops: Stop[];
};

const ACCENT: Record<ScreenSlug, string> = {
  "erp-duo": "#2E8A77",
  "scan-memory": "#2E8A77",
  taurus: "#1F5FBF",
  savee: "#7ED957",
  meinerva: "#C6A96B",
};

/* one row checkbox on the Taurus table, i = 0..3 */
const taurusRowBox = (i: number): Box => ({ x: 18, y: 67.5 + i * 32, w: 9, h: 9, rx: 2 });

const DEMOS: Record<ScreenSlug, Demo> = {
  "erp-duo": {
    slug: "erp-duo",
    vbw: 360,
    vbh: 240,
    accent: ACCENT["erp-duo"],
    phase: 0,
    tempo: 1,
    pointer: "mouse",
    stops: [
      { x: 54.5, y: 37, box: { x: 18, y: 14, w: 73, h: 46, rx: 8 }, dwell: 0.5 }, // Revenue stat
      { x: 101, y: 116, box: { x: 18, y: 72, w: 166, h: 76, rx: 8 }, dwell: 0.7 }, // chart
      {
        x: 213,
        y: 131,
        click: true,
        dwell: 1.25,
        box: { x: 202, y: 124, w: 134, h: 14, rx: 4 }, // "Missing IBAN" alert row
        zoom: 1.35,
        results: [
          { kind: "check", at: { x: 205.5, y: 126.5, w: 9, h: 9, rx: 2 } },
          { kind: "strike", x: 220, y: 131, w: 34 },
        ],
      },
      {
        x: 289,
        y: 187,
        click: true,
        dwell: 0.95,
        box: { x: 256, y: 176, w: 66, h: 22, rx: 11 }, // "ON NOW" pill
        results: [{ kind: "flood", at: { x: 256, y: 176, w: 66, h: 22, rx: 11 } }],
      },
    ],
  },

  "scan-memory": {
    slug: "scan-memory",
    vbw: 360,
    vbh: 240,
    accent: ACCENT["scan-memory"],
    phase: 2.6,
    tempo: 1.12,
    pointer: "mouse",
    tint: ["#F2EFE8", "#1C1A16"],
    stops: [
      {
        // change store
        x: 73,
        y: 29,
        click: true,
        dwell: 1.15,
        box: { x: 18, y: 18, w: 110, h: 22, rx: 11 },
        zoom: 1.35,
        results: [
          {
            kind: "dropdown",
            at: { x: 18, y: 43, w: 128, h: 42, rx: 6 },
            options: ["Mitte · Torstraße", "Neukölln · Sonnenallee", "Wedding · Müllerstr."],
            pick: 1,
          },
          {
            kind: "relabel",
            cover: { x: 24, y: 24, w: 98, h: 12 },
            label: { text: "Neukölln · Sonnenallee", tx: 28, ty: 32.5, size: 5.4, fill: "ink", weight: 600 },
          },
        ],
      },
      { x: 287, y: 29, box: { x: 232, y: 18, w: 110, h: 22, rx: 11 }, dwell: 0.4 }, // scan field
      {
        // tick a line
        x: 32.5,
        y: 112,
        click: true,
        dwell: 1,
        box: { x: 28, y: 107.5, w: 9, h: 9, rx: 2.5 }, // Stracciatella checkbox
        zoom: 1.4,
        results: [{ kind: "check", at: { x: 28, y: 107.5, w: 9, h: 9, rx: 2.5 } }],
      },
      {
        // delete a line (the ✗ on the Limone row) — units drop 35 → 29
        x: 317,
        y: 156,
        click: true,
        dwell: 1.15,
        box: { x: 309, y: 149, w: 16, h: 14, rx: 3 },
        results: [
          {
            kind: "rowOut",
            row: { x: 24, y: 148, w: 300, h: 16, rx: 3 },
            strike: { x: 44, y: 156, w: 268 },
          },
          {
            kind: "relabel",
            cover: { x: 300, y: 60, w: 34, h: 10 },
            label: { text: "29 units", tx: 332, ty: 66, size: 5.8, anchor: "end", fill: "accent", weight: 700 },
          },
        ],
      },
      {
        x: 294,
        y: 208,
        click: true,
        dwell: 0.95,
        box: { x: 246, y: 198, w: 96, h: 20, rx: 10 }, // "Accept · send"
        results: [{ kind: "flood", at: { x: 246, y: 198, w: 96, h: 20, rx: 10 } }],
      },
    ],
  },

  taurus: {
    slug: "taurus",
    vbw: 360,
    vbh: 240,
    accent: ACCENT.taurus,
    phase: 5.1,
    tempo: 0.92,
    pointer: "mouse",
    stops: [
      { x: 64, y: 27, box: { x: 18, y: 16, w: 92, h: 22, rx: 11 }, dwell: 0.5 }, // "Carga múltiple"
      {
        x: 22.5,
        y: 58,
        click: true,
        dwell: 1.5,
        box: { x: 15, y: 51, w: 15, h: 13, rx: 3 }, // header "select all" checkbox
        // no zoom here — the select-all cascade reads best with all four rows
        // in frame at full scale
        results: [
          {
            kind: "checkSeq",
            at: [taurusRowBox(0), taurusRowBox(1), taurusRowBox(2), taurusRowBox(3)],
          },
        ],
      },
      { x: 153, y: 27, box: { x: 118, y: 16, w: 70, h: 22, rx: 11 }, dwell: 0.4 }, // "Pegar filas" (off-beat)
      {
        x: 298,
        y: 220,
        click: true,
        dwell: 1.15,
        box: { x: 254, y: 210, w: 88, h: 20, rx: 10 }, // "Guardar 68"
        zoom: 1.4,
        results: [{ kind: "flood", at: { x: 254, y: 210, w: 88, h: 20, rx: 10 } }],
      },
    ],
  },

  meinerva: {
    slug: "meinerva",
    vbw: 170,
    vbh: 320,
    accent: ACCENT.meinerva,
    phase: 1.4,
    tempo: 1.05,
    pointer: "touch",
    stops: [
      { x: 60, y: 68, click: true, box: { x: 40, y: 48, w: 40, h: 40, rx: 20 } }, // the artwork
      { x: 30, y: 234.5, click: true, box: { x: 18, y: 226, w: 76, h: 17, rx: 8.5 } }, // "Unlock hint"
      { x: 28, y: 285, click: true, box: { x: 18, y: 278, w: 128, h: 14, rx: 7 } }, // a critique
    ],
  },

  savee: {
    slug: "savee",
    vbw: 780,
    vbh: 1688,
    accent: ACCENT.savee,
    phase: 3.9,
    tempo: 1.15,
    pointer: "touch",
    raster: true,
    stops: [
      { x: 90, y: 640, click: true },
      { x: 90, y: 800, click: true },
      { x: 90, y: 1120, click: true },
    ],
  },
};

/* the mockup's own width/height ratio, for a caller that needs to reserve the
   box before CardDemo mounts (a hero cover, sized by CSS aspect-ratio rather
   than the fixed-height card slot ProjectFolder gives it) */
export function screenAspect(slug: ScreenSlug) {
  const d = DEMOS[slug];
  return d.vbw / d.vbh;
}

const TRAVEL = 0.6;

function checkPath(b: Box) {
  return `M ${b.x + b.w * 0.18} ${b.y + b.h * 0.52} L ${b.x + b.w * 0.42} ${b.y + b.h * 0.74} L ${b.x + b.w * 0.84} ${b.y + b.h * 0.24}`;
}

type Built = ReturnType<typeof build>;

function build(demo: Demo) {
  const { stops, tempo } = demo;

  const xs: number[] = [];
  const ys: number[] = [];
  const posT: number[] = [];

  const ringT: number[] = [];
  const ringO: number[] = [];
  const ringS: number[] = [];
  const pressS: number[] = []; // cursor dip, shares ringT

  const hi: { box: Box; t: number[]; o: number[] }[] = [];
  /* zoom keyframes: scale plus the translate (screen user units) that centres
     the framed region under a 0,0-origin scale */
  const zps: { t: number; s: number; tx: number; ty: number }[] = [{ t: 0, s: 1, tx: 0, ty: 0 }];
  const results: { r: Result; fire: number }[] = [];

  let t = 0;
  stops.forEach((s, i) => {
    const dwell = (s.dwell ?? (s.click ? 0.9 : 0.55)) * tempo;
    const travel = (i === 0 ? 0 : TRAVEL) * tempo;
    t += travel;
    const arrive = t;
    const leave = t + dwell;
    const clickAt = arrive + dwell * 0.42;

    xs.push(s.x, s.x);
    ys.push(s.y, s.y);
    posT.push(arrive, leave);

    if (s.click) {
      ringT.push(arrive, clickAt, clickAt + dwell * 0.16, leave);
      ringO.push(0, 0.55, 0.2, 0);
      ringS.push(0.3, 1.1, 1.7, 2.4);
      pressS.push(1, 0.88, 1.04, 1);
    } else {
      ringT.push(arrive, leave);
      ringO.push(0, 0);
      ringS.push(0.3, 0.3);
      pressS.push(1, 1);
    }

    if (s.box) {
      if (s.click) {
        hi.push({
          box: s.box,
          t: [arrive, arrive + dwell * 0.2, clickAt, clickAt + dwell * 0.25, leave],
          o: [0, 0.5, 0.95, 0.45, 0],
        });
      } else {
        hi.push({
          box: s.box,
          t: [arrive, arrive + dwell * 0.22, leave - dwell * 0.22, leave],
          o: [0, 0.5, 0.5, 0],
        });
      }
    }

    if (s.zoom) {
      /* Scale from the top-left (origin 0,0) and translate so the pointer stays
         pinned exactly where it is on screen — the push-in is always centred on
         the action, and because the pin point is inside the frame the mockup
         always still fills it (no card showing through at an edge). */
      const z = s.zoom;
      const tx = s.x * (1 - z);
      const ty = s.y * (1 - z);
      zps.push({ t: arrive - travel * 0.45, s: 1, tx: 0, ty: 0 });
      zps.push({ t: arrive + dwell * 0.16, s: z, tx, ty });
      zps.push({ t: leave - dwell * 0.06, s: z, tx, ty });
      zps.push({ t: leave + 0.32 * tempo, s: 1, tx: 0, ty: 0 });
    }

    if (s.results) for (const r of s.results) results.push({ r, fire: clickAt });

    t = leave;
  });

  const dur = t + TRAVEL * tempo;
  xs.push(stops[0].x);
  ys.push(stops[0].y);
  posT.push(dur);
  ringT.push(dur);
  ringO.push(0);
  ringS.push(0.3);
  pressS.push(1);
  zps.push({ t: dur, s: 1, tx: 0, ty: 0 });

  const norm = (arr: number[]) => {
    let last = -1;
    return arr.map((v) => {
      let x = Math.min(1, Math.max(0, v / dur));
      if (x <= last) x = last + 0.0005;
      last = x;
      return x;
    });
  };

  const posEase: Easing[] = ["linear"];
  for (let i = 1; i < stops.length; i++) posEase.push("easeInOut", "linear");
  posEase.push("easeInOut");

  zps.sort((a, b) => a.t - b.t);

  return {
    dur,
    phase: demo.phase,
    xs,
    ys,
    posT: norm(posT),
    posEase,
    ringT: norm(ringT),
    ringO,
    ringS,
    pressS,
    hi: hi.map((h) => ({ ...h, t: norm(h.t) })),
    zoom: {
      scale: zps.map((z) => z.s),
      x: zps.map((z) => z.tx),
      y: zps.map((z) => z.ty),
      times: norm(zps.map((z) => z.t)),
    },
    results: results.map((x) => ({ ...x, fire: Math.min(0.9, x.fire / dur) })),
  };
}

/* opacity keyframes for a result that appears at `fire` (0..1) and holds until
   the loop resets */
function hold(fire: number) {
  const a = Math.max(0.001, fire - 0.015);
  return { times: [0, a, fire, 0.955, 1], values: [0, 0, 1, 1, 0] };
}

function Overlay({ demo, built, tint }: { demo: Demo; built: Built; tint: string }) {
  const { accent } = demo;
  const glyph = demo.vbw / 360;
  const inkFill = (f?: "ink" | "accent") => (f === "accent" ? accent : "var(--v2-ink)");
  const loop = (times: number[]) => ({
    duration: built.dur,
    times,
    repeat: Infinity,
    ease: EASE,
    delay: built.phase,
  });

  return (
    <>
      {/* the control under the pointer, lighting up */}
      {built.hi.map((h, i) => (
        <motion.rect
          key={`hi-${i}`}
          x={h.box.x}
          y={h.box.y}
          width={h.box.w}
          height={h.box.h}
          rx={h.box.rx ?? 4}
          fill="none"
          stroke={accent}
          strokeWidth="1.4"
          initial={{ opacity: 0 }}
          animate={{ opacity: h.o }}
          transition={loop(h.t)}
        />
      ))}

      {/* what each press produced */}
      {built.results.map(({ r, fire }, i) => {
        const h = hold(fire);
        const key = `res-${i}`;

        if (r.kind === "check" || r.kind === "checkSeq") {
          const boxes = r.kind === "check" ? [r.at] : r.at;
          return (
            <g key={key}>
              {boxes.map((b, j) => {
                const f = Math.min(0.9, fire + j * 0.09);
                const hj = hold(f);
                return (
                  <g key={j}>
                    <motion.rect
                      x={b.x}
                      y={b.y}
                      width={b.w}
                      height={b.h}
                      rx={b.rx ?? 2}
                      fill={accent}
                      stroke="none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hj.values.map((v) => v * 0.9) }}
                      transition={loop(hj.times)}
                    />
                    <motion.path
                      d={checkPath(b)}
                      fill="none"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: [0, 0, 1, 1, 0], opacity: hj.values }}
                      transition={loop([
                        0,
                        Math.max(0.002, f - 0.01),
                        Math.min(0.95, f + 0.07),
                        0.955,
                        1,
                      ])}
                    />
                  </g>
                );
              })}
            </g>
          );
        }

        if (r.kind === "flood") {
          const b = r.at;
          return (
            <g key={key}>
              <motion.rect
                x={b.x}
                y={b.y}
                height={b.h}
                rx={b.rx ?? 6}
                fill={accent}
                stroke="none"
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: [0, 0, b.w, b.w, 0],
                  opacity: h.values.map((v) => (v ? 0.92 : 0)),
                }}
                transition={loop([
                  0,
                  Math.max(0.002, fire - 0.01),
                  Math.min(0.9, fire + 0.12),
                  0.955,
                  1,
                ])}
              />
              <motion.path
                d={checkPath({ x: b.x + b.w / 2 - 5, y: b.y + b.h / 2 - 5, w: 10, h: 10 })}
                fill="none"
                stroke="#fff"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 0, 1, 1, 0], opacity: h.values }}
                transition={loop([
                  0,
                  Math.max(0.002, fire + 0.05),
                  Math.min(0.95, fire + 0.16),
                  0.955,
                  1,
                ])}
              />
            </g>
          );
        }

        if (r.kind === "strike") {
          return (
            <motion.line
              key={key}
              x1={r.x}
              y1={r.y}
              y2={r.y}
              stroke={accent}
              strokeWidth="1.4"
              strokeLinecap="round"
              initial={{ opacity: 0, x2: r.x }}
              animate={{ x2: [r.x, r.x, r.x + r.w, r.x + r.w, r.x], opacity: h.values }}
              transition={loop([
                0,
                Math.max(0.002, fire - 0.01),
                Math.min(0.9, fire + 0.1),
                0.955,
                1,
              ])}
            />
          );
        }

        if (r.kind === "dropdown") {
          const { at, options, pick } = r;
          const rowH = at.h / options.length;
          /* a flash: opens on the press, closes before the pointer leaves */
          const openT = loop([
            0,
            Math.max(0.002, fire - 0.01),
            fire,
            Math.min(0.9, fire + 0.14),
            Math.min(0.92, fire + 0.2),
            1,
          ]);
          const openV = [0, 0, 1, 1, 0, 0];
          return (
            <motion.g
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: openV }}
              transition={openT}
            >
              {/* a hair of shadow-substitute so the panel reads as lifted off
                  the list it covers, then the panel itself on the surface tone */}
              <rect
                x={at.x - 1}
                y={at.y - 1}
                width={at.w + 2}
                height={at.h + 3}
                rx={(at.rx ?? 5) + 1}
                fill="#000"
                fillOpacity="0.28"
              />
              <rect
                x={at.x}
                y={at.y}
                width={at.w}
                height={at.h}
                rx={at.rx ?? 5}
                fill="var(--v2-surface)"
                stroke={accent}
                strokeWidth="1"
              />
              {options.map((opt, k) => (
                <g key={opt}>
                  {k === pick && (
                    <rect
                      x={at.x + 2}
                      y={at.y + 2 + k * rowH}
                      width={at.w - 4}
                      height={rowH - 2}
                      rx={3}
                      fill={accent}
                      fillOpacity="0.16"
                    />
                  )}
                  <text
                    x={at.x + 7}
                    y={at.y + k * rowH + rowH / 2 + 2}
                    fontSize="5"
                    fontWeight={k === pick ? 600 : 400}
                    fill={k === pick ? accent : "var(--v2-secondary)"}
                  >
                    {opt}
                  </text>
                </g>
              ))}
            </motion.g>
          );
        }

        if (r.kind === "relabel") {
          const { cover, label } = r;
          return (
            <motion.g
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: h.values }}
              transition={loop(h.times)}
            >
              <rect
                x={cover.x}
                y={cover.y}
                width={cover.w}
                height={cover.h}
                fill={tint}
                stroke="none"
              />
              <text
                x={label.tx}
                y={label.ty}
                fontSize={label.size}
                fontWeight={label.weight ?? 400}
                fill={inkFill(label.fill)}
                textAnchor={label.anchor ?? "start"}
              >
                {label.text}
              </text>
            </motion.g>
          );
        }

        // rowOut — a deleted line: tint dims it, a rule strikes through
        return (
          <motion.g
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: h.values }}
            transition={loop(h.times)}
          >
            <rect
              x={r.row.x}
              y={r.row.y}
              width={r.row.w}
              height={r.row.h}
              rx={r.row.rx ?? 3}
              fill={tint}
              fillOpacity="0.62"
              stroke="none"
            />
            <line
              x1={r.strike.x}
              y1={r.strike.y}
              x2={r.strike.x + r.strike.w}
              y2={r.strike.y}
              stroke="var(--v2-label)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </motion.g>
        );
      })}

      {/* the pointer */}
      <motion.g
        animate={{ x: built.xs, y: built.ys }}
        transition={{
          duration: built.dur,
          times: built.posT,
          repeat: Infinity,
          ease: built.posEase,
          delay: built.phase,
        }}
      >
        <g transform={`scale(${glyph})`}>
          {demo.pointer === "touch" ? (
            <motion.g
              animate={{ opacity: built.ringO.map((o) => o * 1.6), scale: built.ringS }}
              transition={loop(built.ringT)}
            >
              <circle r="11" fill="none" stroke={accent} strokeWidth="1.4" strokeOpacity="0.6" />
              <circle r="5" fill="none" stroke={accent} strokeWidth="1.2" />
            </motion.g>
          ) : (
            <>
              <motion.circle
                r="7"
                fill="none"
                stroke={accent}
                strokeWidth="1.4"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: built.ringO, scale: built.ringS }}
                transition={loop(built.ringT)}
              />
              <motion.g animate={{ scale: built.pressS }} transition={loop(built.ringT)}>
                <path
                  d="M0 0 L0 13.4 L3.2 10.4 L5.7 15.7 L7.7 14.7 L5.3 9.5 L9.1 9.2 Z"
                  fill={accent}
                  fillOpacity="0.14"
                  stroke={accent}
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </motion.g>
            </>
          )}
        </g>
      </motion.g>
    </>
  );
}

export function CardDemo({
  slug,
  phone = false,
  className = "",
}: {
  slug: ScreenSlug;
  phone?: boolean;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "240px 0px" });
  const run = inView && !prefersReduced;
  const dark = useV2Dark();

  const demo = DEMOS[slug];
  const built = useMemo(() => build(demo), [demo]);
  const Screen = screens[slug];
  const w = phone ? "w-auto" : "w-full";
  const tint = demo.tint ? demo.tint[dark ? 1 : 0] : "var(--v2-bg)";

  /* Savee: raster screen, overlay sits on top, no zoom */
  if (demo.raster) {
    return (
      <div ref={rootRef} className={`relative h-full ${w} ${className}`}>
        <Screen className={`block h-full ${w}`} />
        <svg
          viewBox={`0 0 ${demo.vbw} ${demo.vbh}`}
          aria-hidden
          preserveAspectRatio="xMidYMid meet"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {run && <Overlay demo={demo} built={built} tint={tint} />}
        </svg>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={`relative h-full ${w} ${className}`}>
      <svg
        viewBox={`0 0 ${demo.vbw} ${demo.vbh}`}
        aria-hidden
        preserveAspectRatio="xMidYMid meet"
        className={`block h-full ${w}`}
      >
        <motion.g
          style={{ transformBox: "view-box", originX: 0, originY: 0 }}
          animate={
            run
              ? { scale: built.zoom.scale, x: built.zoom.x, y: built.zoom.y }
              : { scale: 1, x: 0, y: 0 }
          }
          transition={
            run
              ? {
                  duration: built.dur,
                  times: built.zoom.times,
                  repeat: Infinity,
                  ease: EASE,
                  delay: built.phase,
                }
              : { duration: 0 }
          }
        >
          {/* the mockup itself, nested so the zoom <g> transforms it too */}
          <Screen className="" />
          {run && <Overlay demo={demo} built={built} tint={tint} />}
        </motion.g>
      </svg>
    </div>
  );
}
