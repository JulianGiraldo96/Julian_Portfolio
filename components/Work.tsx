"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Project = {
  slug?: string;
  title: string;
  tagline: string;
  year: string;
  image?: string;
  tone?: string;
  accent?: string;
};

const projects: Project[] = [
  {
    slug: "savee",
    title: "Savee",
    tagline: "A social planner that cuts household food waste.",
    year: "2025",
    image: "/projects/savee/cover.png",
  },
  {
    title: "Tierra Viva",
    tagline: "Breathing new life into an organic market.",
    year: "2024",
    tone: "bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-300",
    accent:
      "after:bg-[radial-gradient(circle_at_70%_30%,#f7d89c_0%,transparent_60%)]",
  },
  {
    title: "Casa Nomad",
    tagline: "Weaving artisan stories into a global brand.",
    year: "2024",
    tone: "bg-gradient-to-br from-[#c26f3c] via-[#8f4a24] to-[#d48c5a]",
    accent:
      "after:bg-[radial-gradient(circle_at_20%_30%,#e6a46e_0%,transparent_60%)]",
  },
  {
    title: "Alba",
    tagline: "Crafting a sanctuary of minimalism and nature.",
    year: "2023",
    tone: "bg-gradient-to-br from-[#9aa48d] via-[#6b7a5c] to-[#3f4a32]",
    accent:
      "after:bg-[radial-gradient(circle_at_60%_40%,#cfd4b8_0%,transparent_55%)]",
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
          <motion.div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
          <div className="absolute top-5 left-5 md:top-6 md:left-6 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </div>
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
            <span className="font-display font-light text-3xl md:text-5xl text-white tracking-[-0.02em] lowercase">
              {project.title.toLowerCase()}
            </span>
          </div>
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <h3 className="font-display font-light text-base md:text-lg tracking-[-0.01em]">
            {project.title}
            <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              · {project.year}
            </span>
          </h3>
          <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-muted text-right max-w-xs">
            {project.tagline}
          </p>
        </div>
      </Wrapper>
    </motion.div>
  );
}
