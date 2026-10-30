"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/* Pip: a small pixel character who lives along the bottom of every page.

   He is drawn, not loaded: each pose is composed on an 18 by 20 pixel grid
   (head, body, legs, arms, face), the outline is worked out from the shape,
   and the result becomes three SVG paths (line, fill, shade) whose colours
   come from CSS, so he is white-lined and dark inside on the dark theme and
   the other way round on the light one.

   He runs on one requestAnimationFrame loop that writes only a transform and,
   when the pose changes, three path strings; React renders him once. The loop
   stops while the tab is hidden.

   What he does, roughly in order of how often:
   - idles, blinks, glances at the cursor and turns to face it;
   - walks to somewhere else along the bottom, sits, waves;
   - jumps onto a heading or an image on screen and rides it as the page
     scrolls, then falls off when it scrolls away or walks off its edge;
   - falls asleep when nobody has touched anything for a while, and wakes up
     when the cursor comes close;
   - talks when clicked, about the page he is on;
   - gets annoyed when poked again and again, stomps, and finally leaves the
     screen for a few seconds;
   - can be picked up and dragged (he dangles), gets dizzy when shaken, and
     can be thrown: he lands, and lands badly if thrown hard;
   - likes being petted (move the cursor back and forth over him);
   - notices fast scrolling, the theme switch, the email being copied, the
     bottom of the page, and you coming back to the tab.

   With reduced motion he stays put in the corner and only talks. */

const GW = 18;
const GH = 20;
const FLOOR_GAP = 6;
const HEADER = 72;
const G = 2200;

type Face = "normal" | "blink" | "angry" | "happy" | "sleep" | "surprised" | "dizzy" | "squint";
type Legs = "stand" | "walkA" | "walkB" | "walkC" | "sit" | "dangle" | "crouch" | "air" | "stomp";
type Arms = "none" | "waveUp" | "waveMid" | "up" | "hips";
type Pose = { face: Face; legs: Legs; arms: Arms; bob?: number; lookX?: number; lookY?: number; mouth?: boolean; lie?: boolean };

/* ---------- drawing ---------- */

