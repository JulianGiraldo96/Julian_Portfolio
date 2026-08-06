"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EASE } from "./motion";

/* An automation canvas, not a picture of one.

   The first version stacked nodes in columns and left the reader to infer what
   connected to what, which read as a tidy list rather than a flow. This one
   draws the wires: every node is a pad with an in port on one edge and an out
   port on the other, and every edge is a real curve between two measured
   ports.

   The curves cannot be authored, because the nodes are laid out by CSS grid and
   move with the column width. So they are measured: after layout, each pad's
   port is read off the DOM, the bezier is built in the container's own pixel
   space, and a ResizeObserver rebuilds them whenever anything moves. That is
   what keeps it responsive and what keeps it off a fixed viewBox, which is what
   used to force the whole diagram into a horizontal scroller.

   On a phone the grid collapses to one column and the ports move to the top and
   bottom edges, so the same graph reads downward. */

export type FlowKind = "start" | "step" | "decision" | "auto" | "alert" | "end";

export type FlowNode = {
  id: string;
  /* 1-based position on the canvas */
  col: number;
  row: number;
  title: string;
  sub?: string;
  note?: string;
  kind?: FlowKind;
};

export type FlowEdge = {
  from: string;
  to: string;
  label?: string;
  /* a loop back, or anything that is not the happy path */
  dashed?: boolean;
};

export type FlowSpec = {
  phases: string[];
  nodes: FlowNode[];
  edges: FlowEdge[];
};

const padStyle: Record<FlowKind, string> = {
  start: "bg-[var(--v2-invert-bg)] text-[var(--v2-invert-ink)] border-transparent",
  step: "bg-[var(--v2-bg)] border-[var(--v2-line-strong)]",
  decision: "bg-[var(--v2-bg)] border-dashed border-[var(--v2-line-strong)]",
  auto: "bg-[var(--v2-cool-bg)] border-[var(--v2-cool)] text-[var(--v2-cool)]",
  alert: "bg-[var(--v2-warn-bg)] border-[var(--v2-warn)] text-[var(--v2-warn)]",
  end: "bg-[var(--v2-accent-bg)] border-[var(--v2-accent)] text-[var(--v2-accent)]",
};

type Wire = {
  key: string;
  d: string;
  dashed: boolean;
  label?: string;
  mx: number;
  my: number;
  order: number;
};

/* Which edge of a pad a wire leaves from and arrives at. Decided from the
   authored grid positions, not from measurement, so it never depends on layout
   having settled: a branch fans out sideways (`right`), a chain continues down
   the column (`down` / `up`), and anything returning to an earlier phase bows
   back (`back`). Keeping every branch on `right` and every chain on `down` is
   what stops two wires from leaving the same edge on top of each other. */
type Mode = "right" | "back" | "down" | "up";

type Planned = { from: string; to: string; label?: string; dashed: boolean; mode: Mode };

function planEdges(nodes: FlowNode[], edges: FlowEdge[]): Planned[] {
  const at = new Map(nodes.map((n) => [n.id, n]));
  return edges.flatMap((e) => {
    const a = at.get(e.from);
    const b = at.get(e.to);
    if (!a || !b) return [];
    const mode: Mode =
      b.col > a.col ? "right" : b.col < a.col ? "back" : b.row > a.row ? "down" : "up";
    return [{ from: e.from, to: e.to, label: e.label, dashed: !!e.dashed, mode }];
  });
}

