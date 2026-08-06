"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { EASE } from "./motion";

/* The contact buttons.

   One idea only: a disc grows from wherever the pointer crossed the edge and
   floods the button, and the label crosses over with it. No colour is
   introduced, the fill and the text simply trade places, so the whole thing is
   a change of contrast rather than a change of subject.

   Nothing follows the cursor and the label never moves: a button that leans
   away from the pointer is harder to hit, and a label that rolls to reveal the
   same words is motion that says nothing.

   Under prefers-reduced-motion the flood is skipped and the button is a plain
   swap on hover. */

export function V2Button({
  href,
  children,
  shortLabel,
  tone = "solid",
}: {
  href: string;
  children: React.ReactNode;
  shortLabel?: string;
  tone?: "solid" | "outline";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const prefersReduced = useReducedMotion();
  const [hover, setHover] = useState(false);
  /* where the pointer crossed the edge, so the disc grows from there */
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const enter = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (r && e.pointerType === "mouse") {
      setOrigin({
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      });
    }
    setHover(true);
  };

  const external = href.startsWith("http") || href.endsWith(".pdf");
  const solid = tone === "solid";
  const on = hover;

  /* solid starts light-on-dark and floods to dark-on-light; outline starts
     dark-on-light and floods the other way. Both stay black and white. */
  const fill = solid ? "var(--v2-bg)" : "var(--v2-invert-bg)";
  const restInk = solid ? "var(--v2-invert-ink)" : "var(--v2-ink)";
  const hoverInk = solid ? "var(--v2-ink)" : "var(--v2-invert-ink)";

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onPointerEnter={enter}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      animate={{
        color: on ? hoverInk : restInk,
        borderColor:
          solid && !on ? "rgba(0, 0, 0, 0)" : "var(--v2-line-strong)",
      }}
      transition={{ duration: 0.3, ease: EASE }}
      whileTap={prefersReduced ? undefined : { scale: 0.97 }}
      className={`relative isolate inline-flex min-h-[46px] items-center gap-1.5 overflow-hidden rounded-full px-5 font-mono text-[11px] uppercase tracking-[0.16em] ${
        solid ? "border border-[rgba(0,0,0,0)] bg-[var(--v2-invert-bg)]" : "border"
      }`}
    >
      {/* the flood. 260% wide keeps the disc bigger than the button's diagonal
          from any origin, so it always covers */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scale: on ? 1 : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{
          left: `${origin.x}%`,
          top: `${origin.y}%`,
          backgroundColor: fill,
        }}
        className="pointer-events-none absolute -z-10 aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full"
      />

      {shortLabel ? (
        <>
          <span className="sm:hidden">{shortLabel}</span>
          <span className="hidden sm:inline">{children}</span>
        </>
      ) : (
        children
      )}

      {external && (
        <>
          <span aria-hidden className="text-[0.9em] opacity-70">
            ↗
          </span>
          <span className="sr-only">(opens in new tab)</span>
        </>
      )}
    </motion.a>
  );
}