function compose(p: Pose) {
  // 0 empty, 1 fill, 2 line, 3 shade, 4 collar (half line, half fill)
  const g = new Uint8Array(GW * GH);
  const fill = new Uint8Array(GW * GH);
  const at = (x: number, y: number) => y * GW + x;
  const inb = (x: number, y: number) => x >= 0 && y >= 0 && x < GW && y < GH;
  const ell = (cx: number, cy: number, rx: number, ry: number) => {
    for (let y = 0; y < GH; y++)
      for (let x = 0; x < GW; x++) {
        const dx = (x + 0.5 - cx) / rx;
        const dy = (y + 0.5 - cy) / ry;
        if (dx * dx + dy * dy <= 1) fill[at(x, y)] = 1;
      }
  };
  const rect = (x0: number, y0: number, x1: number, y1: number) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inb(x, y)) fill[at(x, y)] = 1;
  };
  const dot = (x: number, y: number) => {
    if (inb(x, y)) g[at(x, y)] = 2;
  };

  // proportions after the reference: a big round head, a short body as wide
  // as most of the head, and two stubby legs split by a one pixel notch
  let cx = 9;
  let cy = 6;
  let collar = -1;
  if (p.lie) {
    // lying on his front, head to the left
    ell(5, 13.5, 4.3, 3.9);
    rect(9, 12, 14, 16);
    rect(15, 12, 16, 13);
    rect(15, 15, 16, 16);
    cx = 5;
    cy = 13.5;
  } else {
    const bob = p.bob ?? 0;
    const low = p.legs === "sit" ? 2 : p.legs === "crouch" ? 2 : 0;
    cy = 6 + bob + low;
    ell(cx, cy, 4.9, 4.5);
    rect(6, 10 + bob + low, 12, 14);
    collar = 10 + bob + low;
    switch (p.legs) {
      case "stand":
        rect(6, 15, 8, 16);
        rect(10, 15, 12, 16);
        break;
      case "walkA":
        rect(5, 15, 7, 15);
        rect(11, 15, 13, 16);
        break;
      case "walkB":
        rect(7, 15, 8, 16);
        rect(10, 15, 11, 16);
        break;
      case "walkC":
        rect(5, 15, 7, 16);
        rect(11, 15, 13, 15);
        break;
      case "sit":
        rect(10, 15, 15, 16);
        break;
      case "dangle":
        rect(6, 15, 8, 18);
        rect(10, 15, 12, 18);
        break;
      case "crouch":
        rect(5, 15, 8, 16);
        rect(10, 15, 13, 16);
        break;
      case "air":
        rect(5, 15, 7, 15);
        rect(11, 15, 13, 15);
        break;
      case "stomp":
        rect(6, 15, 8, 16);
        rect(10, 14, 12, 14);
        break;
    }
    switch (p.arms) {
      case "waveUp":
        rect(13, 6, 14, 10);
        break;
      case "waveMid":
        rect(13, 10, 14, 11);
        rect(15, 9, 15, 9);
        break;
      case "up":
        rect(3, 4, 4, 9);
        rect(14, 4, 15, 9);
        break;
      case "hips":
        rect(5, 11, 5, 12);
        rect(13, 11, 13, 12);
        break;
    }
  }

  // line: every empty pixel touching the shape; shade: the shape's right and
  // lower inside edge, where the light from the upper left does not reach
  for (let y = 0; y < GH; y++)
    for (let x = 0; x < GW; x++) {
      const i = at(x, y);
      if (fill[i]) {
        const rEdge = !inb(x + 1, y) || !fill[at(x + 1, y)];
        const bEdge = !inb(x, y + 1) || !fill[at(x, y + 1)];
        g[i] = (rEdge || bEdge) && y > (p.lie ? 11 : cy + 1) ? 3 : 1;
        continue;
      }
      const n =
        (inb(x - 1, y) && fill[at(x - 1, y)]) ||
        (inb(x + 1, y) && fill[at(x + 1, y)]) ||
        (inb(x, y - 1) && fill[at(x, y - 1)]) ||
        (inb(x, y + 1) && fill[at(x, y + 1)]);
      if (n) g[i] = 2;
    }

  // a line where the head sits on the body, as in the reference
  if (collar >= 0) for (let x = 6; x <= 12; x++) if (fill[at(x, collar)]) g[at(x, collar)] = 4;

  // the face
  if (p.lie) {
    dot(3, 13);
    dot(3, 14);
  } else {
    const lx = p.lookX ?? 0;
    const ly = p.lookY ?? 0;
    const ey = Math.round(cy) - 1 + ly;
    const eyes = [7 + lx, 11 + lx];
    for (const e of eyes) {
      switch (p.face) {
        case "normal":
          dot(e, ey);
          dot(e, ey + 1);
          break;
        case "blink":
        case "sleep":
          dot(e, ey + 1);
          dot(e - 1 + (e === eyes[0] ? 0 : 1), ey + 1);
          break;
        case "happy":
          dot(e - 1, ey + 1);
          dot(e, ey);
          dot(e + 1, ey + 1);
          break;
        case "angry":
          dot(e, ey);
          dot(e, ey + 1);
          dot(e === eyes[0] ? e - 1 : e + 1, ey - 2);
          dot(e, ey - 1);
          break;
        case "surprised":
          dot(e, ey - 1);
          dot(e, ey);
          dot(e, ey + 1);
          break;
        case "dizzy":
          dot(e - 1, ey - 1);
          dot(e + 1, ey - 1);
          dot(e, ey);
          dot(e - 1, ey + 1);
          dot(e + 1, ey + 1);
          break;
        case "squint":
          dot(e === eyes[0] ? e - 1 : e + 1, ey);
          dot(e, ey + 1);
          dot(e === eyes[0] ? e - 1 : e + 1, ey + 2);
          break;
      }
    }
    if (p.mouth) {
      dot(9 + lx, ey + 3);
      dot(10 + lx, ey + 3);
    }
  }

  // drawn on a grid twice as fine, so the outline can be half a pixel: an
  // outline cell keeps only the half that touches the shape, the collar is
  // half a pixel too, and the face stays whole pixels
  const W2 = GW * 2;
  const H2 = GH * 2;
  const g2 = new Uint8Array(W2 * H2);
  const filled2 = (sx: number, sy: number) => sx >= 0 && sy >= 0 && sx < W2 && sy < H2 && fill[at(sx >> 1, sy >> 1)] === 1;
  for (let y = 0; y < GH; y++)
    for (let x = 0; x < GW; x++) {
      const v = g[at(x, y)];
      if (!v) continue;
      for (let j = 0; j < 2; j++)
        for (let k = 0; k < 2; k++) {
          const sx = x * 2 + k;
          const sy = y * 2 + j;
          if (v === 4) g2[sy * W2 + sx] = j === 0 ? 2 : 1;
          else if (v === 2 && !fill[at(x, y)]) {
            if (filled2(sx - 1, sy) || filled2(sx + 1, sy) || filled2(sx, sy - 1) || filled2(sx, sy + 1)) g2[sy * W2 + sx] = 2;
          } else g2[sy * W2 + sx] = v;
        }
    }
  const paths = ["", "", ""];
  for (let y = 0; y < H2; y++) {
    let x = 0;
    while (x < W2) {
      const v = g2[y * W2 + x];
      if (!v) {
        x++;
        continue;
      }
      let e = x;
      while (e + 1 < W2 && g2[y * W2 + e + 1] === v) e++;
      paths[v === 2 ? 0 : v === 1 ? 1 : 2] += `M${x / 2} ${y / 2}h${(e - x + 1) / 2}v.5h${-(e - x + 1) / 2}z`;
      x = e + 1;
    }
  }
  return paths as [string, string, string];
}