export function V2Flow({ spec, caption }: { spec: FlowSpec; caption?: string }) {
  const { phases, nodes, edges } = spec;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [wires, setWires] = useState<Wire[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const plan = useMemo(() => planEdges(nodes, edges), [nodes, edges]);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    if (!wr.width) return;
    /* one column means every wire runs downward, whatever the grid said */
    const stacked = !window.matchMedia("(min-width: 768px)").matches;

    const rect = (id: string) => {
      const el = wrap.querySelector<HTMLElement>(`[data-pad="${id}"]`);
      return el ? el.getBoundingClientRect() : null;
    };

    const next: Wire[] = [];
    plan.forEach((e, i) => {
      const a = rect(e.from);
      const b = rect(e.to);
      if (!a || !b) return;
      /* Stacked, everything runs down the single column, except a loop back:
         forcing that into a downward wire points it at the wrong pad. It gets
         its own lane, arcing out past the left edge and back up, which is how
         a loop reads on a phone. */
      const loopBack = stacked && e.mode === "back";
      const mode: Mode = stacked ? "down" : e.mode;

      if (loopBack) {
        const x1 = a.left - wr.left;
        const y1 = a.top + a.height / 2 - wr.top;
        const x2 = b.left - wr.left;
        const y2 = b.top + b.height / 2 - wr.top;
        const bulge = 30;
        next.push({
          key: `${e.from}-${e.to}`,
          d: `M ${x1} ${y1} C ${x1 - bulge} ${y1} ${x2 - bulge} ${y2} ${x2} ${y2}`,
          dashed: e.dashed,
          /* no label on the loop here: the lane is narrower than the chip, and
             a red arc running back up the column already says it */
          label: undefined,
          mx: (x1 + 3 * (x1 - bulge) + 3 * (x2 - bulge) + x2) / 8,
          my: (y1 + 3 * y1 + 3 * y2 + y2) / 8,
          order: i,
        });
        return;
      }


      let x1: number, y1: number, x2: number, y2: number;
      let c1x: number, c1y: number, c2x: number, c2y: number;

      if (mode === "down" || mode === "up") {
        const down = mode === "down";
        x1 = a.left + a.width / 2 - wr.left;
        y1 = (down ? a.bottom : a.top) - wr.top;
        x2 = b.left + b.width / 2 - wr.left;
        y2 = (down ? b.top : b.bottom) - wr.top;
        const dy = Math.max(16, Math.abs(y2 - y1) * 0.45);
        c1x = x1;
        c1y = down ? y1 + dy : y1 - dy;
        c2x = x2;
        c2y = down ? y2 - dy : y2 + dy;
      } else {
        const back = mode === "back";
        x1 = (back ? a.left : a.right) - wr.left;
        y1 = a.top + a.height / 2 - wr.top;
        x2 = (back ? b.right : b.left) - wr.left;
        y2 = b.top + b.height / 2 - wr.top;
        const dx = Math.max(34, Math.abs(x2 - x1) * 0.45);
        /* A returning wire bows well below the row it undoes. The bow is not
           decoration: the gutter between two columns is narrower than a label,
           so a loop routed straight through it puts its own label on top of the
           pads at either end. Dropping it clears both. */
        const dip = back ? Math.max(104, Math.abs(x1 - x2) * 0.2) : 0;
        c1x = back ? x1 - dx : x1 + dx;
        c1y = y1 + dip;
        c2x = back ? x2 + dx : x2 - dx;
        c2y = y2 + dip;
      }

      next.push({
        key: `${e.from}-${e.to}`,
        d: `M ${x1} ${y1} C ${c1x} ${c1y} ${c2x} ${c2y} ${x2} ${y2}`,
        dashed: e.dashed,
        label: e.label,
        /* the point halfway along a cubic, where a label sits on the wire */
        mx: (x1 + 3 * c1x + 3 * c2x + x2) / 8,
        my: (y1 + 3 * c1y + 3 * c2y + y2) / 8,
        order: i,
      });
    });

    setWires(next);
    setSize({ w: wr.width, h: wr.height });
  }, [plan]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    /* deferred: measuring writes state, and doing that synchronously in an
       effect is both a cascading render and a read of a layout that has not
       settled yet */
    let frame = requestAnimationFrame(measure);
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    ro.observe(wrap);
    /* the pads are set in a webfont, so their boxes change once it lands */
    document.fonts?.ready.then(() => {
      frame = requestAnimationFrame(measure);
    });
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [measure]);

  const cols = { "--flow-cols": String(phases.length) } as React.CSSProperties;
  const ordered = [...nodes].sort((a, b) => a.col - b.col || a.row - b.row);
  /* a pad shows only the sockets it actually uses */
  const ports = new Map<string, Set<string>>();
  const mark = (id: string, side: string) => {
    const set = ports.get(id) ?? new Set<string>();
    set.add(side);
    ports.set(id, set);
  };
  for (const e of plan) {
    if (e.mode === "right") {
      mark(e.from, "out");
      mark(e.to, "in");
    } else if (e.mode === "back") {
      mark(e.from, "in");
      mark(e.to, "out");
      /* stacked, the same loop leaves and arrives on the left edge */
      mark(e.from, "loop");
      mark(e.to, "loop");
    } else if (e.mode === "down") {
      mark(e.from, "bottom");
      mark(e.to, "top");
    } else {
      mark(e.from, "top");
      mark(e.to, "bottom");
    }
  }

  return (
    <motion.div initial="rest" whileInView="run" viewport={{ once: true, amount: 0.15 }}>
      {/* phase headers, aligned to the columns they name */}
      <div className="v2-flow-phases mb-5" style={cols}>
        {phases.map((label, i) => (
          <motion.div
            key={label}
            variants={{ rest: { opacity: 0, y: 8 }, run: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.45, delay: i * 0.09, ease: EASE }}
          >
            <span className="mb-2 block h-px w-full origin-left bg-[var(--v2-line-strong)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-label)]">
              {label}
            </span>
          </motion.div>
        ))}
      </div>

      <div ref={wrapRef} className="relative">
        {/* the wires, under the pads and deaf to the pointer */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
          preserveAspectRatio="none"
        >
          <defs>
            <marker
              id="v2-flow-arrow"
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0,1.5 L9,5 L0,8.5 z" fill="var(--v2-line-strong)" />
            </marker>
            <marker
              id="v2-flow-arrow-warn"
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0,1.5 L9,5 L0,8.5 z" fill="var(--v2-warn)" />
            </marker>
          </defs>
          {wires.map((w) => (
            <motion.path
              key={w.key}
              d={w.d}
              fill="none"
              /* the loop back is the thing that broke the old flow, so it is
                 drawn in the warning colour rather than as another grey wire */
              stroke={w.dashed ? "var(--v2-warn)" : "var(--v2-line-strong)"}
              strokeWidth={w.dashed ? 2 : 1.5}
              strokeLinecap="round"
              markerEnd={w.dashed ? "url(#v2-flow-arrow-warn)" : "url(#v2-flow-arrow)"}
              strokeDasharray={w.dashed ? "7 6" : undefined}
              variants={{
                rest: { pathLength: 0, opacity: 0 },
                run: { pathLength: 1, opacity: 1 },
              }}
              transition={{ duration: 0.7, delay: 0.25 + w.order * 0.06, ease: EASE }}
            />
          ))}
        </svg>

        {/* the labels that ride on the wires */}
        {wires
          .filter((w) => w.label)
          .map((w) => (
            <motion.span
              key={`${w.key}-label`}
              variants={{ rest: { opacity: 0, scale: 0.9 }, run: { opacity: 1, scale: 1 } }}
              transition={{ duration: 0.35, delay: 0.55 + w.order * 0.06, ease: EASE }}
              style={{ left: w.mx, top: w.my }}
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-[var(--v2-line)] bg-[var(--v2-bg)] px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--v2-label)]"
            >
              {w.label}
            </motion.span>
          ))}

        <div
          className="v2-flow-canvas relative"
          data-loop={plan.some((e) => e.mode === "back")}
          style={cols}
        >
          {ordered.map((node, i) => (
            <motion.div
              key={node.id}
              data-pad={node.id}
              style={{ gridColumn: node.col, gridRow: node.row }}
              variants={{
                rest: { opacity: 0, y: 12, scale: 0.97 },
                run: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.05, ease: EASE }}
              className={`v2-pad relative rounded-2xl border px-4 py-3.5 ${
                padStyle[node.kind ?? "step"]
              }`}
            >
              {[...(ports.get(node.id) ?? [])].map((side) => (
                <span key={side} aria-hidden className={`v2-port v2-port--${side}`} />
              ))}

              <p className="text-[14px] font-medium leading-snug">
                {node.kind === "decision" ? `${node.title}?` : node.title}
              </p>
              {node.sub && (
                <p
                  className={`mt-1 text-[13px] leading-snug ${
                    node.kind && node.kind !== "step" && node.kind !== "decision"
                      ? "opacity-75"
                      : "text-[var(--v2-secondary)]"
                  }`}
                >
                  {node.sub}
                </p>
              )}
              {node.note && (
                <p className="mt-2 text-[12px] italic leading-snug text-[var(--v2-label)]">
                  {node.note}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {caption && (
        <p className="mt-7 border-t border-[var(--v2-line)] pt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-[var(--v2-label)]">
          {caption}
        </p>
      )}
    </motion.div>
  );
}
