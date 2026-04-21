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
                Outside of design, I&apos;m really into physics, AI tools, and
                building personal automations and processes that make life and
                work easier. I also enjoy learning from the way product
                designers think about systems, usability, and digital
                experiences.
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
