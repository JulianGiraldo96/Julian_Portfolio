"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useRef, useState } from "react";

/* Project card built as a stage: the cover sits on a tinted panel with its tag
   pills tucked behind it. On hover or keyboard focus the pills fan out to the
   sides, the cover lifts and sharpens, and a "Read case study" pill trails the
   cursor. The pills are decoration, the same words are in the meta line below,
   so they are aria-hidden and never carry information on their own. */

export type StageProject = {
  slug: string;
  title: string;
  headline: string;
  tags: string[];
  year: string;
  image: string;
  alt: string;
  bg: string;
  dark?: boolean;
  imgPosition?: string;
};

const SPRING = { type: "spring" as const, stiffness: 220, damping: 26, mass: 0.9 };

/* Alternating left/right fan. Offsets are percentages of the stage, so the
   spread scales with the card instead of drifting at small widths. At rest the
   pills sit just behind the cover's edges and only peek out; open pushes them
   clear of it without ever leaving the stage. */
function fan(i: number, wide: boolean) {
  const side = i % 2 === 0 ? -1 : 1;
  const tier = Math.floor(i / 2);
  /* narrow cards get a shorter throw so long tags never reach the stage edge */
  const restX = wide ? 27 : 22;
  const openX = wide ? 36 : 29;
  return {
    rest: { x: `${side * (restX + tier * 2)}%`, y: `${2 + tier * 17}%` },
    open: { x: `${side * (openX + tier * 2)}%`, y: `${-14 + tier * 31}%` },
    restRotate: side * (7 + tier * 4),
    openRotate: -side * (9 + tier * 3),
  };
}

export function ProjectStage({
  project,
  index,
  wide,
}: {
  project: StageProject;
  index: number;
  wide: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [pointerFine, setPointerFine] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const x = useSpring(cursorX, { stiffness: 380, damping: 32, mass: 0.6 });
  const y = useSpring(cursorY, { stiffness: 380, damping: 32, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (!pointerFine) setPointerFine(true);
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  /* With reduced motion the pills simply rest in their tidy tucked position. */
  const stageVariants: Variants = prefersReduced
    ? {}
    : { rest: {}, open: {} };

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
          variants={stageVariants}
          initial="rest"
          animate="rest"
          whileHover="open"
          whileFocus="open"
          onPointerMove={onMove}
          onPointerLeave={() => setPointerFine(false)}
          className="relative isolate flex h-[380px] items-center justify-center overflow-hidden rounded-[28px] md:h-[460px]"
          style={{ backgroundColor: project.bg }}
        >
          {/* fanned tag pills, decorative: the meta line below carries the words */}
          {project.tags.map((tag, i) => {
            const f = fan(i, wide);
            return (
              <motion.div
                key={tag}
                aria-hidden
                variants={{ rest: { x: f.rest.x, y: f.rest.y }, open: { x: f.open.x, y: f.open.y } }}
                transition={{ ...SPRING, delay: i * 0.035 }}
                className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
              >
                <motion.span
                  variants={{
                    rest: { rotate: f.restRotate, scale: 0.94 },
                    open: { rotate: f.openRotate, scale: 1 },
                  }}
                  transition={{ ...SPRING, delay: i * 0.035 }}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-medium shadow-[0_10px_24px_-14px_rgba(0,0,0,0.5)] ${
                    project.dark ? "bg-white/14 text-white/85" : "bg-white/90 text-[#55555a]"
                  }`}
                >
                  {tag}
                </motion.span>
              </motion.div>
            );
          })}

          {/* the cover, always above the pills */}
          <motion.div
            variants={{
              rest: { scale: 1, y: 0 },
              open: { scale: 1.07, y: -8 },
            }}
            transition={SPRING}
            className={`relative z-10 h-[50%] overflow-hidden rounded-2xl shadow-[0_30px_60px_-28px_rgba(0,0,0,0.55)] ${
              wide ? "w-[54%]" : "w-[58%]"
            }`}
          >
            <Image
              src={project.image}
              alt=""
              fill
              sizes={wide ? "(min-width: 768px) 35vw, 60vw" : "(min-width: 768px) 25vw, 60vw"}
              className={`object-cover ${project.imgPosition ?? "object-top"} saturate-[0.88] transition-[filter] duration-500 group-hover:saturate-100`}
              priority={index < 2}
            />
          </motion.div>

          {/* cursor companion, mouse only */}
          <motion.span
            aria-hidden
            style={prefersReduced || !pointerFine ? undefined : { x, y }}
            variants={{
              rest: { opacity: 0, scale: 0.8 },
              open: { opacity: pointerFine && !prefersReduced ? 1 : 0, scale: 1 },
            }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="pointer-events-none absolute left-0 top-0 z-20 -translate-x-1/2 translate-y-4 whitespace-nowrap rounded-full bg-[#1d1d1f] px-4 py-2 text-[13px] font-medium text-white"
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
          <span className="sr-only">{project.alt}</span>
        </div>
      </Link>
    </motion.li>
  );
}
