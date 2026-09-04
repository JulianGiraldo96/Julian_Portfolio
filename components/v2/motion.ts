/* One motion vocabulary for every v2 surface.

   EASE is the original portfolio's entrance curve, so v2 moves like the rest
   of the site. SPRING is for anything a pointer drives, where a fixed duration
   would feel detached from the input.

   Everything animated in v2 is opacity or transform, the two properties the
   compositor can run without laying out or painting again. No filters: a
   filter region on a scaled element is what produced the ghost rectangle
   beside the first project card.

   DURATION is the whole time scale, named. Nothing in v2 should hand-type a
   second count: pick the token whose name matches the job, so twelve reveals
   that were "0.55, near enough" all land on the same number. */

export const EASE = [0.22, 1, 0.36, 1] as const;

/* Apple-style: a short spring with just enough bounce to read as physical.
   Reserve visible bounce for drag-to-dismiss; this is the default for a
   pointer-driven move (a segmented-control pill, a handle following a drag). */
export const SPRING = {
  type: "spring" as const,
  duration: 0.5,
  bounce: 0.2,
} as const;

export const DURATION = {
  /* press: :active feedback, the fastest thing on the site */
  press: 0.14,
  /* hover: colour and small glyph changes */
  hover: 0.2,
  /* flood: a fill or a label crossing a button, the largest a hover may move */
  flood: 0.26,
  /* fast: a small element arriving or leaving */
  fast: 0.35,
  /* base: the standard scroll-into-view reveal */
  base: 0.5,
  /* slow: a large element settling, or a hairline drawing itself */
  slow: 0.8,
  /* draw: a wire or path drawing along its own length */
  draw: 1.2,
} as const;

/* An element arriving as it scrolls into view. `once` so nothing re-animates
   on the way back up. `y` is the travel, `amount` how much of the block has to
   be on screen before it starts (low for tall blocks). */
export function fadeUp(delay = 0, { y = 16, amount = 0.3 }: { y?: number; amount?: number } = {}) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount },
    transition: { duration: DURATION.base, delay, ease: EASE },
  };
}

/* Same trigger, opacity only: for text that should surface without also
   sliding (a note, a caption, a value the reader already has). */
export function fadeIn(delay = 0, amount = 0.3) {
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount },
    transition: { duration: DURATION.base, delay, ease: EASE },
  };
}

/* A hairline drawing itself from one end, so a new section announces the
   change of subject before the words do. */
export function hairline(delay = 0, amount = 0.8) {
  return {
    initial: { scaleX: 0 },
    whileInView: { scaleX: 1 },
    viewport: { once: true, amount },
    transition: { duration: DURATION.slow, delay, ease: EASE },
  };
}

/* The scroll reveal used where a bare object is spread rather than a call:
   slightly longer travel, starts sooner, because the blocks it wraps are tall. */
export const reveal = fadeUp(0, { y: 20, amount: 0.15 });

/* Above the fold, where there is nothing to scroll into.

   Kept short on purpose: the hero heading is the page's Largest Contentful
   Paint, so the length of this animation is literally the reported load time.
   0.45s still reads as an entrance and lands the measurement under half a
   second. */
export function rise(delay = 0) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: EASE },
  };
}
