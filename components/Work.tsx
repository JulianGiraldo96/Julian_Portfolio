"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Project = {
  slug?: string;
  title: string;
  tagline: string;
  headline: string;
  types: string[];
  year: string;
  image?: string;
  tone?: string;
  accent?: string;
};

const projects: Project[] = [
  {
    slug: "savee",
    title: "Savee",
    headline: "Meal planning that makes food waste impossible.",
    tagline: "A social planner that cuts household food waste.",
    types: ["Mobile", "UX", "Sustainability"],
    year: "2025",
    image: "/projects/savee/cover.png",
  },
  {
    slug: "erp-duo",
    title: "ERP Duo",
    headline: "Nine locations. One system. Full control.",
    tagline: "Bespoke ERP for a Sicilian gelato chain.",
    types: ["Web", "B2B", "ERP"],
    year: "2026",
    image: "/projects/erp-duo/cover.png",
  },
  {
    title: "Tierra Viva",
    headline: "An organic market, reborn.",
    tagline: "Breathing new life into an organic market.",
    types: ["Web", "Branding"],
    year: "2024",
    tone: "bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-300",
    accent:
      "after:bg-[radial-gradient(circle_at_70%_30%,#f7d89c_0%,transparent_60%)]",
  },
  {
    title: "Casa Nomad",
    headline: "Artisan craft. Global reach.",
    tagline: "Weaving artisan stories into a global brand.",
    types: ["Web", "Identity"],
    year: "2024",
    tone: "bg-gradient-to-br from-[#c26f3c] via-[#8f4a24] to-[#d48c5a]",
    accent:
      "after:bg-[radial-gradient(circle_at_20%_30%,#e6a46e_0%,transparent_60%)]",
  },
];

export function Work() {
  return (
    <section
      id="work"
      className="relative px-6 md:px-10 pt-24 md:pt-32 pb-24 md:pb-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-end justify-between mb-10 md:mb-14 font-mono text-[11px] uppercase tracking-[0.22em]">
          <span className="text-muted">
            <span className="text-foreground">[ 01 ]</span>
            <span className="mx-3 opacity-40">/</span>
            selected works
          </span>
          <a
            href="#archives"
            className="text-muted hover:text-foreground transition-colors"
            data-cursor-hover
          >
            see all ↗
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const href = project.slug ? `/work/${project.slug}` : "#";
  const Wrapper = project.slug ? Link : "a";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.9,
        delay: (index % 2) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Wrapper href={href} className="group block" data-cursor-hover>
        <div
          ref={ref}
          className="relative aspect-[4/3] md:aspect-[5/4] overflow-hidden bg-subtle"
        >
          {project.image ? (
            <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority={index < 2}
              />
            </motion.div>
          ) : (
            <motion.div
              style={{ y: imgY }}
              className={`absolute inset-0 scale-110 ${project.tone} after:content-[''] after:absolute after:inset-0 ${project.accent}`}
            />
          )}
          <motion.div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/8 transition-colors duration-500" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
          {/* top row */}
          <div className="absolute top-5 left-5 right-5 md:top-6 md:left-6 md:right-6 flex items-start justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")}
            </span>
            <div className="flex gap-1.5 flex-wrap justify-end">
              {project.slug ? (
                project.types.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/80 bg-black/25 backdrop-blur-sm px-2 py-0.5 rounded-sm"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 bg-black/25 px-2 py-1 rounded-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  coming soon
                </span>
              )}
            </div>
          </div>
          {/* bottom row */}
          {project.slug && (
            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
              <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 mb-2">
                {project.title} · {project.year}
              </span>
              <h3 className="font-display font-light text-3xl md:text-5xl text-white tracking-[-0.02em] leading-tight drop-shadow-lg">
                {project.headline}
              </h3>
            </div>
          )}
        </div>
        {!project.slug && (
          <div className="mt-5">
            <p className="font-display font-light text-3xl md:text-4xl tracking-[-0.02em] text-foreground/30">
              Project incoming
            </p>
          </div>
        )}
      </Wrapper>
    </motion.div>
  );
}
