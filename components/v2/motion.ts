/* One motion vocabulary for every v2 surface.

   EASE is the original portfolio's entrance curve, so v2 moves like the rest
   of the site. SPRING is for anything a pointer drives, where a fixed duration
   would feel detached from the input.

   Everything animated in v2 is opacity or transform, the two properties the
   compositor can run without laying out or painting again. No filters: a
   filter region on a scaled element is what produced the ghost rectangle
   beside the first project card. */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const SPRING = {
  type: "spring" as const,
  stiffness: 210,
  damping: 26,
  mass: 0.9,
};

export const DURATION = {
  fast: 0.35,
  base: 0.6,
  slow: 0.8,
  /* hover: colour and small glyph changes. flood: a fill or a label crossing
     a button, the largest thing a hover is allowed to move. */
  hover: 0.2,
  flood: 0.26,
} as const;

/* An element arriving as it scrolls into view. `once` so nothing re-animates
   on the way back up, `amount: 0.15` so tall blocks start before their bottom
   edge is on screen. */
export const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: DURATION.base, ease: EASE },
};

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
