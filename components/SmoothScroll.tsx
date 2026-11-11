"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Respect reduced-motion: skip smooth scrolling entirely
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis = lenis;

    const cleanups: (() => void)[] = [];
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Handle initial hash after page load / navigation
    const scrollToHash = (hash: string, immediate = false) => {
      if (!hash || hash === "#top") {
        lenis.scrollTo(0, { immediate });
        return;
      }
      const el = document.querySelector(hash);
      if (el) lenis.scrollTo(el as HTMLElement, { offset: -20, immediate });
    };

    if (window.location.hash) {
      // wait a tick so sections mount, then once more after the entrances
      // have run: they grow the page, and the first landing comes up short
      requestAnimationFrame(() => scrollToHash(window.location.hash, true));
      const again = setTimeout(() => {
        lenis.resize();
        scrollToHash(window.location.hash, true);
      }, 700);
      cleanups.push(() => clearTimeout(again));
    }

    const onHash = () => scrollToHash(window.location.hash);
    window.addEventListener("hashchange", onHash);

    return () => {
      cleanups.forEach((fn) => fn());
      cancelAnimationFrame(rafId);
      window.removeEventListener("hashchange", onHash);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
