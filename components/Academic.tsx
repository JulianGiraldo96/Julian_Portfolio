"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const project = {
  slug: "meinerva",
  title: "Meinerva",
  headline: "Look before you're told: making experimental art legible.",
  tagline: "Master's thesis. An art companion that delays explanation so you build your own reading.",
  types: ["Research", "UX", "Art & Tech"],
  year: "2025",
  image: "/projects/meinerva/cover.webp",
  context: "Master of Visual & Experience Design · UE Potsdam",
};

export function Academic() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      id="academic"
      className="relative px-6 md:px-10 pt-8 md:pt-12 pb-24 md:pb-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between mb-10 md:mb-14 font-mono text-[13px] uppercase tracking-[0.22em]">
          <span className="text-muted">
            <span className="text-foreground">[ 02 ]</span>
            <span className="mx-3 opacity-40">/</span>
            academic projects
          </span>
          <span className="text-muted">research · 2025</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href={`/work/${project.slug}`}
            className="group block"
            data-cursor-hover
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 md:gap-12 items-center">
              <div
                ref={ref}
                className="relative aspect-[16/10] overflow-hidden bg-subtle order-1"
              >
                <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/8 transition-colors duration-500" />
                <div className="absolute top-5 left-5 right-5 md:top-6 md:left-6 md:right-6 flex items-start justify-between gap-3">
                  <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-white/60">
                    thesis
                  </span>
                  <div className="flex gap-1.5 flex-wrap justify-end">
                    {project.types.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/80 bg-black/25 backdrop-blur-sm px-2 py-0.5 rounded-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="order-2">
                <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-3">
                  {project.title} · {project.year}
                </span>
                <h3 className="font-display font-light text-3xl md:text-4xl text-foreground tracking-[-0.02em] leading-[1.05]">
                  {project.headline}
                </h3>
                <p className="mt-5 text-muted text-base md:text-lg leading-relaxed max-w-md">
                  {project.tagline}
                </p>
                <span className="mt-6 block font-mono text-[11px] uppercase tracking-[0.18em] text-muted/70">
                  {project.context}
                </span>
                <span className="mt-8 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-foreground group-hover:gap-3 transition-all">
                  read the case study
                  <span aria-hidden>↗</span>
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
