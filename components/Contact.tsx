"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const socials = [
  { label: "Email", href: "mailto:hello@juliangiraldo.com" },
  { label: "Instagram", href: "#" },
];

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });
  const headingBlur = useTransform(scrollYProgress, [0, 0.6, 1], [24, 0, 0]);
  const headingFilter = useTransform(headingBlur, (v) => `blur(${v}px)`);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative px-6 md:px-10 pt-24 md:pt-40 pb-10 border-t border-border overflow-hidden"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-8">
          <span className="text-foreground">[ 03 ]</span>
          <span className="mx-3 opacity-40">/</span>
          contact
        </div>
        <motion.h2
          style={{ filter: headingFilter, opacity }}
          className="font-display font-extralight uppercase tracking-[-0.045em] leading-[0.88] text-[clamp(4rem,17vw,16rem)] will-change-[filter,opacity]"
          aria-label="Get in touch"
        >
          <span className="block">Get in</span>
          <span className="block">touch</span>
        </motion.h2>

        <div className="mt-16 md:mt-24 flex flex-col md:flex-row md:items-end md:justify-between gap-10 border-t border-border pt-8">
          <ul className="flex flex-wrap gap-8 font-mono text-[11px] md:text-xs uppercase tracking-[0.18em]">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  data-cursor-hover
                  className="group inline-flex items-baseline gap-1 hover:text-muted transition-colors"
                >
                  <span className="relative">
                    {s.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-500 group-hover:w-full" />
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            © {new Date().getFullYear()} · julian giraldo · v.2026.04
          </span>
        </div>
      </div>
    </section>
  );
}

