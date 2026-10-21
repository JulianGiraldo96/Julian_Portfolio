"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useSyncExternalStore } from "react";
import { DesignWork, designCount } from "./DesignWork";
import { ProjectFolder } from "./ProjectFolder";
import { DURATION, EASE, SPRING } from "./motion";
import { academic, professional } from "./projects";

/* Both kinds of work live in one block behind one switch, so neither is ever
   more than a click away and neither has to sit below the other.

   The URL hash is the state, not a useState: "#design" opens the Design view,
   anything else the product one. That makes the top bar's "Design" link, a
   shared link and the back button all work with no extra wiring, and it keeps
   the view out of an effect (Next 16's lint bans setState in one). A click
   writes the hash with replaceState, which does not fire hashchange, so Lenis
   does not scroll; it announces the change with its own event instead. */

type View = "product" | "design";

export const VIEW_EVENT = "v2workview";

function subscribe(cb: () => void) {
  window.addEventListener("hashchange", cb);
  window.addEventListener(VIEW_EVENT, cb);
  return () => {
    window.removeEventListener("hashchange", cb);
    window.removeEventListener(VIEW_EVENT, cb);
  };
}

/* Only "#design" and "#work" choose a view. Any other hash (the top bar's
   "#contact", a skip link) leaves the view as it was: flipping back to
   product design on the way to the footer changed the page's height while
   it was scrolling there, and the scroll landed short. */
let lastView: View = "product";
const getView = (): View => {
  const h = window.location.hash;
  if (h === "#design") lastView = "design";
  else if (h === "#work") lastView = "product";
  return lastView;
};

const views: { id: View; label: string; count: number }[] = [
  {
    id: "product",
    label: "Product design",
    count: professional.length + academic.length,
  },
  { id: "design", label: "Design", count: designCount },
];

export function WorkSwitch() {
  const view = useSyncExternalStore(
    subscribe,
    getView,
    () => "product" as View,
  );
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);

  const select = useCallback((next: View) => {
    if (next === getView()) return;
    /* Hold the panel's height while one view leaves and the next arrives. In
       between the panel is empty, the page is suddenly much shorter, and both
       the browser and Lenis clamp the scroll to the new bottom, which throws
       the reader up the page. Released once the new view is in. */
    const stage = stageRef.current;
    if (stage) stage.style.minHeight = `${stage.offsetHeight}px`;
    history.replaceState(null, "", next === "design" ? "#design" : "#work");
    window.dispatchEvent(new Event(VIEW_EVENT));
    /* switching from deep inside a long panel would otherwise leave the reader
       somewhere in the middle of the new one */
    const el = sectionRef.current;
    if (el && el.getBoundingClientRect().top < 0) {
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72 });
      else el.scrollIntoView();
    }
  }, []);

  /* the old view has gone; wait two frames so the new one has mounted and
     taken its own height before letting go */
  const release = useCallback(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const stage = stageRef.current;
        if (stage) stage.style.minHeight = "";
      }),
    );
  }, []);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const j =
      (i + (e.key === "ArrowRight" ? 1 : -1) + views.length) % views.length;
    tabRefs.current[j]?.focus();
    select(views[j].id);
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="work-heading"
      className="relative scroll-mt-24 border-t border-[var(--v2-line)] pb-6 pt-10 md:pt-14"
    >
      {/* the "#design" anchor: the top bar's link lands here, on the switch */}
      <span
        id="design"
        aria-hidden
        className="absolute left-0 top-0 scroll-mt-24"
      />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 md:mb-12">
        <h2
          id="work-heading"
          className="font-mono text-[12px] uppercase tracking-[0.2em]"
        >
          Work
        </h2>

        <div
          role="tablist"
          aria-label="Kind of work"
          className="grain relative flex rounded-full border border-[var(--v2-line)] bg-[var(--v2-surface)] p-1"
        >
          {views.map((v, i) => {
            const on = v.id === view;
            return (
              <motion.button
                key={v.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`work-tab-${v.id}`}
                aria-selected={on}
                aria-controls="work-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => select(v.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: DURATION.press }}
                className="relative isolate flex min-h-[40px] items-center rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.16em] md:px-5"
              >
                {/* one pill, handed between the two tabs, so the choice reads
                    as moving rather than as two buttons repainting */}
                {on && (
                  <motion.span
                    aria-hidden
                    layoutId="work-switch-pill"
                    transition={SPRING}
                    className="absolute inset-0 -z-10 rounded-full bg-[var(--v2-invert-bg)]"
                  />
                )}
                <span
                  className={`transition-colors duration-200 ${
                    on
                      ? "text-[var(--v2-invert-ink)]"
                      : "text-[var(--v2-secondary)] hover:text-[var(--v2-ink)]"
                  }`}
                >
                  {v.label}
                  <span className="ml-2 opacity-60">
                    {String(v.count).padStart(2, "0")}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* The outgoing view leaves quickly and the incoming one only fades: its
          cards and tiles bring their own staggered entrance, so a second
          slide on the panel would stack two movements on top of each other. */}
      <div ref={stageRef}>
        {/* no initial={false} here: AnimatePresence hands it down to every
            motion component inside the panel for as long as it lives, and the
            card demos' looping keyframes then snap to their last frame and
            never run */}
        <AnimatePresence mode="wait" onExitComplete={release}>
          <motion.div
            key={view}
            id="work-panel"
            role="tabpanel"
            aria-labelledby={`work-tab-${view}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: DURATION.fast, ease: EASE },
            }}
            exit={{
              opacity: 0,
              y: -8,
              transition: { duration: DURATION.hover, ease: EASE },
            }}
          >
            {view === "product" ? <ProductWork /> : <DesignWork />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* Shipped first, university second, both as the same expanding row of cards:
   the academic work gets the same frame and the same live demos, and the
   label above each row is what tells them apart. */
function ProductWork() {
  return (
    <div className="flex flex-col gap-14 md:gap-20">
      <ProjectRow
        label="Shipped"
        aside="In production"
        list={professional}
        offset={0}
      />
      <ProjectRow
        label="Academic"
        aside="University"
        list={academic}
        offset={professional.length}
      />
    </div>
  );
}

function ProjectRow({
  label,
  aside,
  list,
  offset,
}: {
  label: string;
  aside: string;
  list: typeof professional;
  offset: number;
}) {
  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--v2-label)]">
        <span className="flex items-center gap-2.5">
          {/* the hero ledger's dot: filled for what runs, hollow for what
              was studied */}
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full ${
              offset === 0
                ? "bg-[var(--v2-accent)]"
                : "border border-current opacity-70"
            }`}
          />
          <span className="text-[var(--v2-ink)]">{label}</span>
        </span>
        <span>{aside}</span>
      </div>
      <ul className="flex list-none flex-col gap-6 md:flex-row md:items-stretch md:gap-4">
        {list.map((p, i) => (
          <ProjectFolder
            key={p.slug}
            project={p}
            index={offset + i}
            wide={false}
            row
            tall={list.length === 2}
          />
        ))}
      </ul>
    </div>
  );
}