const cache = new Map<string, [string, string, string]>();
function sprite(p: Pose) {
  const key = JSON.stringify(p);
  let s = cache.get(key);
  if (!s) {
    s = compose(p);
    cache.set(key, s);
  }
  return s;
}

/* ---------- what he says ---------- */

const PAGE_LINES: [string, string[]][] = [
  ["/work/erp-duo", ["Thirteen modules. Nine locations. One ERP.", "This one runs an ice cream company."]],
  ["/work/scan-memory", ["It remembers every unit scanned. I forget everything.", "Around 35% fewer inventory errors with this one."]],
  ["/work/taurus", ["Farm setup went from six hours to one.", "A bulk table for whole farms."]],
  ["/work/savee", ["A meal planner that hates food waste.", "I only eat pixels. Zero waste."]],
  ["/work/meinerva", ["Look first. Then read the hint.", "An art companion. I'm art too, right?"]],
  ["/design/camelwebs", ["Llamas! Well, a llama logo.", "171 icons, one stroke weight."]],
  ["/notchtunes", ["Music in the notch. Free for Mac.", "Go on, hover the notch."]],
  ["/design", ["So much design in here."]],
  ["/", ["Hi, I'm Pip. I live down here.", "Scroll down. The work is the good part.", "Psst. The ERP case is the big one."]],
];
const CHATTER = [
  "Julian is open to Product Design roles in Berlin or remote.",
  "The CV is down in the footer.",
  "I'm 18 by 20 pixels of pure charm.",
  "You can pick me up. Gently.",
  "I climb on things. Watch me.",
  "Try the theme switch. I glow.",
];
const POKES = ["Yes?", "Hehe, that tickles.", "Okay, that's enough.", "Stop poking me!", "I'm not a button!!", "That's it. I'm out."];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const linesFor = (path: string) => (PAGE_LINES.find(([p]) => (p === "/" ? path === "/" : path.startsWith(p)))?.[1] ?? ["Nice page."]);

type Mode =
  | "idle" | "walk" | "run" | "sit" | "sleep" | "wave" | "crouch" | "air" | "drag"
  | "angry" | "trip" | "stretch" | "dizzy" | "pet" | "away" | "look";

