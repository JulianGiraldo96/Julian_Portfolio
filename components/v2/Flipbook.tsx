"use client";

import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/* A printed piece you can leaf through, drawn natively: each sheet is a 3D
   card hinged on the spine, front page on one face and the next page on its
   back, so a turn shows the paper moving rather than a slide swap. Closed it
   sits centred on its cover, open it shows the spread, and on the back page
   it slides over to the left. Click a side, swipe, or use the buttons.

   Pages come in pairs (front, back), so a four-page leaflet is two sheets.

   Which face shows is decided from the angle, not left to
   backface-visibility alone: Safari drew the back of the sheet over the
   cover, so the face turned away is hidden outright. The pages load eagerly,
   since a lazy image inside a 3D transform could stay blank in Safari. */

type Page = { src: string; alt: string };

const TURN = { duration: 0.9, ease: [0.645, 0.045, 0.355, 1] } as const;

function Sheet({ front, back, flipped, z, sizes, w, h, still }: { front: Page; back: Page; flipped: boolean; z: number; sizes: string; w: number; h: number; still: boolean }) {
  const rot = useMotionValue(flipped ? -180 : 0);
  /* light falls off as the sheet stands up, then comes back as it lands */
  const shadeFront = useTransform(rot, [0, -90], [0, 0.35]);
  const shadeBack = useTransform(rot, [-90, -180], [0.35, 0]);
  const showFront = useTransform(rot, (r) => (r > -90 ? "visible" : "hidden"));
  const showBack = useTransform(rot, (r) => (r > -90 ? "hidden" : "visible"));

  useEffect(() => {
    const c = animate(rot, flipped ? -180 : 0, still ? { duration: 0 } : TURN);
    return () => c.stop();
  }, [flipped, rot, still]);

  return (
    <motion.div
      className="absolute right-0 top-0 h-full w-1/2"
      style={{ rotateY: rot, transformOrigin: "left center", transformStyle: "preserve-3d", zIndex: z }}
    >
      <motion.div className="absolute inset-0 overflow-hidden bg-white [-webkit-backface-visibility:hidden] [backface-visibility:hidden]" style={{ visibility: showFront }}>
        <Image src={front.src} alt={front.alt} width={w} height={h} sizes={sizes} loading="eager" className="block h-full w-full object-cover" />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[8%] bg-gradient-to-r from-black/20 to-transparent" />
        <motion.span aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: shadeFront }} />
      </motion.div>
      <motion.div className="absolute inset-0 overflow-hidden bg-white [-webkit-backface-visibility:hidden] [backface-visibility:hidden] [transform:rotateY(180deg)]" style={{ visibility: showBack }}>
        <Image src={back.src} alt={back.alt} width={w} height={h} sizes={sizes} loading="eager" className="block h-full w-full object-cover" />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-[8%] bg-gradient-to-l from-black/20 to-transparent" />
        <motion.span aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: shadeBack }} />
      </motion.div>
    </motion.div>
  );
}

export function Flipbook({ pages, label, w = 1400, h = 1980, sizes = "(min-width: 768px) 40vw, 50vw", className = "" }: { pages: Page[]; label: string; w?: number; h?: number; sizes?: string; className?: string }) {
  const sheets = pages.length / 2;
  const [turned, setTurned] = useState(0);
  const [active, setActive] = useState(-1);
  const still = useReducedMotion() ?? false;
  const book = useRef<HTMLDivElement>(null);
  const down = useRef<number | null>(null);

  const go = (d: 1 | -1) => {
    const next = Math.min(sheets, Math.max(0, turned + d));
    if (next === turned) return;
    setActive(d === 1 ? turned : next);
    setTurned(next);
  };

  /* closed it centres the cover, at the end it centres the back page */
  const shift = turned === 0 ? "-25%" : turned === sheets ? "25%" : "0%";
  const showing =
    turned === 0 ? "1" : turned === sheets ? `${pages.length}` : `${turned * 2}-${turned * 2 + 1}`;

  return (
    <figure className={className} aria-label={label}>
      <div
        ref={book}
        className="relative w-full cursor-pointer touch-pan-y select-none [perspective:2400px]"
        style={{ aspectRatio: `${(w * 2) / h}` }}
        onPointerDown={(e) => (down.current = e.clientX)}
        onPointerUp={(e) => {
          const from = down.current;
          down.current = null;
          if (from === null) return;
          const dx = e.clientX - from;
          if (Math.abs(dx) > 40) return go(dx < 0 ? 1 : -1);
          const r = book.current!.getBoundingClientRect();
          go(e.clientX > r.left + r.width / 2 ? 1 : -1);
        }}
      >
        <motion.div
          className="absolute inset-0 [transform-style:preserve-3d]"
          animate={{ x: shift }}
          initial={false}
          transition={still ? { duration: 0 } : TURN}
        >
          {Array.from({ length: sheets }, (_, i) => {
            const flipped = i < turned;
            const z = i === active ? sheets + 1 : flipped ? i + 1 : sheets - i;
            return <Sheet key={i} front={pages[i * 2]} back={pages[i * 2 + 1]} flipped={flipped} z={z} sizes={sizes} w={w} h={h} still={still} />;
          })}
        </motion.div>
      </div>
      <figcaption className="mt-6 flex items-center justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">{label}</span>
        <span className="flex shrink-0 items-center gap-2">
          <span aria-live="polite" className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">
            {showing} / {pages.length}
          </span>
          {([[-1, "Previous page", "←"], [1, "Next page", "→"]] as const).map(([d, name, glyph]) => (
            <button
              key={d}
              type="button"
              aria-label={name}
              onClick={() => go(d)}
              disabled={d === -1 ? turned === 0 : turned === sheets}
              className="grid size-9 place-items-center rounded-full border border-[var(--v2-line)] text-[14px] text-[var(--v2-ink)] transition-colors duration-200 hover:bg-[var(--v2-ink)] hover:text-black disabled:pointer-events-none disabled:opacity-30"
            >
              {glyph}
            </button>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
