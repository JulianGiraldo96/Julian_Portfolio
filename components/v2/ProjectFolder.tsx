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

/* Each project is a folder. At rest a glass pocket, cut as one continuous
   shape with its tab, covers the lower half of the product screen. On hover or
   keyboard focus the pocket slides out of frame, the screen rises clear of it,
   and the keyword cards are dealt one at a time from behind it. Clicking blurs
   the page away and the case study arrives in its place.
   The keywords are decoration, aria-hidden: the same words sit in the meta line
   under every card. */

export type FolderProject = {
  slug: ScreenSlug;
  title: string;
  headline: string;
  tags: string[];
  year: string;
  /* phones are sized by height, desktop windows by width, so both sit inside
     the folder at the same visual weight */
  shape: "phone" | "desktop";
  bg: string;
  glass: string;
  dark?: boolean;
};

const SPRING = { type: "spring" as const, stiffness: 210, damping: 26, mass: 0.9 };
const EASE = [0.22, 1, 0.36, 1] as const;
/* matches the .v2-leave keyframe in globals.css */
const LEAVE_MS = 380;

/* The screen is large enough to span the card, so the cards are dealt into the
   strip the pocket vacates along the bottom, spread like a hand rather than a
   row. Offsets are percentages of the stage, so the fan scales with the
   column. */
const fan = [
  { x: "-30%", y: "42%", rotate: -7 },
  { x: "0%", y: "46%", rotate: 2 },
  { x: "30%", y: "42%", rotate: 8 },
  { x: "-15%", y: "48%", rotate: -3 },
];

function deal(i: number) {
  return fan[i % fan.length];
}

/* The folder front and its tab as a single path, so there is no seam where a
   separate tab would sit on top. Built in pixels from the measured pocket, so
   the corner radii stay round at any column width. */
function folderPath(w: number, h: number) {
  if (w < 2 || h < 2) return "";
  const R = 30; // outer top corners
  const tabW = Math.min(150, w * 0.3);
  const tabX = Math.max(R + 8, w * 0.07);
  const tabH = Math.min(24, h * 0.11);
  const r = 9; // tab corners
  const s = 14; // width of the sweep between body and tab
  return [
    `M0 ${h}`,
    `L0 ${tabH + R}`,
    `Q0 ${tabH} ${R} ${tabH}`,
    `L${tabX - s} ${tabH}`,
    `C${tabX - s / 2} ${tabH} ${tabX} ${tabH - 1} ${tabX} ${tabH - r - 2}`,
    `L${tabX} ${r}`,
    `Q${tabX} 0 ${tabX + r} 0`,
    `L${tabX + tabW - r} 0`,
    `Q${tabX + tabW} 0 ${tabX + tabW} ${r}`,
    `L${tabX + tabW} ${tabH - r - 2}`,
    `C${tabX + tabW} ${tabH - 1} ${tabX + tabW + s / 2} ${tabH} ${tabX + tabW + s} ${tabH}`,
    `L${w - R} ${tabH}`,
    `Q${w} ${tabH} ${w} ${tabH + R}`,
    `L${w} ${h}`,
    "Z",
  ].join(" ");
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
  const pocketRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState(false);
  const [pocket, setPocket] = useState({ w: 0, h: 0 });
  const [leaving, setLeaving] = useState(false);
  const Screen = screens[project.slug];
  const phone = project.shape === "phone";
  const href = `/work/${project.slug}`;

  /* measure the pocket so the folder outline can be cut in real pixels */
  useEffect(() => {
    const el = pocketRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setPocket((p) =>
        Math.abs(p.w - width) < 1 && Math.abs(p.h - height) < 1
          ? p
          : { w: width, h: height },
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Touch has no hover, so on those devices the folder opens itself once the
     card is well inside the viewport. Pointer devices keep the hover reveal. */
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

  const path = folderPath(pocket.w, pocket.h);
  const stageState = leaving || openInView ? "open" : "rest";

  /* The window is deliberately larger than the folder: at rest it already
     fills most of the card, and on hover it grows past the edges. Its layer is
     unclipped so nothing cuts it off. It stays inside the card on small
     screens, where there is no room either side before the viewport edge. */
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

          {/* layer 2: the screen, unclipped so it can lift past the folder */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <motion.div
              variants={{
                rest: { scale: 1, y: "6%" },
                open: { scale: 1.14, y: "-9%" },
              }}
              transition={SPRING}
              className={`flex items-center justify-center ${screenSize}`}
            >
              <Screen className={phone ? "h-full w-auto" : "h-auto w-full"} />
            </motion.div>
          </div>

          {/* layer 3: the glass pocket, above the screen, clipped to the card */}
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[28px]">
            <motion.div
              ref={pocketRef}
              aria-hidden
              variants={{ rest: { y: "0%" }, open: { y: "88%" } }}
              transition={{ ...SPRING, damping: 28 }}
              className="absolute inset-x-0 bottom-[-10%] h-[57%]"
            >
              {/* the glass itself: one shape, blurred and tinted */}
              <div
                className="absolute inset-0 backdrop-blur-2xl backdrop-saturate-[1.7]"
                style={{
                  clipPath: path ? `path("${path}")` : undefined,
                  background: project.dark
                    ? "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.07) 42%, rgba(255,255,255,0.04) 100%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.52) 42%, rgba(255,255,255,0.42) 100%)",
                }}
              />
              {/* the outline and the sheen, drawn on the same path */}
              {path && (
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox={`0 0 ${pocket.w} ${pocket.h}`}
                  fill="none"
                >
                  <defs>
                    <linearGradient id={`edge-${project.slug}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0"
                        stopColor="#fff"
                        stopOpacity={project.dark ? 0.42 : 0.95}
                      />
                      <stop
                        offset="0.55"
                        stopColor="#fff"
                        stopOpacity={project.dark ? 0.1 : 0.35}
                      />
                      <stop offset="1" stopColor="#fff" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id={`sheen-${project.slug}`} x1="0" y1="0" x2="1" y2="0.6">
                      <stop offset="0" stopColor="#fff" stopOpacity="0" />
                      <stop
                        offset="0.45"
                        stopColor="#fff"
                        stopOpacity={project.dark ? 0.07 : 0.5}
                      />
                      <stop offset="1" stopColor="#fff" stopOpacity="0" />
                    </linearGradient>
                    <clipPath id={`clip-${project.slug}`}>
                      <path d={path} />
                    </clipPath>
                  </defs>
                  <g clipPath={`url(#clip-${project.slug})`}>
                    <rect
                      x="0"
                      y="0"
                      width={pocket.w}
                      height={Math.max(pocket.h * 0.5, 1)}
                      fill={`url(#sheen-${project.slug})`}
                    />
                  </g>
                  <path
                    d={path}
                    stroke={`url(#edge-${project.slug})`}
                    strokeWidth="1.4"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              )}
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
