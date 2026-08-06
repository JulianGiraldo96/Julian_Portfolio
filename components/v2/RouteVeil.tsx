"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/* Why this exists.
   The old hand-off was: the card portals a veil onto <body>, pushes the route,
   and then unmounts along with the page it lived on. The veil went with it,
   which left a frame or two of bare <body> before the next page painted, and
   <body> is white in every theme. That is the white flash.

   This veil lives in the ROOT layout, so it outlives every navigation. A card
   asks for it, it covers the page, the route changes underneath it, and it
   fades out once the new path has landed. Nothing is ever uncovered mid swap. */

type Listener = () => void;

let leaving = false;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

/* Called by a card the moment it is clicked. `dark` decides whether the page
   is covered in light or in ink, so the veil matches what is underneath. */
export function startRouteVeil() {
  leaving = true;
  emit();
}

function subscribe(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/* matches the .v2-veil transition in globals.css */
const FADE_MS = 340;

const getSnapshot = () => leaving;
const getServerSnapshot = () => false;

export function RouteVeil() {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const pathname = usePathname();
  const startedAt = useRef<string | null>(null);
  const [visible, setVisible] = useState(false);

  /* Fade in as soon as a card asks. */
  useEffect(() => {
    if (!active) return;
    startedAt.current = pathname;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  /* Fade out once the path has actually changed, which is the first moment the
     new page is on screen behind the veil.

     The release is two steps on purpose. Clearing `leaving` unmounts this
     component, so doing it in the same tick as `setVisible(false)` cuts the
     veil rather than fading it: the element is gone before its own transition
     can run. So the opacity goes first and the unmount waits for it. */
  const release = useCallback(() => {
    setVisible(false);
    window.setTimeout(() => {
      leaving = false;
      startedAt.current = null;
      emit();
    }, FADE_MS);
  }, []);

  useEffect(() => {
    if (!active || startedAt.current === null || startedAt.current === pathname) return;
    const id = window.setTimeout(release, 90);
    return () => window.clearTimeout(id);
  }, [pathname, active, release]);

  /* A stuck veil would lock the whole site behind a blur, so it always lets go
     on its own even if a navigation never lands. */
  useEffect(() => {
    if (!active) return;
    const id = window.setTimeout(release, 2500);
    return () => window.clearTimeout(id);
  }, [active, release]);

  if (!active && !visible) return null;

  return (
    <div
      aria-hidden
      className="v2-veil pointer-events-none fixed inset-0 z-[200] backdrop-blur-2xl backdrop-saturate-125"
      data-on={visible}
    />
  );
}
