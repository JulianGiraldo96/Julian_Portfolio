"use client";

import { useSyncExternalStore } from "react";

/* Whether the visitor is on a Mac, for the NotchTunes gift: a Mac gets the
   download up front, everyone else gets told it is a Mac app. An iPad asks
   for the desktop site with a Mac user agent, so a touch screen rules it
   out; an iPhone's says "like Mac OS X", so only "Macintosh" counts. The
   server and the first paint say no, so nothing flashes a download at a
   phone. */
const subscribe = () => () => {};

const read = () =>
  /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints < 2;

export function useIsMac() {
  return useSyncExternalStore(subscribe, read, () => false);
}
