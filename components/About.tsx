"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { RevealBlock } from "./RevealText";

const experiences = [
  {
    role: "Product Designer",
    company: "Duo Sicilian Ice Cream",
    location: "Berlin",
    period: "Oct 2024 – Present",
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
    company: "TaurusWebs",
    location: "Bogotá (remote)",
    period: "Feb 2019 – Present",
    freelance: true,
    body: [
      "Freelance lead designer for internal SaaS tools and client applications built from scratch.",
      "Designed the Taurus Ecosystem: a unified workspace combining CRM (Twenty), knowledge base (AppFlowy) and encrypted chat (Matrix) tied to a single SSO identity.",
      "Translated complex technical and infrastructure decisions into clear product narratives for non-technical stakeholders.",
      "Led brand identity, web design and creative direction for client work across Latin America and the USA.",
    ],
  },
  {
    role: "Senior Graphic Designer / Lead Designer",
    company: "Greens Group (Greens · Fresh To Go · Blok Foods)",
    location: "Swieqi, Malta",
    period: "Aug 2019 – Nov 2023",
    body: [
      "Led visual identity and digital design across three food brands under Greens Group. Promoted from Graphic Designer (Aug 2019 – Aug 2021) to Senior Graphic Designer (Sep 2021 – Nov 2023). Lead Designer on contract for Blok Foods (Feb 2022 – Nov 2023).",
      "Designed and launched multiple brand websites, from concept to live deployment.",
      "Built a multi-channel design system across web, photography, video, animation, packaging and in-store communications.",
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

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      ref={ref}
      id="about"
      className="relative px-6 md:px-10 pt-24 md:pt-40 pb-16 md:pb-24 border-t border-border"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 md:mb-16">
          <div className="font-mono text-[13px] uppercase tracking-[0.22em] text-muted mb-6">
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
            <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-muted">
              // what I do
            </span>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-5 text-base md:text-lg leading-relaxed">
            <RevealBlock delay={0.05}>
              <p>
                I&apos;m{" "}
                <span className="font-medium">Julian Giraldo</span>, a Product
                Designer based in Berlin focused on B2B SaaS, internal tools and
                data-heavy interfaces. The kind of work where dense information
                has to feel calm and usable.
              </p>
            </RevealBlock>
            <RevealBlock delay={0.15}>
              <p className="text-muted">
                My differentiator: I design products I also use myself. The ERP
                I designed at Duo Sicilian Ice Cream is in daily production
                across nine locations and six departments, and I&apos;m one of
                the operators using it. That feedback loop is hard to fake.
              </p>
            </RevealBlock>
            <RevealBlock delay={0.25}>
              <p className="text-muted">
                I work end-to-end: research, information architecture, Figma,
                design systems, prototyping and shipping with engineering. I
                hold a Master&apos;s in Visual and Experience Design from UE
                Berlin, with 8+ years across product, brand and visual design.
              </p>
            </RevealBlock>
            <RevealBlock delay={0.35}>
              <p className="text-muted">
                Outside of design, I&apos;m into physics, AI tools and building
                small automations that make work and life less annoying.
              </p>
            </RevealBlock>

            <RevealBlock delay={0.45}>
              <div className="pt-8 mt-2 border-t border-border">
                <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-muted">
                  // experience
                </span>
                <div className="mt-4">
                  {experiences.map((exp, i) => {
                    const isOpen = openIndex === i;
                    return (
                      <div key={exp.company} className="border-b border-border">
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : i)}
                          data-cursor-hover
                          className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                        >
                          <div className="flex-1">
                            <h3 className="font-display font-light text-lg md:text-2xl tracking-[-0.01em] leading-tight flex items-center gap-3 flex-wrap">
                              {exp.role}
                              {exp.freelance && (
                                <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted border border-border px-2 py-0.5 rounded-full">
                                  Freelance
                                </span>
                              )}
                            </h3>
                            <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
                              {exp.company} · {exp.location} · {exp.period}
                            </p>
                          </div>
                          <span className="relative w-5 h-5 shrink-0 flex items-center justify-center">
                            <span className="absolute h-px w-3.5 bg-foreground" />
                            <span
                              className={`absolute h-3.5 w-px bg-foreground transition-transform duration-300 ${isOpen ? "scale-y-0" : "scale-y-100"}`}
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
                              <div className="pb-6 space-y-3 text-sm md:text-base leading-relaxed text-muted">
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
                <div className="absolute inset-0 flex items-end justify-between p-6 font-mono text-[12px] uppercase tracking-[0.22em] text-foreground/80">
                  <span>julian · 2026</span>
                  <span>IMG_001</span>
                </div>
              </div>
            </RevealBlock>
          </div>
        </div>
      </div>
    </section>
  );
}
