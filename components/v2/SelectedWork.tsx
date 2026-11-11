"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { MoreLink, ProjectRow, RowHead } from "./ProductRows";
import { designCards, PosterCard } from "./Showcase";
import { CursorChip } from "./Playful";
import { DURATION, EASE } from "./motion";
import { academic, professional } from "./projects";
import { designCount } from "./DesignWork";

/* The home page's work block: the most important pieces of both kinds, one
   row each, and a way through to the page that holds all of it. Product
   design shows the three shipped systems; Visual work shows the first three
   poster cards as a grid: Greens across the whole column, CamelWebs and
   Savee side by side under it. Everything else lives on /product-design and
   /visual-work, which the top bar points at from every page. */

const pad = (n: number) => String(n).padStart(2, "0");

export function SelectedWork() {
  const visual = designCards.slice(0, 3);
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="scroll-mt-24 border-t border-[var(--v2-line)] pb-6 pt-10 md:pt-14"
    >
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 md:mb-12">
        <h2
          id="work-heading"
          className="font-mono text-[12px] uppercase tracking-[0.2em]"
        >
          Selected work
        </h2>
        <p className="max-w-[44ch] text-[14px] leading-relaxed text-[var(--v2-secondary)]">
          A few of each. The full set of product cases and visual pieces has a
          page of its own.
        </p>
      </div>

      <div className="flex flex-col gap-16 md:gap-24">
        <ProjectRow
          label="Product design"
          aside={
            <MoreLink href="/product-design">
              All<span className="hidden sm:inline"> product design</span> · {pad(professional.length + academic.length)}
            </MoreLink>
          }
          list={professional}
          offset={0}
        />

        <div>
          <RowHead
            label="Visual work"
            aside={
              <MoreLink href="/visual-work">
                All<span className="hidden sm:inline"> visual work</span> · {pad(designCount)}
              </MoreLink>
            }
          />
          <CursorChip label="View ↗︎">
            <motion.ul
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid list-none grid-cols-1 gap-5 md:grid-cols-2"
            >
              {visual.map((c, i) => (
                <motion.li
                  key={c.title}
                  variants={{
                    hidden: { opacity: 0, y: 40, scale: 0.96 },
                    shown: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: DURATION.slow, ease: EASE }}
                  className={i === 0 ? "md:col-span-2" : ""}
                >
                  <PosterCard card={c} wide={i === 0} art={i === 0 ? <GreensArt /> : undefined} />
                </motion.li>
              ))}
            </motion.ul>
          </CursorChip>
        </div>
      </div>
    </section>
  );
}

/* The Greens tile at full width: the logo centred in the left half over the
   brand's own pattern, and on the right a fan of three real pieces (the
   offers leaflet, a weekly post, a frame of the Christmas film) that spreads
   when the card is hovered. Transforms only, on the same settle curve the
   mockups on /design/greens use. On a phone the fan goes and the logo sits
   centred on its own. */
const G = "/design/greens";
const SETTLE =
  "transition-transform duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]";

function GreensArt() {
  return (
    <div className="relative h-full w-full">
      {/* the pattern of g marks, faint on the green */}
      <Image
        src={`${G}/pattern.webp`}
        alt=""
        fill
        sizes="(min-width: 1240px) 1180px, 100vw"
        className="object-cover opacity-[0.22] mix-blend-soft-light"
      />
      {/* the logo, centred on the left half (centred on the whole card on a
          phone), kept clear of the title at the bottom */}
      <div className="absolute inset-y-0 left-0 flex w-full items-center justify-center pb-[26%] sm:w-[52%] sm:pb-[12%]">
        <Image
          src={`${G}/logo/horizontal-white.svg`}
          alt="The Greens Supermarket logo in white on leaf green"
          width={776}
          height={290}
          className={`h-auto w-[58%] max-w-[420px] sm:w-[62%] ${SETTLE} group-hover:scale-[1.04]`}
        />
      </div>
      {/* the fan */}
      <div aria-hidden className="absolute right-[5%] top-[13%] hidden h-[66%] w-[42%] sm:block">
        <div
          className={`absolute left-0 top-[6%] h-[82%] overflow-hidden rounded-[10px] shadow-[0_24px_40px_-16px_rgba(0,0,0,0.55)] [transform:rotate(-7deg)] group-hover:[transform:translate(-6%,-2%)_rotate(-11deg)] ${SETTLE}`}
          style={{ aspectRatio: "1400 / 1980" }}
        >
          <Image src={`${G}/leaflet/new-1.webp`} alt="" fill sizes="200px" className="object-cover" />
        </div>
        <div
          className={`absolute left-[30%] top-[20%] z-10 h-[64%] overflow-hidden rounded-[10px] shadow-[0_24px_40px_-16px_rgba(0,0,0,0.55)] [transform:rotate(3deg)] group-hover:[transform:translate(0,-6%)_rotate(2deg)] ${SETTLE}`}
          style={{ aspectRatio: "1 / 1" }}
        >
          <Image src={`${G}/post-open.webp`} alt="" fill sizes="220px" className="object-cover" />
        </div>
        <div
          className={`absolute right-0 top-0 h-[76%] overflow-hidden rounded-[10px] shadow-[0_24px_40px_-16px_rgba(0,0,0,0.55)] [transform:rotate(9deg)] group-hover:[transform:translate(7%,-1%)_rotate(14deg)] ${SETTLE}`}
          style={{ aspectRatio: "540 / 960" }}
        >
          <Image src={`${G}/video/christmas.webp`} alt="" fill sizes="160px" className="object-cover" />
        </div>
      </div>
    </div>
  );
}
