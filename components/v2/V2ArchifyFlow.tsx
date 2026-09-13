"use client";

import { useEffect, useRef, useState } from "react";

/* Embeds an archify-generated diagram (its own toolbar, pan/zoom, trace
   animation) as a same-origin iframe with archify's own `?embed=1` mode,
   which hides its toolbar/header/cards and leaves just the diagram surface.
   That mode exists because the diagram's script owns the whole document it
   ships in (120+ getElementById calls, global keydown shortcuts, a single
   localStorage theme key) and was never built to run twice on one page or
   share a page with anything else, so an iframe boundary is load bearing,
   not a shortcut. `?theme=dark` matches the site's own always-dark rule
   without needing to reach into the iframe's document to set it.

   Height is measured from `document.body.scrollHeight`, not
   `documentElement.scrollHeight`: archify's page stretches `<html>` to
   fill its viewport (a normal full-page reset), so `documentElement`
   always reports back roughly whatever height it was just given, a
   circular reading that looks like a real measurement but isn't. `body`
   only ever grows to fit its actual content, which is the real target. */
export function V2ArchifyFlow({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(400);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;

    let observer: ResizeObserver | null = null;

    const measure = () => {
      const body = iframe.contentDocument?.body;
      if (!body) return;
      setHeight(body.scrollHeight);
    };

    const attach = () => {
      measure();
      const body = iframe.contentDocument?.body;
      if (body && "ResizeObserver" in window) {
        observer = new ResizeObserver(measure);
        observer.observe(body);
      }
    };

    /* React attaches this effect after paint, and a same-origin static file
       can finish loading before that: the "load" event may already have
       fired, so check readyState directly instead of only listening for it. */
    if (iframe.contentDocument?.readyState === "complete") {
      attach();
    } else {
      iframe.addEventListener("load", attach);
    }
    return () => {
      iframe.removeEventListener("load", attach);
      observer?.disconnect();
    };
  }, []);

  return (
    <iframe
      ref={ref}
      src={`${src}?embed=1&theme=dark`}
      title={title}
      style={{ height }}
      className="w-full rounded-[20px] border border-[var(--v2-line)]"
    />
  );
}
