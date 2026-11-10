"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SplitTitle } from "./Playful";
import { ENERGY } from "./motion";

/* The pieces every brand page is built from (CamelWebs, Greens): the reveal,
   the section head, a framed shot, the guide's paper, the segmented switch
   and the stage a mockup sits on. One place, so the pages read as a set. */

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: ENERGY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--v2-label)]">{children}</p>;
}

export function SectionHead({ label, title, children }: { label: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-5">
        <Label>{label}</Label>
        <SplitTitle
          as="h2"
          text={title}
          className="mt-4 text-balance font-display text-[30px] font-extralight leading-[1.05] tracking-[-0.04em] md:text-[44px]"
        />
      </div>
      {children && (
        <Reveal className="md:col-span-7 md:pt-8">
          <div className="max-w-[58ch] text-[16px] leading-relaxed text-[var(--v2-secondary)]">{children}</div>
        </Reveal>
      )}
    </div>
  );
}

/* a slide or screenshot at its own shape, in the site's frame */
export function Shot({ src, alt, w = 1920, h = 1080, caption, sizes = "(min-width: 1240px) 1180px, 100vw" }: { src: string; alt: string; w?: number; h?: number; caption?: string; sizes?: string }) {
  return (
    <figure>
      <div className="v2-card-bezel overflow-hidden rounded-[20px] border border-[var(--v2-line)]">
        <Image src={src} alt={alt} width={w} height={h} sizes={sizes} className="block h-auto w-full" />
      </div>
      {caption && <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">{caption}</figcaption>}
    </figure>
  );
}

/* the guide's paper: the brand lives on white */
export function Paper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[24px] bg-white text-black ${className}`}>{children}</div>;
}

export function Segmented<T extends string>({ items, value, onChange, label }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-full border border-[var(--v2-line)] p-1">
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button
            key={it.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(it.id)}
            className={`relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
              on ? "text-black" : "text-[var(--v2-secondary)] hover:text-[var(--v2-ink)]"
            }`}
          >
            {on && (
              <motion.span
                layoutId={`seg-${label}`}
                className="absolute inset-0 rounded-full bg-[var(--v2-ink)]"
                transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              />
            )}
            <span className="relative">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* one stage per piece: square-ish on a phone, one shared height on desktop
   so the pieces in a row line up */
export function Stage({ children, caption, className = "", style }: { children: React.ReactNode; caption: string; className?: string; style?: React.CSSProperties }) {
  return (
    <figure className="group">
      <div className={`relative isolate aspect-[4/3] overflow-hidden rounded-[24px] border border-[var(--v2-line)] md:aspect-auto md:h-[440px] ${className}`} style={style}>
        {children}
      </div>
      <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-label)]">{caption}</figcaption>
    </figure>
  );
}
