"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const socials = [
  {
    label: "Email",
    href: "mailto:application@juliang.de",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 7 10-7" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/julian-gr/",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "CV",
    href: "#",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
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

        <div className="flex items-center justify-between gap-8">
          <motion.h2
            style={{ filter: headingFilter, opacity }}
            className="font-display font-extralight uppercase tracking-[-0.045em] leading-[0.88] text-[clamp(3rem,13vw,12rem)] will-change-[filter,opacity]"
            aria-label="Get in touch"
          >
            <span className="block">Get in</span>
            <span className="block">touch</span>
          </motion.h2>

          <motion.div
            style={{ opacity }}
            className="flex-1 flex flex-col items-center justify-center gap-4"
          >
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                data-cursor-hover
                className="group relative w-64 inline-flex items-center justify-center gap-2.5 font-mono text-xs md:text-sm uppercase tracking-[0.18em] border border-border px-6 py-4 hover:border-foreground hover:text-foreground text-muted transition-all duration-300"
              >
                {s.icon}
                {s.label}
                <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
              </a>
            ))}
          </motion.div>
        </div>

        <div className="mt-16 md:mt-24 flex flex-col md:flex-row md:items-end md:justify-end gap-10 border-t border-border pt-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            © {new Date().getFullYear()} · julian giraldo · v.2026.04
          </span>
        </div>
      </div>
    </section>
  );
}
