"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center px-6 md:px-10"
    >
      <div
        aria-hidden
        className="absolute top-24 left-6 md:left-10 font-mono text-[12px] uppercase tracking-[0.18em] text-muted leading-relaxed"
      >
        <div>[ index / 00 ]</div>
        <div>52.5200°N · 13.4050°E</div>
      </div>

      <div
        aria-hidden
        className="absolute top-24 right-6 md:right-10 font-mono text-[12px] uppercase tracking-[0.18em] text-muted leading-relaxed text-right"
      >
        <div>v.2026.04</div>
        <div>portfolio / jg</div>
      </div>

      <motion.div
        style={{ y, opacity, filter }}
        className="text-center w-full will-change-[filter,transform,opacity]"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-8 h-px w-16 bg-foreground/40 origin-left"
        />

        <h1
          className="font-display font-extralight uppercase tracking-[-0.04em] leading-[0.88] text-[clamp(3.5rem,14vw,13rem)]"
          aria-label="Julian Giraldo"
        >
          <BlurLine delay={0.35}>Julian</BlurLine>
          <BlurLine delay={0.65}>Giraldo</BlurLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-mono text-[12px] md:text-[13px] uppercase tracking-[0.22em] text-muted"
        >
          <span className="text-foreground">4 yrs</span> as Product Designer
          <span className="mx-3 opacity-40">·</span>
          <span className="text-foreground">8+ yrs</span> as designer
        </motion.p>

        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60 bg-foreground/5 border border-border px-3 py-1.5 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            open for work
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 font-mono text-[13px] md:text-sm uppercase tracking-[0.22em] text-muted"
        >
          <span className="text-foreground">role</span>
          <span className="mx-3 opacity-40">→</span>
          Product Designer
          <span className="mx-3 opacity-40">·</span>
          <span className="text-foreground">loc</span>
          <span className="mx-3 opacity-40">→</span>
          Berlin, DE
        </motion.p>

        <motion.a
          href="mailto:application@juliang.de"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          data-cursor-hover
          className="mt-4 inline-block font-mono text-[13px] md:text-sm lowercase tracking-[0.18em] text-foreground/70 hover:text-foreground transition-colors border-b border-transparent hover:border-foreground/40 pb-0.5"
        >
          application@juliang.de
        </motion.a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[12px] uppercase tracking-[0.25em] text-muted"
      >
        <span>scroll ↓</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block h-5 w-px bg-foreground/30"
        />
      </motion.div>
    </section>
  );
}

function BlurLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: "40%", filter: "blur(24px)" }}
      animate={{ opacity: 1, y: "0%", filter: "blur(0px)" }}
      transition={{ duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] }}
      className="block will-change-[filter,transform,opacity]"
    >
      {children}
    </motion.span>
  );
}
