"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { DURATION, EASE } from "./motion";

/* Results as counted dots.

   Two rows per figure. The top row is what it used to be, every dot filled.
   The bottom row is what it is now, and the difference is the dots that no
   longer are. You read the size of the change by comparing two lengths, which
   takes no arithmetic and no waiting: nothing here rotates or has to be timed.

   The percentage is stated above in words, so the dots confirm a number the
   reader already has rather than being the only place it exists. */

export type DotRow = {
  label: string;
  /* the figure, as text, so a range stays a range */
  value: string;
  /* how many dots the whole thing is */
  total: number;
  /* how many were filled before. Defaults to all of them, because most of
     these are reductions, but adoption runs the other way and the row has to
     be able to start empty. */
  before?: number;
  /* how many are filled after */
  now: number;
  note: string;
};

const DOT = "h-[13px] w-[13px] rounded-full";

export function V2DotStat({ rows }: { rows: DotRow[] }) {
  return (
    <ul className="grid list-none grid-cols-1 gap-10 md:gap-12">
      {rows.map((row) => (
        <Row key={row.label} row={row} />
      ))}
    </ul>
  );
}

function Row({ row }: { row: DotRow }) {
  const ref = useRef<HTMLLIElement>(null);
  /* a value, not state, so the dots get their class without a second render */
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const before = row.before ?? row.total;
  const changed = row.now !== before;

  return (
    <motion.li
      ref={ref}
      initial="rest"
      whileInView="run"
      viewport={{ once: true, amount: 0.4 }}
      className={`border-t border-[var(--v2-line)] pt-6 ${
        inView ? "v2-dots-run" : ""
      }`}
    >
      <motion.p
        variants={{ rest: { opacity: 0, y: 8 }, run: { opacity: 1, y: 0 } }}
        transition={{ duration: DURATION.fast, ease: EASE }}
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--v2-label)]"
      >
        {row.label}
      </motion.p>

      <motion.p
        variants={{ rest: { opacity: 0, y: 12 }, run: { opacity: 1, y: 0 } }}
        transition={{ duration: DURATION.base, delay: 0.06, ease: EASE }}
        className="mt-3 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-extralight leading-none tracking-[-0.045em]"
      >
        {row.value}
      </motion.p>

      <div className="mt-7 space-y-3">
        {/* what it was: the whole count, every dot filled */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="w-[54px] shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">
            Before
          </span>
          <div className="flex flex-wrap items-center gap-[7px]">
            {Array.from({ length: row.total }, (_, i) => (
              <span
                key={i}
                aria-hidden
                style={{ animationDelay: `${350 + i * 45}ms` }}
                className={`v2-dot block ${DOT} ${
                  i < before
                    ? "bg-[var(--v2-label)]"
                    : "border border-dashed border-[var(--v2-line-strong)]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* what it is: the same row, fewer filled */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="w-[54px] shrink-0 font-mono text-[11px] uppercase tracking-[0.14em]">
            Now
          </span>
          <div className="flex flex-wrap items-center gap-[7px]">
            {Array.from({ length: row.total }, (_, i) => {
              const left = i < row.now;
              return (
                <span
                  key={i}
                  aria-hidden
                  style={{
                    animationDelay: `${350 + row.total * 45 + i * 45}ms`,
                  }}
                  className={`v2-dot block ${DOT} ${
                    left
                      ? "bg-[var(--v2-ink)]"
                      : "border border-dashed border-[var(--v2-line-strong)]"
                  }`}
                />
              );
            })}
            {changed && (
              <motion.span
                variants={{ rest: { opacity: 0 }, run: { opacity: 1 } }}
                transition={{
                  duration: DURATION.base,
                  delay: 0.35 + row.total * 0.09 + 0.3,
                }}
                className="ml-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]"
              >
                {row.now} of {row.total}
              </motion.span>
            )}
          </div>
        </div>
      </div>

      <motion.p
        variants={{ rest: { opacity: 0 }, run: { opacity: 1 } }}
        transition={{ duration: DURATION.base, delay: 0.35 }}
        className="mt-6 max-w-[58ch] text-[14px] leading-relaxed text-[var(--v2-secondary)]"
      >
        {row.note}
      </motion.p>
    </motion.li>
  );
}
