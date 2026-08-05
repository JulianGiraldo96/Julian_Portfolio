"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { screens, type ScreenSlug } from "./ProductScreens";

/* Each project card is a tinted panel with the product screen sitting on it,
   nothing in front of it. On hover or keyboard focus the screen rises and
   grows past the card's edges, and the keyword cards are dealt one at a time
   from behind it along the bottom. Clicking blurs the page away and the case
   study arrives in its place.
   The keywords are decoration, aria-hidden: the same words sit in the meta line
   under every card. */

export type FolderProject = {
  slug: ScreenSlug;
  title: string;
  headline: string;
  tags: string[];
  year: string;
  /* phones are sized by height, desktop windows by width, so both sit on the
     card at the same visual weight */
  shape: "phone" | "desktop";
  bg: string;
  dark?: boolean;
};

const SPRING = { type: "spring" as const, stiffness: 210, damping: 26, mass: 0.9 };
const EASE = [0.22, 1, 0.36, 1] as const;
/* matches the .v2-leave keyframe in globals.css */
const LEAVE_MS = 380;

/* The screen is large enough to span the card, so the cards are dealt into the
   strip below it, spread like a hand rather than a row. Offsets are
   percentages of the stage, so the fan scales with the column. */
const fan = [
  { x: "-30%", y: "42%", rotate: -7 },
  { x: "0%", y: "46%", rotate: 2 },
  { x: "30%", y: "42%", rotate: 8 },
  { x: "-15%", y: "48%", rotate: -3 },
];

function deal(i: number) {
  return fan[i % fan.length];
}

export function ProjectFolder({
  project,
  index,
  wide,
}: {
  project: FolderProject;
  index: number;
  wide: boolean;
}) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const Screen = screens[project.slug];
  const phone = project.shape === "phone";
  const href = `/work/${project.slug}`;

  /* Touch has no hover, so on those devices the card opens itself once it is
     well inside the viewport. Pointer devices keep the hover reveal. */
  const [openInView, setOpenInView] = useState(false);
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !window.matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => setOpenInView(entry.intersectionRatio > 0.6),
      { threshold: [0, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const x = useSpring(cx, { stiffness: 380, damping: 32, mass: 0.6 });
  const y = useSpring(cy, { stiffness: 380, damping: 32, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (!mouse) setMouse(true);
    cx.set(e.clientX - rect.left);
    cy.set(e.clientY - rect.top);
  };

  /* Click blurs the page away and the case study arrives behind it. Modified
     clicks and reduced motion navigate the ordinary way. */
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (prefersReduced) return;
      e.preventDefault();
      setLeaving(true);
      window.setTimeout(() => router.push(href), LEAVE_MS - 60);
    },
    [prefersReduced, router, href],
  );

  const stageState = leaving || openInView ? "open" : "rest";

  /* At rest the window already fills most of the card, and on hover it grows
     past the edges. Its layer is unclipped so nothing cuts it off. It stays
     inside the card on small screens, where there is no room either side
     before the viewport edge. */
  const screenSize = phone
    ? "h-[70%] md:h-[80%]"
    : wide
      ? "w-[82%] md:w-[88%]"
      : "w-[84%] md:w-[94%]";

  return (
    <motion.li
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.07, ease: EASE }}
      className={`col-span-1 ${wide ? "md:col-span-7" : "md:col-span-5"}`}
    >
      <Link href={href} onClick={onClick} className="group block" data-cursor-hover>
        <motion.div
          ref={stageRef}
          initial="rest"
          animate={stageState}
          whileHover="open"
          whileFocus="open"
          onPointerMove={onMove}
          onPointerLeave={() => setMouse(false)}
          className="relative isolate h-[400px] md:h-[520px]"
        >
          {/* layer 1: the tinted panel and the keyword cards, clipped */}
          <div
            className="absolute inset-0 overflow-hidden rounded-[28px]"
            style={{ backgroundColor: project.bg }}
          >
            {project.tags.map((tag, i) => {
              const d = deal(i);
              return (
                <motion.div
                  key={tag}
                  aria-hidden
                  variants={{
                    rest: { x: 0, y: "4%", opacity: 0 },
                    open: { x: d.x, y: d.y, opacity: 1 },
                  }}
                  transition={{ ...SPRING, delay: 0.12 + i * 0.09 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <motion.span
                    variants={{
                      rest: { rotate: 0, scale: 0.82 },
                      open: { rotate: d.rotate, scale: 1 },
                    }}
                    transition={{ ...SPRING, delay: 0.12 + i * 0.09 }}
                    className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-[12px] font-medium shadow-[0_14px_30px_-16px_rgba(0,0,0,0.6)] ${
                      project.dark
                        ? "bg-white/[0.14] text-white/85 backdrop-blur-sm"
                        : "bg-white text-[#55555a]"
                    }`}
                  >
                    {tag}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>

          {/* layer 2: the screen, unclipped so it can grow past the card */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <motion.div
              variants={{
                rest: { scale: 1, y: "0%" },
                open: { scale: 1.14, y: "-7%" },
              }}
              transition={SPRING}
              className={`flex items-center justify-center ${screenSize}`}
            >
              <Screen className={phone ? "h-full w-auto" : "h-auto w-full"} />
            </motion.div>
          </div>

          {/* cursor companion, mouse only */}
          <motion.span
            aria-hidden
            style={prefersReduced || !mouse ? undefined : { x, y }}
            variants={{
              rest: { opacity: 0, scale: 0.8 },
              open: { opacity: mouse && !prefersReduced && !leaving ? 1 : 0, scale: 1 },
            }}
            transition={{ duration: 0.2, ease: EASE }}
            className="pointer-events-none absolute left-0 top-0 z-30 -translate-x-1/2 translate-y-5 whitespace-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[13px] font-medium text-white"
          >
            Read case study
          </motion.span>
        </motion.div>

        <div className="mt-5 px-1">
          <h3 className="max-w-[24ch] text-[21px] font-medium leading-[1.18] tracking-[-0.02em] transition-opacity duration-300 group-hover:opacity-70 md:text-[25px]">
            {project.headline}
          </h3>
          <p className="mt-2 text-[14px]" style={{ color: "#55555a" }}>
            {project.title} · {project.year} · {project.tags.join(" · ")}
          </p>
        </div>
      </Link>

      {/* On the way out the whole page blurs behind a veil, then the case study
         takes its place. Portaled to the body so it covers the page rather
         than this card, and driven by a CSS keyframe so it starts on its own
         the moment it mounts. */}
      {leaving &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="v2-leave fixed inset-0 z-[200] backdrop-blur-2xl backdrop-saturate-125"
            style={{
              backgroundColor: project.dark
                ? "rgba(13,13,15,0.55)"
                : "rgba(255,255,255,0.6)",
            }}
          />,
          document.body,
        )}
    </motion.li>
  );
}
