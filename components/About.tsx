"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { RevealBlock } from "./RevealText";

const experiences = [
  {
    role: "Product Designer",
    company: "Duo Sicilian Ice Cream",
    location: "Berlin",
    period: "Oct 2024 — Present",
    body: [
      "Designed and shipped Duo's internal ERP from zero, used daily across nine locations and six departments.",
      "Owned the full process: discovery with each team, information architecture for 40+ document types, Figma wireframes, prototypes and high-fidelity UI.",
      "Designed a role-based access model so each user only sees the data they own.",
      "Built a three-state status system (ok / warn / critical) applied across inventory, deliveries, HR compliance and production.",
      "I also use the system daily as one of the operators, which gives me a continuous feedback loop with the rest of the team.",
    ],
  },
  {
    role: "Product Designer",
    company: "Cabezona Casa Creativa",
    location: "Bogotá (remote)",
    period: "Oct 2017 — Present",
    body: [
      "Lead designer for internal SaaS tools and client applications built from scratch.",
      "Designed the Taurus Ecosystem: a unified workspace combining CRM, knowledge base and encrypted chat tied to a single identity.",
      "Defined product strategy, user flows, IA and visual design for each module.",
      "Created pitch decks that turned technical decisions into a clear value story for stakeholders.",
    ],
  },
  {
    role: "Design Lead",
    company: "Greens Supermarket",
    location: "Swieqi, Malta",
    period: "Apr 2021 — Nov 2023",
    body: [
      "Designed and launched multiple brand websites for the supermarket chain.",
      "Led the visual identity system across photography, video, animation and packaging.",
      "Built design guidelines to keep output consistent across the creative team and parallel campaigns.",
    ],
  },
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const headingBlur = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [18, 0, 0, 18]
  );
  const headingFilter = useTransform(headingBlur, (v) => `blur(${v}px)`);

  return (
    <section
      ref={ref}
      id="about"
      className="relative px-6 md:px-10 pt-24 md:pt-40 pb-16 md:pb-24 border-t border-border"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 md:mb-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-6">
            <span className="text-foreground">[ 02 ]</span>
            <span className="mx-3 opacity-40">/</span>
            about
          </div>
          <motion.h2
            style={{ filter: headingFilter }}
            className="font-display font-extralight uppercase tracking-[-0.035em] text-[clamp(3rem,10vw,8rem)] leading-[0.9] will-change-[filter]"
          >
            About
          </motion.h2>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              // what I do
            </span>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-5 text-base md:text-lg leading-relaxed">
            <RevealBlock delay={0.05}>
              <p>
                I&apos;m{" "}
                <span className="font-medium">Julian Giraldo</span>, a
                Colombian visual and experience designer based in Berlin, with
                a strong interest in product design and UX/UI.
              </p>
            </RevealBlock>
            <RevealBlock delay={0.15}>
              <p className="text-muted">
                My background is mainly in visual identity, branding, video
                editing, and product design. I like creating work that looks
                good, feels clear, and actually makes sense for the people
                using it.
              </p>
            </RevealBlock>
            <RevealBlock delay={0.25}>
              <p className="text-muted">
                Outside of design, I&apos;m into physics, AI tools, and
                building automations that make work and life less annoying. I
                also spend a lot of time studying how product designers think
                about systems, usability, and digital experiences.
              </p>
            </RevealBlock>
          </div>

          <div className="col-span-12 md:col-span-4">
            <RevealBlock delay={0.1}>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-subtle">
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, #d4d4d0 0%, transparent 50%), radial-gradient(circle at 70% 70%, #a8a8a0 0%, transparent 55%), #e6e6e2",
                    backgroundSize: "200% 200%",
                  }}
                />
                <div className="absolute inset-0 flex items-end justify-between p-6 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/80">
                  <span>julian · 2026</span>
                  <span>IMG_001</span>
                </div>
              </div>
            </RevealBlock>
          </div>
        </div>

        <ExperienceList />
      </div>
    </section>
  );
}

function ExperienceList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-20 md:mt-28 grid grid-cols-12 gap-6 md:gap-10">
      <div className="col-span-12 md:col-span-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          // experience
        </span>
      </div>
      <div className="col-span-12 md:col-span-10 border-t border-border">
        {experiences.map((exp, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={exp.company} className="border-b border-border">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                data-cursor-hover
                className="w-full flex items-center justify-between gap-6 py-6 md:py-8 text-left group"
              >
                <div className="flex-1 flex flex-col md:flex-row md:items-baseline md:gap-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted md:w-16 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display font-light text-xl md:text-3xl tracking-[-0.01em] leading-tight">
                      {exp.role}
                    </h3>
                    <p className="mt-1 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-muted">
                      {exp.company} · {exp.location} · {exp.period}
                    </p>
                  </div>
                </div>
                <span className="relative w-6 h-6 shrink-0 flex items-center justify-center">
                  <span className="absolute h-px w-4 bg-foreground" />
                  <span
                    className={`absolute h-4 w-px bg-foreground transition-transform duration-300 ${isOpen ? "scale-y-0" : "scale-y-100"}`}
                  />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 md:pl-[5.5rem] space-y-3 max-w-3xl text-sm md:text-base leading-relaxed text-muted">
                      {exp.body.map((line, j) => (
                        <p key={j}>{line}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
