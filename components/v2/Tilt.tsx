"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { createContext, useContext } from "react";
import { SPRING } from "./motion";

/* The focused tile of a TV shelf, for any card: under a mouse it tips toward
   the pointer, lifts a little, a soft highlight slides across its glass and a
   shadow gathers underneath. Anything inside can sit "behind the glass" by
   reading useTiltParallax(), which drifts the other way from the tilt; that
   counter-movement is what makes the card's face read as a separate layer
   from its art.

   All of it is transform and opacity on motion values, so following the
   pointer never re-renders React and never lays out. The shadow and the
   highlight are gradients, not filters. Touch and reduced motion get a still
   card. */

const zero = { x: null, y: null } as {
  x: MotionValue<number> | null;
  y: MotionValue<number> | null;
};
const ParallaxContext = createContext(zero);

/* The art's drift, in px, for a motion style: style={{ x, y }}. Static (no
   drift) outside a Tilt. */
export function useTiltParallax() {
  return useContext(ParallaxContext);
}

export function Tilt({
  children,
  radius = 24,
  strength = 1,
  drift = 10,
  className = "",
}: {
  children: React.ReactNode;
  /* the card's corner radius, so the highlight is clipped to the card */
  radius?: number;
  /* 1 is a card; a big tile wants less, a small one can take more */
  strength?: number;
  /* how far the art drifts against the tilt, in px */
  drift?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const on = useMotionValue(0);

  const rx = useSpring(useTransform(py, [-0.5, 0.5], [5 * strength, -5 * strength]), SPRING);
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-7 * strength, 7 * strength]), SPRING);
  const lift = useSpring(useTransform(on, [0, 1], [1, 1 + 0.03 * strength]), SPRING);
  const artX = useSpring(useTransform(px, [-0.5, 0.5], [drift, -drift]), SPRING);
  const artY = useSpring(useTransform(py, [-0.5, 0.5], [drift * 0.8, -drift * 0.8]), SPRING);
  const glow = useSpring(on, SPRING);
  const glowX = useTransform(px, [-0.5, 0.5], ["-30%", "30%"]);
  const glowY = useTransform(py, [-0.5, 0.5], ["-30%", "30%"]);
  const glowMove = useMotionTemplate`translate(${glowX}, ${glowY})`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
    on.set(1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
    on.set(0);
  };

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`[perspective:1200px] ${className}`}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry, scale: lift }} className="relative h-full">
        {/* the shadow is its own layer under the card and only fades, so the
            lift never repaints a box-shadow */}
        <motion.span
          aria-hidden
          style={{ opacity: glow }}
          className="pointer-events-none absolute -inset-x-4 -bottom-10 top-8 -z-10 bg-[radial-gradient(closest-side,rgba(0,0,0,0.75),transparent)]"
        />
        <ParallaxContext.Provider value={{ x: artX, y: artY }}>
          {children}
        </ParallaxContext.Provider>
        {/* the highlight crossing the glass */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
          style={{ borderRadius: radius }}
        >
          <motion.span
            style={{ opacity: glow, transform: glowMove }}
            className="absolute -inset-1/2 bg-[radial-gradient(closest-side,rgba(255,255,255,0.14),transparent)]"
          />
        </span>
      </motion.div>
    </div>
  );
}

/* Art that sits behind a Tilt's glass: drifts against the tilt. */
export function Drift({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { x, y } = useTiltParallax();
  return (
    <motion.div style={x && y ? { x, y } : undefined} className={className}>
      {children}
    </motion.div>
  );
}
