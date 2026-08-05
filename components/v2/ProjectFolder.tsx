"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { screens, type ScreenSlug } from "./ProductScreens";

/* Each project is a folder. At rest a frosted glass pocket covers the lower
   half of the product screen, the way a document sits in a wallet. On hover or
   keyboard focus the pocket slides out of frame, the screen rises clear of it,
   and the keyword cards are dealt one by one from behind the screen.
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

/* Cards are dealt to alternating sides, in percentages of the stage so the
   spread scales with the column. A phone leaves room beside it, so those cards
   travel sideways; a desktop window fills the width, so its cards clear it
   above and below instead. */
function deal(i: number, wide: boolean, phone: boolean) {
  const side = i % 2 === 0 ? -1 : 1;
  const tier = Math.floor(i / 2);
  const rotate = -side * (8 + tier * 3);
  if (phone) {
    return {
      x: `${side * ((wide ? 30 : 25) + tier * 2)}%`,
      y: `${-16 + tier * 30}%`,
      rotate,
    };
  }
  /* the wide column's window is the tallest thing on any stage, and it also
     rises on open, so its cards need to start higher to clear it */
  const lift = wide ? 40 : 30;
  return {
    x: `${side * (wide ? 30 : 26)}%`,
    y: `${tier === 0 ? -lift : lift}%`,
    rotate,
  };
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
  const prefersReduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState(false);
  const Screen = screens[project.slug];
  const phone = project.shape === "phone";

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

  return (
    <motion.li
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      className={`col-span-1 ${wide ? "md:col-span-7" : "md:col-span-5"}`}
    >
      <Link href={`/work/${project.slug}`} className="group block" data-cursor-hover>
        <motion.div
          ref={stageRef}
          initial="rest"
          animate={openInView ? "open" : "rest"}
          whileHover="open"
          whileFocus="open"
          onPointerMove={onMove}
          onPointerLeave={() => setMouse(false)}
          className="relative isolate flex h-[380px] items-center justify-center overflow-hidden rounded-[28px] md:h-[460px]"
          style={{ backgroundColor: project.bg }}
        >
          {/* keyword cards, dealt from behind the screen */}
          {project.tags.map((tag, i) => {
            const d = deal(i, wide, phone);
            return (
              <motion.div
                key={tag}
                aria-hidden
                variants={{
                  rest: { x: 0, y: "6%", opacity: 0 },
                  open: { x: d.x, y: d.y, opacity: 1 },
                }}
                transition={{ ...SPRING, delay: 0.12 + i * 0.09 }}
                className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
              >
                <motion.span
                  variants={{
                    rest: { rotate: 0, scale: 0.82 },
                    open: { rotate: d.rotate, scale: 1 },
                  }}
                  transition={{ ...SPRING, delay: 0.12 + i * 0.09 }}
                  className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-[12px] font-medium shadow-[0_12px_26px_-14px_rgba(0,0,0,0.55)] ${
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

          {/* the product screen */}
          <motion.div
            variants={{
              rest: { y: "7%", scale: 0.96 },
              open: { y: "-6%", scale: 1.05 },
            }}
            transition={SPRING}
            className={`relative z-10 flex items-center justify-center ${
              phone ? "h-[62%]" : wide ? "w-[56%]" : "w-[60%]"
            }`}
          >
            <Screen className={phone ? "h-full w-auto" : "h-auto w-full"} />
          </motion.div>

          {/* the glass pocket */}
          <motion.div
            aria-hidden
            variants={{
              rest: { y: "0%" },
              open: { y: "82%" },
            }}
            transition={{ ...SPRING, damping: 28 }}
            className="pointer-events-none absolute inset-x-0 bottom-[-12%] z-20 h-[58%] rounded-t-[36px] border-t backdrop-blur-md"
            style={{
              backgroundColor: project.glass,
              borderTopColor: project.dark
                ? "rgba(255,255,255,0.22)"
                : "rgba(255,255,255,0.85)",
              boxShadow: project.dark
                ? "0 -14px 40px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.16)"
                : "0 -14px 40px -20px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* the tab, so the pocket reads as a folder rather than a panel */}
            <span
              className="absolute -top-[7px] left-8 h-[14px] w-24 rounded-t-[10px] border-t"
              style={{
                backgroundColor: project.glass,
                borderTopColor: project.dark
                  ? "rgba(255,255,255,0.22)"
                  : "rgba(255,255,255,0.85)",
              }}
            />
            <span
              className="absolute inset-x-10 top-[18%] h-px"
              style={{
                background: project.dark
                  ? "linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)"
                  : "linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)",
              }}
            />
          </motion.div>

          {/* cursor companion, mouse only */}
          <motion.span
            aria-hidden
            style={prefersReduced || !mouse ? undefined : { x, y }}
            variants={{
              rest: { opacity: 0, scale: 0.8 },
              open: { opacity: mouse && !prefersReduced ? 1 : 0, scale: 1 },
            }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
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
    </motion.li>
  );
}
