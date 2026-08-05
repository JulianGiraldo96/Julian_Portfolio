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
   and the keyword cards are dealt one at a time from behind it. Clicking lifts
   the screen out of the folder and expands it to fill the viewport before the
   case study loads.
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
/* the curve iOS uses to open an app: slow to leave, long glide into place */
const ZOOM_EASE = [0.32, 0.72, 0, 1] as const;
const ZOOM_MS = 620;

type Zoom = {
  /* where the window starts, as an offset from where it ends */
  x: number;
  y: number;
  scale: number;
  /* the box it grows into */
  left: number;
  top: number;
  width: number;
  height: number;
};

/* Measure the card's window and work out the transform that would place a
   centred full size copy exactly on top of it. Animating that transform back
   to identity is one continuous zoom out of the card, rather than a new panel
   appearing in the middle of the screen. */
function planZoom(rect: DOMRect, phone: boolean): Zoom {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const ratio = phone ? 170 / 320 : 360 / 240;

  let width: number;
  let height: number;
  if (phone) {
    height = Math.min(vh * 0.88, 940);
    width = height * ratio;
  } else {
    width = Math.min(vw * 0.94, 1180);
    height = width / ratio;
    if (height > vh * 0.9) {
      height = vh * 0.9;
      width = height * ratio;
    }
  }

  const left = (vw - width) / 2;
  const top = (vh - height) / 2;
  return {
    width,
    height,
    left,
    top,
    scale: rect.width / width,
    x: rect.left + rect.width / 2 - (left + width / 2),
    y: rect.top + rect.height / 2 - (top + height / 2),
  };
}

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
  const screenRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState(false);
  const [pocket, setPocket] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState<Zoom | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const Screen = screens[project.slug];
  const phone = project.shape === "phone";
  const href = `/work/${project.slug}`;
  const launching = zoom !== null;

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

  /* Click zooms the window out of the card and into the viewport, and the case
     study lands as that zoom settles. Modified clicks and reduced motion
     navigate the ordinary way. */
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (prefersReduced) return;
      const rect = screenRef.current?.getBoundingClientRect();
      if (!rect || rect.width < 2) return;
      e.preventDefault();
      setZoom(planZoom(rect, phone));
      /* The portal keeps this list item's motion context, and a motion child
         that mounts under an already animated parent skips its `initial`. So
         the copy mounts on top of the card and only then is told to grow: a
         change of target always animates. */
      requestAnimationFrame(() => requestAnimationFrame(() => setZoomed(true)));
      window.setTimeout(() => router.push(href), ZOOM_MS - 60);
    },
    [prefersReduced, router, href, phone],
  );

  const path = folderPath(pocket.w, pocket.h);
  const stageState = launching || openInView ? "open" : "rest";

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
                    open: { x: d.x, y: d.y, opacity: launching ? 0 : 1 },
                  }}
                  transition={{ ...SPRING, delay: launching ? 0 : 0.12 + i * 0.09 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <motion.span
                    variants={{
                      rest: { rotate: 0, scale: 0.82 },
                      open: { rotate: d.rotate, scale: 1 },
                    }}
                    transition={{ ...SPRING, delay: launching ? 0 : 0.12 + i * 0.09 }}
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
              ref={screenRef}
              variants={{
                rest: { scale: 1, y: "6%" },
                open: { scale: 1.14, y: "-9%" },
              }}
              transition={SPRING}
              /* the zoomed copy takes over from here, so this one steps aside
                 without moving anything in the layout */
              style={{ visibility: launching ? "hidden" : "visible" }}
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
              open: { opacity: mouse && !prefersReduced && !launching ? 1 : 0, scale: 1 },
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

      {/* The window grows out of the card and into the viewport, starting
         exactly where the card left it. Rendered through a portal: the reveal
         animation leaves a transform on this list item, and a transformed
         ancestor would trap a fixed child. */}
      {zoom &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
            <motion.div
              animate={{ opacity: zoomed ? 1 : 0 }}
              transition={{ duration: ZOOM_MS / 1600, ease: "linear" }}
              className="absolute inset-0"
              style={{ backgroundColor: project.dark ? "#0d0d0f" : "#ffffff" }}
            />
            <motion.div
              className="absolute"
              style={{
                left: zoom.left,
                top: zoom.top,
                width: zoom.width,
                height: zoom.height,
              }}
              animate={
                zoomed
                  ? { x: 0, y: 0, scale: 1 }
                  : { x: zoom.x, y: zoom.y, scale: zoom.scale }
              }
              transition={{ duration: ZOOM_MS / 1000, ease: ZOOM_EASE }}
            >
              <Screen className="h-full w-full" />
            </motion.div>
          </div>,
          document.body,
        )}
    </motion.li>
  );
}
