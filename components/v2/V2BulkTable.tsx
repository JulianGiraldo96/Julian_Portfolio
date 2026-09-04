"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DURATION, EASE, SPRING } from "./motion";

/* The centrepiece: the old one-record-at-a-time form beside the table that
   replaced it. The v1 version put a fixed width table inside a horizontal
   scroller, so on a phone you read the herd through a letterbox. Here the
   table drops columns as the screen narrows instead: tag, breed and weight
   survive everywhere, the rest appear when there is room. Nothing scrolls
   inside itself. */

type Animal = {
  tag: string;
  breed: string;
  sex: "M" | "H";
  birth: string;
  weight: string;
  lot: string;
  preset?: boolean;
  flag?: string;
};

const HERD: Animal[] = [
  { tag: "CO-0412", breed: "Brahman", sex: "H", birth: "2022-03-14", weight: "438", lot: "Lote A", preset: true },
  { tag: "CO-0413", breed: "Brahman", sex: "H", birth: "2022-04-02", weight: "451", lot: "Lote A", preset: true },
  { tag: "CO-0418", breed: "Gyr", sex: "M", birth: "2021-11-28", weight: "612", lot: "Lote A" },
  { tag: "CO-0421", breed: "F1 Brahman×Gyr", sex: "H", birth: "2023-01-09", weight: "286", lot: "Lote B", preset: true },
  { tag: "CO-0426", breed: "Cebú", sex: "H", birth: "2022-08-21", weight: "", lot: "Lote B", flag: "weight missing" },
  { tag: "CO-0430", breed: "Brahman", sex: "M", birth: "2021-06-30", weight: "705", lot: "Potrero 3", preset: true },
  { tag: "CO-0435", breed: "Gyr", sex: "H", birth: "2023-02-17", weight: "248", lot: "Potrero 3" },
];

const FORM_FIELDS = [
  { label: "Tag #", value: "CO-0412" },
  { label: "Breed", value: "Brahman" },
  { label: "Sex", value: "Hembra" },
  { label: "Birth date", value: "2022-03-14" },
  { label: "Weight (kg)", value: "438" },
  { label: "Lot", value: "Lote A" },
];

const ACTIONS = ["Paste from sheet", "Breed preset", "Apply lot", "Fill down"];

export function V2BulkTable({ caption }: { caption?: string }) {
  const [view, setView] = useState<"before" | "after">("after");

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Entry method"
          className="inline-flex rounded-full border border-[var(--v2-line-strong)] p-1"
        >
          {(["before", "after"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className="relative min-h-[38px] rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200"
            >
              {view === v && (
                <motion.span
                  layoutId="bulk-tab"
                  transition={SPRING}
                  className="absolute inset-0 rounded-full bg-[var(--v2-invert-bg)]"
                />
              )}
              <span
                className={`relative z-10 ${
                  view === v ? "text-[var(--v2-invert-ink)]" : "text-[var(--v2-secondary)]"
                }`}
              >
                {v === "before" ? "Before, one by one" : "After, bulk table"}
              </span>
            </button>
          ))}
        </div>

        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-label)]">
          {view === "before" ? "≈ 5 min / animal" : "70 animals · 1 table"}
        </span>
      </div>

      {/* The toggle has to feel instant, so the incoming panel starts the frame
          it is asked for rather than waiting out the old one's exit (mode="wait"
          used to cost ~0.6s round trip). `popLayout` pulls the leaving panel out
          of flow; `layout` on the frame then eases its own height between the
          two — the form and the table are very different heights, and without
          this the card would teleport. */}
      <motion.div
        layout
        transition={{ layout: { duration: DURATION.base, ease: EASE } }}
        className="grain relative overflow-hidden rounded-[24px] border border-[var(--v2-line)] bg-[var(--v2-surface)]"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.fast, ease: EASE }}
            className="relative"
          >
            {view === "before" ? <BeforeForm /> : <AfterTable />}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {caption && (
        <p className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-[var(--v2-label)]">
          {caption}
        </p>
      )}
    </div>
  );
}

