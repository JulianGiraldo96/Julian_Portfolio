"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { EASE } from "./motion";

/* A fake pointer that loops around a product screen, always on, pausing on
   things that look clickable and pulsing where it "clicks" — so a still SVG
   mockup reads as a working product instead of a static poster. Every stop
   that names a `box` also puts a real hover state on that control while the
   pointer sits there (like `:hover` on a real button), with clicks getting a
   stronger flash on top, both tinted with the product's own accent colour
   rather than a generic white so each card's loop reads as that product,
   not a shared effect. Coordinates are in the screen's own viewBox space so
   the pointer tracks the mockup exactly regardless of how the card scales
   it.

   No CSS/SVG filters here — a filter region on an element inside this
   card's scaled, `isolate` hover wrapper is what produced the ghost
   rectangle bug elsewhere in v2 (see ProductScreens.tsx). Depth comes from
   layered, low-opacity shapes instead. */

export type CursorStop = {
  x: number;
  y: number;
  /* a longer dwell + a click pulse, for stops that read as a tap rather
     than a hover */
  click?: boolean;
  /* the real control this stop sits over (button, checkbox, nav item, row)
     — it gets a hover/press glow so the interaction reads on the window
     itself, not only on the pointer */
  box?: { x: number; y: number; w: number; h: number; rx?: number };
};

const TRAVEL = 0.85;
const HOVER_DWELL = 0.55;
const CLICK_DWELL = 0.75;

function buildTimeline(stops: CursorStop[]) {
  const xs: number[] = [];
  const ys: number[] = [];
  const posTimes: number[] = [];
  /* the ring under the pointer: a soft sonar pulse on click, invisible
     otherwise */
  const ringOpacity: number[] = [];
  const ringScale: number[] = [];
  const ringTimes: number[] = [];
  /* the finger/fingertip glyph (touch pointer): shares ringTimes exactly,
     just a different amplitude — full opacity, grow-in/lift-off scale */
  const tapOpacity: number[] = [];
  const tapScale: number[] = [];
  const highlights: { box: NonNullable<CursorStop["box"]>; times: number[]; opacity: number[] }[] = [];

  let t = 0;
  for (const stop of stops) {
    const dwell = stop.click ? CLICK_DWELL : HOVER_DWELL;
    const arrive = t;
    const leave = t + dwell;
    const fadeIn = arrive + dwell * 0.18;
    const fadeOut = leave - dwell * 0.18;

    xs.push(stop.x, stop.x);
    ys.push(stop.y, stop.y);
    posTimes.push(arrive, leave);

    if (stop.click) {
      const mid = arrive + dwell * 0.15;
      ringTimes.push(arrive, mid, leave);
      ringOpacity.push(0, 0.55, 0);
      ringScale.push(0.35, 1, 2.1);
      tapOpacity.push(0, 1, 0);
      tapScale.push(0.5, 1, 0.6);
    } else {
      ringTimes.push(arrive, leave);
      ringOpacity.push(0, 0);
      ringScale.push(0.35, 0.35);
      tapOpacity.push(0, 0);
      tapScale.push(0.5, 0.5);
    }

    if (stop.box) {
      if (stop.click) {
        const mid = arrive + dwell * 0.45;
        highlights.push({ box: stop.box, times: [arrive, mid, leave], opacity: [0, 1, 0] });
      } else {
        highlights.push({
          box: stop.box,
          times: [arrive, fadeIn, fadeOut, leave],
          opacity: [0, 0.6, 0.6, 0],
        });
      }
    }

    t = leave + TRAVEL;
  }

  // travel back to the first stop to close the loop seamlessly
  xs.push(stops[0].x);
  ys.push(stops[0].y);
  posTimes.push(t);
  ringTimes.push(t);
  ringOpacity.push(0);
  ringScale.push(0.35);
  tapOpacity.push(0);
  tapScale.push(0.5);

  const duration = t;
  return {
    duration,
    xs,
    ys,
    posTimes: posTimes.map((v) => v / duration),
    ringOpacity,
    ringScale,
    tapOpacity,
    tapScale,
    ringTimes: ringTimes.map((v) => v / duration),
    highlights: highlights.map((h) => ({ ...h, times: h.times.map((v) => v / duration) })),
  };
}

export function CursorLoop({
  stops,
  viewBox,
  pointer = "mouse",
  accent = "#fff",
  className = "",
}: {
  stops: CursorStop[];
  /* same "minX minY width height" string passed to the screen's own <svg
     viewBox>, so the two overlays line up pixel for pixel */
  viewBox: string;
  /* phone mockups (Savee, Meinerva) get a fingertip that taps and lifts —
     no cursor arrow, no hover, since touch screens don't hover */
  pointer?: "mouse" | "touch";
  /* the product's own brand colour, so the hover glow and click ring read
     as that product reacting, not a generic system cursor */
  accent?: string;
  className?: string;
}) {
  const vw = Number(viewBox.split(" ")[2]) || 360;
  const timeline = useMemo(() => buildTimeline(stops), [stops]);
  /* the cursor glyph is drawn at the proportions of a 360-wide screen; scale
     it so it reads the same physical size on the narrower (phone) and wider
     (Savee) screens too */
  const glyphScale = vw / 360;

  return (
    <svg
      viewBox={viewBox}
      aria-hidden
      width="100%"
      height="100%"
      className={`pointer-events-none absolute inset-0 ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* the window reacting: whatever the pointer sits on lights up like a
          real :hover, in the product's own colour, clicks flash brighter */}
      {timeline.highlights.map((h, i) => (
        <motion.rect
          key={i}
          x={h.box.x}
          y={h.box.y}
          width={h.box.w}
          height={h.box.h}
          rx={h.box.rx ?? 4}
          fill="none"
          stroke={accent}
          strokeWidth="1.4"
          animate={{ opacity: h.opacity }}
          transition={{
            duration: timeline.duration,
            times: h.times,
            repeat: Infinity,
            ease: EASE,
          }}
        />
      ))}

      <motion.g
        animate={{ x: timeline.xs, y: timeline.ys }}
        transition={{
          duration: timeline.duration,
          times: timeline.posTimes,
          repeat: Infinity,
          ease: EASE,
        }}
      >
        <g transform={`scale(${glyphScale})`}>
          {/* a faint, always-on breathing halo so the pointer reads as
              present even between stops, not just a flat static glyph */}
          <motion.circle
            r="6"
            fill="none"
            stroke={accent}
            strokeWidth="1"
            initial={{ opacity: 0.2, scale: 1 }}
            animate={{ opacity: [0.16, 0.34, 0.16], scale: [1, 1.14, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {pointer === "touch" ? (
            <motion.g
              animate={{ opacity: timeline.tapOpacity, scale: timeline.tapScale }}
              transition={{
                duration: timeline.duration,
                times: timeline.ringTimes,
                repeat: Infinity,
                ease: EASE,
              }}
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
                animate={{ opacity: timeline.ringOpacity, scale: timeline.ringScale }}
                transition={{
                  duration: timeline.duration,
                  times: timeline.ringTimes,
                  repeat: Infinity,
                  ease: EASE,
                }}
              />
              <path
                d="M0 0 L0 13.4 L3.2 10.4 L5.7 15.7 L7.7 14.7 L5.3 9.5 L9.1 9.2 Z"
                fill="none"
                stroke={accent}
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </>
          )}
        </g>
      </motion.g>
    </svg>
  );
}