export function Buddy() {
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const pLine = useRef<SVGPathElement>(null);
  const pFill = useRef<SVGPathElement>(null);
  const pShade = useRef<SVGPathElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const emoteBox = useRef<HTMLDivElement>(null);
  const api = useRef<{ route: (p: string) => void } | null>(null);

  useEffect(() => {
    pathRef.current = pathname;
    api.current?.route(pathname);
  }, [pathname]);

  useEffect(() => {
    const el = root.current;
    const bd = body.current;
    const bub = bubble.current;
    const emo = emoteBox.current;
    if (!el || !bd || !bub || !emo) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let S = window.innerWidth < 640 ? 2.5 : 3;
    const wpx = () => (GW + 2) * S;
    const floorY = () => (window.visualViewport?.height ?? window.innerHeight) - FLOOR_GAP;

    // state
    let x = window.innerWidth - 90;
    let y = floorY();
    let vx = 0;
    let vy = 0;
    let face = -1; // -1 facing left, 1 right
    let mode: Mode = "idle";
    let modeT = 0;
    let modeLen = 2;
    let target = x;
    let ground: Element | null = null;
    let jumpTarget: Element | null = null;
    let anger = 0;
    let pokes = 0;
    let lastPoke = 0;
    let lastInput = performance.now();
    let lastTalk = 0;
    let talking = 0;
    let lookX = 0;
    let lookY = 0;
    let blinkAt = performance.now() + 2000;
    let blinkUntil = 0;
    let behindSince = 0;
    let poseKey = "";
    let rot = 0;
    let awayUntil = 0;
    let lastScrollY = window.scrollY;
    let scrollV = 0;
    let lastWhoa = 0;
    let saidBottom = "";
    let hiddenAt = 0;
    let petDist = 0;
    let petAt = 0;
    let lastPetX = 0;
    let dragHold = 0;
    let shake = 0;
    let lastDvx = 0;
    const cursor = { x: -1e4, y: -1e4, vx: 0, t: 0 };
    const drag = { on: false, pending: false, sx: 0, sy: 0, ox: 0, oy: 0, px: 0, py: 0, pvx: 0, pvy: 0, t: 0, id: 0 };

    const setMode = (m: Mode, len = 0) => {
      mode = m;
      modeT = 0;
      modeLen = len;
    };

    /* speech */
    let typeTimer = 0;
    let hideTimer = 0;
    const say = (text: string, force = false) => {
      const now = performance.now();
      if (!force && now - lastTalk < 1200) return;
      lastTalk = now;
      window.clearInterval(typeTimer);
      window.clearTimeout(hideTimer);
      bub.textContent = "";
      bub.dataset.on = "1";
      let i = 0;
      talking = now + text.length * 32 + 200;
      typeTimer = window.setInterval(() => {
        i++;
        bub.textContent = text.slice(0, i);
        if (i >= text.length) window.clearInterval(typeTimer);
      }, reduced ? 1 : 32);
      hideTimer = window.setTimeout(() => {
        delete bub.dataset.on;
      }, 2200 + text.length * 50);
    };

    /* little symbols over his head */
    const emote = (glyph: string) => {
      const s = document.createElement("span");
      s.className = "buddy-emote";
      s.textContent = glyph;
      s.style.left = `${(Math.random() - 0.5) * 10}px`;
      emo.appendChild(s);
      window.setTimeout(() => s.remove(), 1100);
    };

    /* surfaces he can stand on: headings and images in the page */
    const platforms = () => {
      const out: Element[] = [];
      document
        .querySelectorAll("main h1, main h2, main h3, main img, main video, main figure, main a[href^='/work/'], main a[href^='/design/'], main [data-buddy-platform]")
        .forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.width > 120 && r.top > HEADER + 40 && r.top < floorY() - 70 && r.left > -10 && r.right < window.innerWidth + 10) out.push(n);
      });
      return out;
    };

    const tryJump = () => {
      const list = platforms().filter((n) => n !== ground);
      if (!list.length) return false;
      const t = pick(list);
      const r = t.getBoundingClientRect();
      const tx = Math.min(r.right - 24, Math.max(r.left + 24, x + (Math.random() - 0.5) * 200));
      const disp = r.top - y; // negative: up
      if (disp < -600 || disp > -20 || Math.abs(scrollV) > 200) return false;
      const h = -disp + 50 + Math.random() * 30;
      const v0 = -Math.sqrt(2 * G * h);
      const tt = (-v0 + Math.sqrt(v0 * v0 + 2 * G * disp)) / G;
      const nvx = (tx - x) / tt;
      if (!isFinite(nvx) || Math.abs(nvx) > 700) return false;
      jumpTarget = t;
      face = nvx >= 0 ? 1 : -1;
      vx = nvx;
      vy = v0;
      setMode("crouch", 0.18);
      return true;
    };

    const leaveScreen = () => {
      say(POKES[5], true);
      face = cursor.x > x ? -1 : 1;
      setMode("run");
      target = face > 0 ? window.innerWidth + 80 : -80;
    };

    /* decide what to do next when idle */
    const decide = () => {
      const now = performance.now();
      if (now - lastInput > 40000 && !ground) {
        setMode("sleep");
        return;
      }
      const r = Math.random();
      if (reduced) {
        setMode("idle", 3);
        return;
      }
      if (r < 0.4) {
        const lo = ground ? ground.getBoundingClientRect().left - 60 : 40;
        const hi = ground ? ground.getBoundingClientRect().right + 60 : window.innerWidth - 40;
        target = Math.max(40, Math.min(window.innerWidth - 40, lo + Math.random() * (hi - lo)));
        if (Math.abs(target - x) < 40) target = x + (Math.random() < 0.5 ? -80 : 80);
        setMode("walk");
      } else if (r < 0.5) setMode("sit", 4 + Math.random() * 5);
      else if (r < 0.78) {
        if (!tryJump()) setMode("look", 1.6);
      } else if (r < 0.8) setMode("wave", 1.4);
      else setMode("idle", 1.5 + Math.random() * 3);
    };

    const pose = (now: number): Pose => {
      const blink = now < blinkUntil;
      const mouth = now < talking && Math.floor(now / 110) % 2 === 0;
      const base: Face = blink ? "blink" : anger >= 3 ? "angry" : anger >= 2 ? "squint" : "normal";
      const walkCycle: Legs[] = ["walkA", "walkB", "walkC", "walkB"];
      switch (mode) {
        case "walk":
        case "run": {
          const fps = mode === "run" ? 14 : 8;
          const f = Math.floor(modeT * fps) % 4;
          return { face: mode === "run" && anger >= 3 ? "angry" : base, legs: walkCycle[f], arms: "none", bob: f % 2 ? -1 : 0, lookX: 1, mouth };
        }
        case "sit":
          return { face: base, legs: "sit", arms: "none", lookX, lookY, mouth };
        case "sleep":
          return { face: "sleep", legs: "stand", arms: "none", lie: true };
        case "trip":
          return { face: "dizzy", legs: "stand", arms: "none", lie: true };
        case "wave":
          return { face: "happy", legs: "stand", arms: Math.floor(modeT * 6) % 2 ? "waveUp" : "waveMid", mouth };
        case "crouch":
          return { face: base, legs: "crouch", arms: "none", lookX: 1 };
        case "air":
          return { face: vy < 0 ? "happy" : "surprised", legs: "air", arms: "up", lookX: 1 };
        case "drag":
          return { face: shake > 6 ? "dizzy" : anger >= 2 ? "angry" : "surprised", legs: "dangle", arms: "up", mouth };
        case "angry":
          return { face: "angry", legs: Math.floor(modeT * 8) % 2 ? "stomp" : "stand", arms: "hips", mouth };
        case "stretch":
          return { face: "blink", legs: "stand", arms: "up" };
        case "dizzy":
          return { face: "dizzy", legs: "stand", arms: "none", bob: Math.floor(modeT * 6) % 2 };
        case "pet":
          return { face: "happy", legs: "stand", arms: "none", mouth };
        case "look":
          return { face: base, legs: "stand", arms: "none", lookX: modeT < 0.8 ? -1 : 1, lookY: -1 };
        default:
          return { face: base, legs: "stand", arms: "none", lookX, lookY, mouth };
      }
    };

    /* the loop */
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      modeT += dt;
      const fy = floorY();
      const vw = window.innerWidth;
      const half = wpx() / 2;

      // calm down slowly
      if (anger > 0 && now - lastPoke > 9000) {
        anger--;
        lastPoke = now;
      }
      if (now - lastPoke > 3500) pokes = 0;

      // blinking
      if (now > blinkAt) {
        blinkUntil = now + 120;
        blinkAt = now + 1800 + Math.random() * 3500;
      }

      // scroll speed
      const sy = window.scrollY;
      scrollV = scrollV * 0.8 + ((sy - lastScrollY) / Math.max(dt, 0.001)) * 0.2;
      lastScrollY = sy;

      // the cursor: eyes follow it; behind him for a while, he turns round
      const dxC = cursor.x - x;
      const dyC = cursor.y - (y - 40);
      if (mode === "idle" || mode === "sit") {
        lookX = Math.abs(dxC) < 600 ? (Math.sign(dxC) === face ? 1 : -1) : 0;
        lookY = dyC < -120 && Math.abs(dxC) < 300 ? -1 : 0;
        if (Math.sign(dxC) !== face && Math.abs(dxC) < 500) {
          if (!behindSince) behindSince = now;
          else if (now - behindSince > 1400) {
            face = -face;
            behindSince = 0;
          }
        } else behindSince = 0;
      }

      // standing on something: ride it, or fall when it goes
      if (ground && mode !== "air" && mode !== "drag" && mode !== "crouch") {
        const r = ground.getBoundingClientRect();
        if (!ground.isConnected || r.top < HEADER || r.top > fy - 10 || x < r.left - 4 || x > r.right + 4) {
          ground = null;
          vy = 0;
          if (mode !== "sleep") {
            setMode("air");
            if (Math.abs(scrollV) > 400) say("Aaah!");
          }
        } else y = r.top;
      } else if (!ground && mode !== "air" && mode !== "drag" && mode !== "crouch" && mode !== "away") {
        y = fy;
      }

      switch (mode) {
        case "idle":
        case "look":
          if (modeT > modeLen) decide();
          break;
        case "sit":
          if (modeT > modeLen) setMode("idle", 1);
          break;
        case "wave":
          if (modeT > modeLen) setMode("idle", 1.5);
          break;
        case "walk":
        case "run": {
          const speed = mode === "run" ? 190 : 62;
          face = target > x ? 1 : -1;
          x += face * speed * dt;
          if ((face > 0 && x >= target) || (face < 0 && x <= target)) {
            x = target;
            if (mode === "run" && (x < -40 || x > vw + 40)) {
              setMode("away");
              awayUntil = now + 6000 + Math.random() * 4000;
            } else setMode("idle", 1 + Math.random() * 2);
          }
          break;
        }
        case "away":
          if (now > awayUntil) {
            // back in from the other side, a little sheepish
            ground = null;
            y = fy;
            x = x < 0 ? vw + 60 : -60;
            target = x < 0 ? 80 + Math.random() * 120 : vw - 80 - Math.random() * 120;
            anger = 1;
            setMode("walk");
            window.setTimeout(() => say("...fine. I'm back.", true), 900);
          }
          break;
        case "crouch":
          if (modeT > modeLen) {
            ground = null;
            setMode("air");
          }
          break;
        case "air": {
          vy += G * dt;
          const ny = y + vy * dt;
          x += vx * dt;
          if (x < half || x > vw - half) {
            x = Math.max(half, Math.min(vw - half, x));
            vx *= -0.4;
          }
          let landed = false;
          if (vy > 0 && jumpTarget) {
            const r = jumpTarget.getBoundingClientRect();
            if (y <= r.top && ny >= r.top && x >= r.left - 6 && x <= r.right + 6) {
              y = r.top;
              ground = jumpTarget;
              landed = true;
            }
          }
          if (!landed && ny >= fy) {
            y = fy;
            ground = null;
            landed = true;
          }
          if (landed) {
            jumpTarget = null;
            const impact = vy;
            vx = 0;
            vy = 0;
            if (impact > 1500) {
              setMode("trip", 1.4);
              say(pick(["Oof.", "Ow.", "Rude."]), true);
              anger = Math.min(4, anger + (impact > 2100 ? 2 : 1));
              lastPoke = now;
            } else setMode("idle", 0.8 + Math.random());
          } else y = ny;
          break;
        }
        case "trip":
          if (modeT > modeLen) setMode("idle", 1.2);
          break;
        case "angry":
          if (Math.floor(modeT * 3) !== Math.floor((modeT - dt) * 3)) emote("#");
          if (modeT > 1.6) setMode("idle", 1.5);
          break;
        case "dizzy":
          if (modeT > 1.8) setMode("idle", 1);
          break;
        case "stretch":
          if (modeT > 0.9) setMode("idle", 1);
          break;
        case "pet":
          if (modeT > 1.4) setMode("idle", 1);
          break;
        case "sleep":
          if (Math.floor(modeT / 1.4) !== Math.floor((modeT - dt) / 1.4)) emote("z");
          if (Math.hypot(dxC, cursor.y - y) < 160 && now - cursor.t < 300) {
            setMode("stretch");
            say(pick(["Oh. Hi.", "I wasn't sleeping."]), true);
          }
          break;
        case "drag": {
          const nx = drag.px - drag.ox;
          const ny = drag.py - drag.oy;
          const dvx = (nx - x) / Math.max(dt, 0.001);
          if (Math.sign(dvx) !== Math.sign(lastDvx) && Math.abs(dvx) > 900) shake += 1;
          lastDvx = dvx;
          shake = Math.max(0, shake - dt * 1.5);
          x = nx;
          y = ny;
          rot += (Math.max(-28, Math.min(28, -dvx * 0.02)) - rot) * 0.2;
          dragHold += dt;
          if (shake > 6 && Math.floor(modeT * 2) !== Math.floor((modeT - dt) * 2)) {
            say(pick(["Put me down!", "I'm getting dizzy..."]));
            anger = Math.min(4, anger + 1);
            lastPoke = now;
            emote("@");
          }
          if (dragHold > 5 && dragHold - dt <= 5) say("You can put me down now.");
          break;
        }
      }
      if (mode !== "drag") rot *= 0.8;

      // fast scrolling on the floor: he wobbles
      if (!reduced && Math.abs(scrollV) > 3200 && !ground && (mode === "idle" || mode === "walk") && now - lastWhoa > 15000) {
        lastWhoa = now;
        emote("!");
        say("Whoa, slow down!");
        vy = -380;
        vx = 0;
        setMode("air");
      }

      // the bottom of the page, once per page
      if (saidBottom !== pathRef.current && sy + window.innerHeight >= document.documentElement.scrollHeight - 4 && sy > 200) {
        saidBottom = pathRef.current;
        if (mode === "idle" || mode === "sit" || mode === "walk") {
          say("You made it to the bottom!");
          setMode("wave", 1.4);
        }
      }

      // write the frame
      const p = pose(now);
      const key = JSON.stringify(p);
      if (key !== poseKey) {
        poseKey = key;
        const [l, f, s] = sprite(p);
        pLine.current?.setAttribute("d", l);
        pFill.current?.setAttribute("d", f);
        pShade.current?.setAttribute("d", s);
      }
      const left = x - half;
      // his feet sit 19 grid rows below the top of the drawing
      const top = y - 19 * S;
      el.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0)`;
      bd.style.transform = `rotate(${rot.toFixed(2)}deg) scaleX(${face})`;
      if (bub.dataset.on) {
        const bw = bub.offsetWidth;
        const bx = Math.max(8, Math.min(vw - bw - 8, x - bw / 2));
        bub.style.transform = `translate3d(${bx.toFixed(1)}px, ${(top - bub.offsetHeight - 6).toFixed(1)}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    /* input */
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      cursor.vx = (e.clientX - cursor.x) / Math.max(1, now - cursor.t);
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      cursor.t = now;
      lastInput = now;
      if (drag.pending && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 5) {
        drag.pending = false;
        drag.on = true;
        ground = null;
        jumpTarget = null;
        shake = 0;
        dragHold = 0;
        setMode("drag");
        if (Math.random() < 0.6) say(pick(["Whoa!", "Wheee!", "Where are we going?"]));
      }
      if (drag.on) {
        const dtp = Math.max(1, now - drag.t) / 1000;
        drag.pvx = drag.pvx * 0.5 + ((e.clientX - drag.px) / dtp) * 0.5;
        drag.pvy = drag.pvy * 0.5 + ((e.clientY - drag.py) / dtp) * 0.5;
        drag.px = e.clientX;
        drag.py = e.clientY;
        drag.t = now;
      }
      // a sudden swipe right past him startles him
      if (!drag.on && Math.abs(cursor.vx) > 3 && Math.hypot(e.clientX - x, e.clientY - (y - 30)) < 70 && (mode === "idle" || mode === "walk") && !reduced) {
        emote("!");
        vy = -420;
        vx = 0;
        setMode("air");
      }
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      drag.pending = true;
      drag.sx = e.clientX;
      drag.sy = e.clientY;
      drag.ox = e.clientX - x;
      drag.oy = e.clientY - y;
      drag.px = e.clientX;
      drag.py = e.clientY;
      drag.pvx = 0;
      drag.pvy = 0;
      drag.t = performance.now();
    };

    const onUp = () => {
      const now = performance.now();
      if (drag.on) {
        drag.on = false;
        vx = Math.max(-1800, Math.min(1800, drag.pvx));
        vy = Math.max(-1800, Math.min(1800, drag.pvy));
        if (reduced) {
          vx = 0;
          vy = 0;
        }
        setMode("air");
        if (shake > 6) window.setTimeout(() => setMode("dizzy"), 0);
        return;
      }
      if (!drag.pending) return;
      drag.pending = false;
      lastInput = now;
      // a click
      if (mode === "sleep") {
        anger = Math.min(4, anger + 1);
        lastPoke = now;
        setMode("stretch");
        say(pick(["Five more minutes...", "Hey, I was sleeping."]), true);
        return;
      }
      if (mode === "away" || mode === "run") return;
      pokes = now - lastPoke < 3500 ? pokes + 1 : 1;
      lastPoke = now;
      if (pokes === 1) {
        const night = new Date().getHours() < 6;
        say(night ? "It's late. Go to sleep. I will." : Math.random() < 0.6 ? pick(linesFor(pathRef.current)) : pick(CHATTER), true);
        setMode(Math.random() < 0.5 ? "wave" : "idle", 1.6);
        return;
      }
      const line = POKES[Math.min(pokes - 1, POKES.length - 1)];
      if (pokes >= 6) {
        anger = 4;
        leaveScreen();
        return;
      }
      say(line, true);
      if (pokes >= 4) {
        anger = Math.min(4, anger + 1);
        setMode("angry");
      } else if (pokes === 3) {
        anger = Math.max(anger, 2);
        emote("#");
        setMode("idle", 1.4);
      } else {
        emote(pokes === 2 ? "?" : "!");
        setMode("idle", 1.2);
      }
    };

    // petting: the cursor going back and forth over him, no button
    const onOver = (e: PointerEvent) => {
      if (drag.on || drag.pending || e.buttons) return;
      const now = performance.now();
      if (now - petAt > 1500) petDist = 0;
      petDist += Math.abs(e.clientX - lastPetX);
      lastPetX = e.clientX;
      petAt = now;
      if (petDist > 260 && (mode === "idle" || mode === "sit" || mode === "look")) {
        petDist = 0;
        anger = Math.max(0, anger - 1);
        emote("♥");
        if (Math.random() < 0.5) say(pick(["Hehe.", "Okay, you're forgiven."]));
        setMode("pet");
      }
    };
    const onEnter = () => {
      if (mode === "idle" && Math.random() < 0.35) emote("?");
    };

    const onKey = () => {
      lastInput = performance.now();
    };
    const onCopy = () => {
      lastInput = performance.now();
      if (mode !== "away") {
        say("Copied! Now send that email.", true);
        setMode("wave", 1.4);
      }
    };
    const onVis = () => {
      if (document.hidden) {
        hiddenAt = performance.now();
        cancelAnimationFrame(raf);
        raf = 0;
      } else {
        last = performance.now();
        if (!raf) raf = requestAnimationFrame(tick);
        if (hiddenAt && performance.now() - hiddenAt > 30000 && mode !== "away") {
          window.setTimeout(() => {
            say("Welcome back!", true);
            setMode("wave", 1.4);
          }, 600);
        }
      }
    };
    const onResize = () => {
      S = window.innerWidth < 640 ? 2.5 : 3;
      el.style.setProperty("--s", String(S));
      x = Math.max(wpx() / 2, Math.min(window.innerWidth - wpx() / 2, x));
    };

    // links to the work: now and then he notices
    let lastNotice = 0;
    const onLinkOver = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='/work/'], a[href*='/design/']");
      const now = performance.now();
      if (!a || now - lastNotice < 20000 || Math.random() > 0.3 || mode !== "idle") return;
      lastNotice = now;
      const r = a.getBoundingClientRect();
      face = r.left + r.width / 2 > x ? 1 : -1;
      emote("!");
      say(pick(["Ooh, that one's good.", "Click it. Go on."]));
    };

    // the theme switch
    const mo = new MutationObserver(() => {
      const dark = document.documentElement.getAttribute("data-v2-theme") === "dark";
      blinkUntil = performance.now() + 500;
      say(dark ? "Lights off. Cozy." : "Too bright!", true);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-v2-theme"] });

    api.current = {
      route: (p) => {
        // a new page: whatever he stood on is gone
        ground = null;
        jumpTarget = null;
        window.setTimeout(() => {
          if (mode !== "away" && anger < 3) say(pick(linesFor(p)));
        }, 1400);
      },
    };

    el.style.setProperty("--s", String(S));
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointermove", onOver);
    el.addEventListener("pointerenter", onEnter);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onKey, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("copy", onCopy);
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("pointerover", onLinkOver);
    raf = requestAnimationFrame(tick);
    const hello = window.setTimeout(() => {
      say(pick(linesFor(pathRef.current)));
      setMode("wave", 1.4);
    }, 2500);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hello);
      window.clearInterval(typeTimer);
      window.clearTimeout(hideTimer);
      mo.disconnect();
      api.current = null;
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointermove", onOver);
      el.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onKey);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("pointerover", onLinkOver);
    };
  }, []);

  return (
    <>
      <div ref={root} className="buddy" aria-hidden>
        <div ref={emoteBox} className="buddy-emotes" />
        <div ref={body} className="buddy-body">
          <svg viewBox={`-1 -1 ${GW + 2} ${GH + 2}`} shapeRendering="crispEdges">
            <path ref={pShade} className="buddy-shade" />
            <path ref={pFill} className="buddy-fill" />
            <path ref={pLine} className="buddy-line" />
          </svg>
        </div>
      </div>
      <div ref={bubble} className="buddy-bubble font-mono" aria-live="polite" />
    </>
  );
}
