"use client";

import { LayoutGroup, MotionConfig } from "motion/react";
import { TopBar } from "./TopBar";
import { Footer } from "./Footer";
import { ProductWork } from "./ProductRows";
import { DesignWork, designCount } from "./DesignWork";
import { DesignRecord } from "./Showcase";
import { academic, professional } from "./projects";

/* The two work pages share one shell: the top bar, a short head that says
   which kind of work this is and how much of it there is, the work itself,
   and the contact footer, so "Contact" in the bar lands on this page. The
   head is CSS keyframes, not motion, for the same reason the home hero is:
   it is the first thing painted and should not wait for the bundle. */

const pad = (n: number) => String(n).padStart(2, "0");

function Head({
  eyebrow,
  count,
  title,
  children,
}: {
  eyebrow: string;
  count: number;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section aria-label="Introduction" className="pb-12 pt-12 md:pb-16 md:pt-20">
      <p className="v2-rise flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-secondary)]">
        <span>{eyebrow}</span>
        <span aria-hidden className="text-[var(--v2-label)]">&middot;</span>
        <span className="text-[var(--v2-label)]">{pad(count)}</span>
      </p>
      <h1 className="v2-rise v2-rise-1 mt-6 max-w-[18ch] text-balance font-display text-[clamp(2.2rem,4.6vw,4rem)] font-extralight leading-[1.04] tracking-[-0.045em]">
        {title}
      </h1>
      <p className="v2-rise v2-rise-2 mt-6 max-w-[560px] text-[16px] leading-relaxed text-[var(--v2-secondary)] md:text-[17px]">
        {children}
      </p>
    </section>
  );
}

export function ProductDesignPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="v2-root font-sans">
        <TopBar />
        <main id="main" className="mx-auto max-w-[1240px] px-5 md:px-8">
          <Head
            eyebrow="Product design"
            count={professional.length + academic.length}
            title={
              <>
                Systems people use every day,{" "}
                <span className="font-normal">made calm</span>.
              </>
            }
          >
            B2B SaaS, internal tools and data heavy interfaces. Three shipped
            systems that run in production, and two university projects built
            the same way, from research to a working prototype.
          </Head>
          <section
            id="work"
            aria-label="Product design projects"
            className="scroll-mt-24 border-t border-[var(--v2-line)] pb-6 pt-10 md:pt-14"
          >
            <ProductWork />
          </section>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export function VisualWorkPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="v2-root font-sans">
        <TopBar />
        <main id="main" className="mx-auto max-w-[1240px] px-5 md:px-8">
          <Head
            eyebrow="Visual work"
            count={designCount}
            title={
              <>
                Brands, identities and the{" "}
                <span className="font-normal">pieces that carry them</span>.
              </>
            }
          >
            Logos, brand guides, social templates, print, film and app
            identities. The years as a graphic designer before product, and the
            identity work inside the product projects since.
          </Head>
          <section
            id="work"
            aria-label="Visual work"
            className="scroll-mt-24 border-t border-[var(--v2-line)] pb-6 pt-10 md:pt-14"
          >
            <LayoutGroup>
              <DesignRecord />
              <DesignWork />
            </LayoutGroup>
          </section>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
