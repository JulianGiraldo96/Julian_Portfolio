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
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis = lenis;

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
      // wait a tick so sections mount
      requestAnimationFrame(() => scrollToHash(window.location.hash, true));
    }

    const onHash = () => scrollToHash(window.location.hash);
    window.addEventListener("hashchange", onHash);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("hashchange", onHash);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
