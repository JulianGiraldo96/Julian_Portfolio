"use client";

import { motion } from "motion/react";
import { DURATION, EASE } from "./motion";
import type { FlowCard } from "./V2Flow";

/* The insight cards and caption that used to live inside V2Flow, pulled out
   so an archify-embedded flow (V2ArchifyFlow) keeps the same site-styled
   cards under it instead of archify's own (which `?embed=1` hides anyway). */
export function V2FlowCards({ cards, caption }: { cards?: FlowCard[]; caption?: string }) {
  return (
    <>
      {cards && cards.length > 0 && (
        <motion.ul
          initial="rest"
          whileInView="run"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-7 grid list-none grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {cards.map((c, i) => (
            <motion.li
              key={c.title}
              variants={{ rest: { opacity: 0, y: 16 }, run: { opacity: 1, y: 0 } }}
              transition={{ duration: DURATION.base, delay: 0.1 + i * 0.1, ease: EASE }}
              className="grain relative overflow-hidden rounded-[20px] border border-[var(--v2-line)] bg-[var(--v2-bg)] px-5 py-6"
            >
              <h3 className="relative z-10 font-mono text-[11px] uppercase tracking-[0.16em]">
                {c.title}
              </h3>
              <ul className="relative z-10 mt-3 list-none space-y-1.5">
                {c.items.map((item) => (
                  <li key={item} className="text-[13px] leading-relaxed text-[var(--v2-secondary)]">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </motion.ul>
      )}

      {caption && (
        <p className="mt-7 border-t border-[var(--v2-line)] pt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-[var(--v2-label)]">
          {caption}
        </p>
      )}
    </>
  );
}
