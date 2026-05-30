"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import Image from "next/image";
import { RevealBlock } from "./RevealText";

const experiences = [
  {
    role: "Product Designer",
    company: "Duo Sicilian Ice Cream",
    location: "Berlin",
    period: "Oct 2024 – Present",
    body: [
      "Designed and shipped Duo's internal ERP from zero, used daily across 9 locations and 6 departments (operations, logistics, production, HR, finance, management).",
      "End-to-end ownership: discovery interviews, information architecture for 40+ document types, wireframes, Figma prototypes, high-fidelity UI, design system, dev handoff, post-launch iteration.",
      "Designed a role-based access model with six distinct roles, reducing onboarding time by ~30% and eliminating accidental cross-module edits.",
      "Built a three-state status system (ok / warn / critical) applied consistently across inventory, expiring items, HR compliance, deliveries, and production.",
      "Shipped 13 modules: dashboard, inventory, flavours & stock, expiring items, movements, orders, deliveries, logistics GPS, suppliers, production, staff, reports, settings.",
    ],
  },
  {
    role: "Product Designer",
    company: "TaurusWebs",
    location: "Bogotá (remote)",
    period: "Feb 2019 – Present",
    freelance: true,
    body: [
      "Lead designer for custom internal platforms and client-facing applications, built from scratch.",
      "Designed the Taurus Ecosystem: a unified internal workspace combining CRM (Twenty), knowledge base (AppFlowy) and encrypted chat (Matrix), tied through a single SSO. Owned discovery, IA, user flows, Figma UI, prototype and stakeholder pitch.",
      "Translated complex technical decisions (data sovereignty, hosting, security) into product narratives non-technical stakeholders could approve.",
      "Led brand identity, web design and creative direction for client work spanning Latin America and the USA.",
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
                data-heavy interfaces, with <b className="text-foreground">7+ years as a Product Designer</b> and <b className="text-foreground">8+ years as a designer overall</b>. The kind of work where dense information
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
                Berlin, with <b className="text-foreground">8+ years</b> across product, brand and visual design.
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
                <Image
                  src="/julian-portrait.webp"
                  alt="Julian Giraldo, Berlin"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex items-end justify-between p-6 font-mono text-[12px] uppercase tracking-[0.22em] text-white/80">
                  <span>julian · berlin</span>
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
