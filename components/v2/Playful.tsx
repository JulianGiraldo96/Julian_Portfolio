"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useState } from "react";
import { ENERGY, POP } from "./motion";

/* Two small toys that give the page some play without changing its voice.

   CursorChip: over an area that does something, a pill with the verb
   ("View", "Open") pops out of the pointer and trails it on a spring, so the
   hand is told what a click will do before it clicks. Mouse only; touch has
   no hover to announce anything with.

   SplitTitle: a heading whose letters rise out of their own line one after
   another, each tipping upright as it lands. */

export function CursorChip({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 500, damping: 40, mass: 0.6 });
  const y = useSpring(my, { stiffness: 500, damping: 40, mass: 0.6 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    /* first contact: jump there, so the chip pops at the pointer instead of
       flying in from the corner it was last left in */
    if (!shown) {
      x.jump(e.clientX - r.left);
      y.jump(e.clientY - r.top);
      setShown(true);
    }
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={() => setShown(false)}
      className={`relative ${className}`}
    >
      {children}
      <motion.span
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none absolute left-0 top-0 z-40"
      >
        <AnimatePresence>
          {shown && (
            <motion.span
              key={label}
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0, transition: POP }}
              exit={{ scale: 0, transition: { duration: 0.18 } }}
              className="absolute left-3 top-3 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--v2-accent)] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-black"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </div>
  );
}

export function SplitTitle({
  text,
  className = "",
  as: Tag = "h3",
}: {
  text: string;
  className?: string;
  as?: "h2" | "h3";
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  let n = 0;
  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden
        initial={reduced ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0.8 }}
        className="inline"
      >
        {words.map((w, wi) => (
          <span
            key={wi}
            className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            {w.split("").map((ch) => {
              const i = n++;
              return (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { y: "110%", rotate: 12 },
                    shown: { y: "0%", rotate: 0 },
                  }}
                  transition={{ duration: 0.8, delay: i * 0.028, ease: ENERGY }}
                  className="inline-block origin-bottom-left"
                >
                  {ch}
                </motion.span>
              );
            })}
            {wi < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