function BeforeForm() {
  return (
    <div className="relative z-10 p-5 md:p-7">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-label)]">
        Animal 1 of 70
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FORM_FIELDS.map((f, i) => (
          <motion.label
            key={f.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.fast, delay: i * 0.05, ease: EASE }}
            className="block rounded-xl border border-[var(--v2-line)] bg-[var(--v2-bg)] px-4 py-3"
          >
            <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">
              {f.label}
            </span>
            <span className="mt-1 block text-[14px]">{f.value}</span>
          </motion.label>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--v2-line)] pt-5">
        <span className="rounded-full bg-[var(--v2-invert-bg)] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-invert-ink)]">
          Save animal
        </span>
        <span className="text-[13px] text-[var(--v2-secondary)]">
          then open the form again. 69 to go.
        </span>
      </div>
    </div>
  );
}

function AfterTable() {
  return (
    <div className="relative z-10">
      <div className="flex flex-wrap gap-2 border-b border-[var(--v2-line)] px-4 py-4 md:px-6">
        {ACTIONS.map((a, i) => (
          <motion.span
            key={a}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.fast, delay: i * 0.06, ease: EASE }}
            className="rounded-full border border-[var(--v2-line-strong)] bg-[var(--v2-bg)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-secondary)]"
          >
            {a}
          </motion.span>
        ))}
      </div>

      {/* `table-fixed` plus per-column visibility: the table always fits, it
          just says less on a narrow screen */}
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only">
          Bulk entry table, seven of seventy animals shown
        </caption>
        <thead>
          <tr className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">
            <th scope="col" className="w-[30%] px-4 py-3 font-normal md:w-[16%] md:px-6">
              Tag
            </th>
            <th scope="col" className="w-[38%] px-2 py-3 font-normal md:w-[22%]">
              Breed
            </th>
            <th scope="col" className="hidden px-2 py-3 font-normal sm:table-cell sm:w-[10%]">
              Sex
            </th>
            <th scope="col" className="hidden px-2 py-3 font-normal lg:table-cell lg:w-[18%]">
              Birth
            </th>
            <th scope="col" className="w-[32%] px-2 py-3 font-normal md:w-[14%]">
              Weight
            </th>
            <th scope="col" className="hidden px-2 py-3 font-normal md:table-cell md:w-[20%] md:pr-6">
              Lot
            </th>
          </tr>
        </thead>
        <tbody>
          {HERD.map((a, i) => (
            <motion.tr
              key={a.tag}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DURATION.fast, delay: 0.1 + i * 0.045, ease: EASE }}
              className="border-t border-[var(--v2-line)] text-[13px]"
            >
              <th scope="row" className="px-4 py-3 font-mono text-[12px] font-normal md:px-6">
                {a.tag}
              </th>
              <td className="px-2 py-3">
                <span
                  className={
                    a.preset
                      ? "rounded-md bg-[var(--v2-accent-bg)] px-2 py-1 text-[var(--v2-accent)]"
                      : "text-[var(--v2-secondary)]"
                  }
                >
                  {a.breed}
                </span>
              </td>
              <td className="hidden px-2 py-3 text-[var(--v2-secondary)] sm:table-cell">{a.sex}</td>
              <td className="hidden px-2 py-3 font-mono text-[12px] text-[var(--v2-secondary)] lg:table-cell">
                {a.birth}
              </td>
              <td className="px-2 py-3">
                {a.weight ? (
                  <span className="text-[var(--v2-secondary)]">{a.weight} kg</span>
                ) : (
                  <span className="rounded-md bg-[var(--v2-warn-bg)] px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--v2-warn)]">
                    {a.flag}
                  </span>
                )}
              </td>
              <td className="hidden px-2 py-3 text-[var(--v2-secondary)] md:table-cell md:pr-6">
                {a.lot}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--v2-line)] px-4 py-4 md:px-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">
          7 of 70 shown · 1 flagged before ingest
        </span>
        <span className="rounded-full bg-[var(--v2-accent-bg)] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-accent)]">
          Ingest 70 animals
        </span>
      </div>
    </div>
  );
}
