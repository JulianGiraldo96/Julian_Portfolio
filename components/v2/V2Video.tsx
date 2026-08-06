"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* A screen recording, sat on a white card.

   The recording is a phone capture, so its edges are hard cuts. Dropping it
   straight onto the page makes those cuts read as a mistake. A white plate with
   generous padding around it turns the same edges into a mount, and keeps the
   frame legible in dark mode where a black video would otherwise bleed into the
   background.

   It plays only while it is on screen: a two and a half minute loop decoding
   behind the fold is wasted battery for something nobody is looking at, and
   with `preload="none"` the fourteen megabyte file is not fetched at all until
   somebody scrolls to it. Under prefers-reduced-motion it never autoplays.
   Controls are always present: a moving image needs a stop button, and a
   paused one needs a play button. */

export function V2Video({
  src,
  poster,
  caption,
  ratio = 720 / 1486,
}: {
  src: string;
  poster?: string;
  caption?: string;
  /* width over height, so the plate reserves the right box before it loads */
  ratio?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void el.play().catch(() => {
            /* autoplay refused: the poster and controls carry it */
          });
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [prefersReduced]);

  return (
    <figure className="grain relative overflow-hidden rounded-[28px] bg-white px-5 py-6 md:px-10 md:py-12">
      <div className="relative z-10 mx-auto w-full max-w-[300px] md:max-w-[340px]">
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          /* nothing is fetched until it scrolls into view. The poster carries the
             frame until then, so a reader who never reaches this section pays
             nothing for a fourteen megabyte file. */
          preload="none"
          /* always. Under reduced motion the video is paused, and a paused video
             with no controls is a dead rectangle; for everyone else a moving
             image needs a stop button anyway (WCAG 2.2.2). */
          controls
          style={{ aspectRatio: String(ratio) }}
          className="block h-auto w-full rounded-[18px] bg-black"
        />
      </div>
      {caption && (
        <figcaption className="relative z-10 mt-6 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-[#6e6e73]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
