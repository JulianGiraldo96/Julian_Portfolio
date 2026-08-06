"use client";

import { useCallback, useSyncExternalStore } from "react";

/* Light and dark for the whole site. The attribute lives on <html> so every
   subtree can key off it, and the tokens it drives are scoped to .v2-root,
   which every page root carries. */

const KEY = "v2-theme";
const ATTR = "data-v2-theme";

/* Runs before the v2 tree paints, so the chosen theme is already on <html>
   and there is no white flash on a dark reload. Kept as a string: it has to
   execute inline, ahead of hydration. */
export const themeBootstrap = `(function(){try{var t=localStorage.getItem('${KEY}');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('${ATTR}',t)}catch(e){document.documentElement.setAttribute('${ATTR}','light')}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />;
}

/* The goo filter the switch is built on. Rendered once per page: blur the two
   shapes together, then ramp the alpha hard so the blurred overlap snaps back
   into a solid edge. */
export function GooDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        <filter id="v2-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -11"
          />
        </filter>
      </defs>
    </svg>
  );
}

/* <html data-v2-theme> is the single source of truth: the bootstrap script has
   already written it before React runs, so the component subscribes to the
   attribute rather than keeping a second copy of the state that would have to
   be synced back in an effect. */
const EVENT = "v2themechange";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

function getSnapshot() {
  return document.documentElement.getAttribute(ATTR) === "dark";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, getSnapshot, () => false);

  const toggle = useCallback(() => {
    const value =
      document.documentElement.getAttribute(ATTR) === "dark" ? "light" : "dark";
    document.documentElement.setAttribute(ATTR, value);
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* private mode: the choice just does not persist */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      onClick={toggle}
      data-on={dark}
      className={`v2-switch ${className}`}
    >
      <span aria-hidden className="v2-switch__goo">
        <span className="v2-switch__blob" />
        <span className="v2-switch__drop" />
      </span>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="v2-switch__icon v2-switch__icon--sun"
      >
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M19.1 4.9l-1.5 1.5M6.4 17.6l-1.5 1.5" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="v2-switch__icon v2-switch__icon--moon"
      >
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
      </svg>
    </button>
  );
}
