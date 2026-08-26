"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { DURATION, EASE } from "./motion";

/* The contact buttons.

   One idea only: a disc grows from wherever the pointer crossed the edge and
   floods the button, and the label crosses over with it. No colour is
   introduced, the fill and the text simply trade places, so the whole thing is
   a change of contrast rather than a change of subject.

   Nothing follows the cursor and the label never moves: a button that leans
   away from the pointer is harder to hit, and a label that rolls to reveal the
   same words is motion that says nothing.

   Under prefers-reduced-motion the flood is skipped and the button is a plain
   swap on hover.

   With `href` it is a link, with `onClick` it is a real <button>. Same shape
   either way, so the copy action sits in the row without looking bolted on. */

export function V2Button({
  href,
  onClick,
  children,
  shortLabel,
  trailing,
  ariaLabel,
  tone = "solid",
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  shortLabel?: string;
  trailing?: React.ReactNode;
  ariaLabel?: string;
  tone?: "solid" | "outline";
}) {
  const prefersReduced = useReducedMotion();
  const [hover, setHover] = useState(false);
  /* where the pointer crossed the edge, so the disc grows from there */
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const enter = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (e.pointerType === "mouse") {
      setOrigin({
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      });
    }
    setHover(true);
  };

  const external = !!href && (href.startsWith("http") || href.endsWith(".pdf"));
  const solid = tone === "solid";
  const on = hover;

  /* solid starts light-on-dark and floods to dark-on-light; outline starts
     dark-on-light and floods the other way. Both stay black and white. */
  const fill = solid ? "var(--v2-bg)" : "var(--v2-invert-bg)";
  const restInk = solid ? "var(--v2-invert-ink)" : "var(--v2-ink)";
  const hoverInk = solid ? "var(--v2-ink)" : "var(--v2-invert-ink)";

  const shared = {
    "aria-label": ariaLabel,
    onPointerEnter: enter,
    onPointerLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
    animate: {
      color: on ? hoverInk : restInk,
      borderColor: solid && !on ? "rgba(0, 0, 0, 0)" : "var(--v2-line-strong)",
    },
    transition: { duration: DURATION.hover, ease: EASE },
    whileTap: prefersReduced ? undefined : { scale: 0.97 },
    className: `relative isolate inline-flex min-h-[46px] items-center gap-1.5 overflow-hidden rounded-full px-5 font-mono text-[11px] uppercase tracking-[0.16em] ${
      solid ? "border border-[rgba(0,0,0,0)] bg-[var(--v2-invert-bg)]" : "border"
    }`,
  };

  const inner = (
    <>
      {/* the flood. 260% wide keeps the disc bigger than the button's diagonal
          from any origin, so it always covers */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scale: on ? 1 : 0 }}
        transition={{ duration: on ? DURATION.flood : DURATION.hover, ease: EASE }}
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

      {trailing}

      {external && !trailing && (
        <>
          <span aria-hidden className="text-[0.9em] opacity-70">
            ↗
          </span>
          <span className="sr-only">(opens in new tab)</span>
        </>
      )}
    </>
  );

  if (!href) {
    return (
      <motion.button type="button" onClick={onClick} {...shared}>
        {inner}
      </motion.button>
    );
  }

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...shared}
    >
      {inner}
    </motion.a>
  );
}
