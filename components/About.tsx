"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { RevealBlock } from "./RevealText";

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
      </div>
    </section>
  );
}
