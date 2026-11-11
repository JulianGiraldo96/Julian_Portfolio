"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  /* Lenis lives in the root layout, so it outlives every navigation and
     keeps whatever scroll it was easing toward on the page that just left.
     Next scrolls the new page to the top, and on the next frame Lenis
     writes its old target back: a case opened from far down the home page
     came in ~1900px down. On every route change Lenis is told where the
     new page starts, immediately, which also cancels the easing in flight. */
  /* A trackpad keeps sending wheel events for a second or so after the
     fingers lift (inertia). Clicked mid swipe, those events arrived on the
     new page and carried it 1000px or more down. So Lenis is held still
     (which also cancels the wheel events) until the wheel has been quiet
     for a beat, and lets go after 2s whatever happens. */
  useEffect(() => {
    const lenis = window.__lenis;
    if (!lenis) return;
    const hash = window.location.hash;
    const el = hash ? document.querySelector<HTMLElement>(hash) : null;
    lenis.stop();
    lenis.resize();
    if (el) lenis.scrollTo(el, { offset: -20, immediate: true, force: true });
    else lenis.scrollTo(0, { immediate: true, force: true });

    let quiet = 0;
    let done = false;
    function release() {
      if (done) return;
      done = true;
      window.clearTimeout(quiet);
      window.clearTimeout(cap);
      window.removeEventListener("wheel", onWheel);
      lenis?.start();
    }
    function onWheel() {
      window.clearTimeout(quiet);
      quiet = window.setTimeout(release, 160);
    }
    const cap = window.setTimeout(release, 2000);
    quiet = window.setTimeout(release, 160);
    window.addEventListener("wheel", onWheel, { passive: true });
    return release;
  }, [pathname]);

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
