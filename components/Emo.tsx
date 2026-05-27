"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Mood =
  | "idle"
  | "happy"
  | "annoyed"
  | "blink"
  | "winkL"
  | "winkR"
  | "greet";

const happyLines = [
  "he's also interested in working with you ↗",
  "let's build something good together",
  "available for work · 2026",
  "based in berlin · Open to work",
  "click works to see the good stuff",
];

const annoyedLines = [
  "ok ok, stop poking me...",
  "that tickles. quit it.",
  "i have feelings too, you know",
];

export function Emo() {
  const [mood, setMood] = useState<Mood>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [waving, setWaving] = useState(false);
  const [eyeOffset, setEyeOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const clicksRef = useRef<number[]>([]);
  const lineIdxRef = useRef(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hostRef = useRef<HTMLDivElement>(null);
  const lastMouseMoveRef = useRef<number>(Date.now());
  const moodRef = useRef<Mood>("idle");
  moodRef.current = mood;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setMood("greet");
      setWaving(true);
      setMessage("hi ↗");
      const a = setTimeout(() => setWaving(false), 1400);
      const b = setTimeout(() => setMood("idle"), 1800);
      const c = setTimeout(() => setMessage(null), 2400);
      timeoutsRef.current.push(a, b, c);
    }, 10000);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    let cancelled = false;
    const pickIdleExpression = (): { mood: Mood; hold: number } => {
      const r = Math.random();
      if (r < 0.55) return { mood: "blink", hold: 140 };
      if (r < 0.75) return { mood: "happy", hold: 900 };
      if (r < 0.875) return { mood: "winkR", hold: 260 };
      return { mood: "winkL", hold: 260 };
    };
    const loop = () => {
      if (cancelled) return;
      const next = 2200 + Math.random() * 3200;
      setTimeout(() => {
        if (cancelled) return;
        if (moodRef.current !== "idle") {
          loop();
          return;
        }
        const { mood: m, hold } = pickIdleExpression();
        setMood(m);
        setTimeout(() => {
          if (cancelled) return;
          if (moodRef.current === m) setMood("idle");
          loop();
        }, hold);
      }, next);
    };
    loop();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastMouseMoveRef.current = Date.now();
      const host = hostRef.current;
      if (!host) return;
      const r = host.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const threshold = 40;
      const qx = Math.abs(dx) < threshold ? 0 : dx > 0 ? 1 : -1;
      const qy = Math.abs(dy) < threshold ? 0 : dy > 0 ? 1 : -1;
      setEyeOffset({ x: qx, y: qy });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const idleFor = Date.now() - lastMouseMoveRef.current;
      if (idleFor > 3000 && Math.random() < 0.35) {
        setEyeOffset({ x: 0, y: -1 });
        setTimeout(() => {
          if (Date.now() - lastMouseMoveRef.current > 3000) {
            setEyeOffset({ x: 0, y: 0 });
          }
        }, 900);
      }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const clearTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const handleClick = () => {
    clearTimers();
    const now = Date.now();
    clicksRef.current = [...clicksRef.current, now].filter(
      (t) => now - t < 2500
    );

    if (clicksRef.current.length >= 4) {
      const line =
        annoyedLines[Math.floor(Math.random() * annoyedLines.length)];
      setMood("annoyed");
      setMessage(line);
      timeoutsRef.current.push(
        setTimeout(() => {
          setMood("idle");
          setMessage(null);
        }, 2400)
      );
      return;
    }

    const line = happyLines[lineIdxRef.current % happyLines.length];
    lineIdxRef.current += 1;
    setMood("happy");
    setMessage(line);
    timeoutsRef.current.push(setTimeout(() => setMood("idle"), 1000));
    timeoutsRef.current.push(setTimeout(() => setMessage(null), 2600));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 select-none"
        >
          <AnimatePresence>
            {message && (
              <motion.div
                key={message}
                initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 4, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="font-mono text-[11px] uppercase tracking-[0.18em] border border-foreground bg-background text-foreground px-3 py-2 whitespace-nowrap"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            ref={hostRef}
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleClick();
            }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            animate={
              waving
                ? { rotate: [0, -12, 12, -8, 8, -4, 0] }
                : mood === "happy"
                  ? { rotate: [0, -4, 4, -3, 0] }
                  : mood === "annoyed"
                    ? { x: [0, -2, 2, -1, 1, 0] }
                    : { rotate: 0, x: 0 }
            }
            transition={{ duration: waving ? 1.2 : 0.5 }}
            aria-label="Emo — click to talk"
            className="block cursor-pointer outline-none"
          >
            <PixelFace mood={mood} offset={eyeOffset} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- pixel face ----------
   14×14 grid, each unit = 3px → 42×42.
   Outline is a pixel-rounded square:
     row 0  :  xxxxxxxxxx at cols 2..11
     row 1  :  single pixels at col 1 and col 12  (corner step)
     row 2-11: edge pixels at col 0 and col 13
     row 12 :  single pixels at col 1 and col 12  (bottom corner step)
     row 13 :  xxxxxxxxxx at cols 2..11
*/

function PixelFace({
  mood,
  offset,
}: {
  mood: Mood;
  offset: { x: number; y: number };
}) {
  const W = 14;
  const H = 14;
  const unit = 3;
  const C = "var(--foreground)";

  return (
    <svg
      width={W * unit}
      height={H * unit}
      viewBox={`0 0 ${W} ${H}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
    >
      {/* top & bottom straight edges */}
      <rect x={2} y={0} width={10} height={1} fill={C} />
      <rect x={2} y={13} width={10} height={1} fill={C} />
      {/* corner step pixels */}
      <rect x={1} y={1} width={1} height={1} fill={C} />
      <rect x={12} y={1} width={1} height={1} fill={C} />
      <rect x={1} y={12} width={1} height={1} fill={C} />
      <rect x={12} y={12} width={1} height={1} fill={C} />
      {/* left & right straight edges */}
      <rect x={0} y={2} width={1} height={10} fill={C} />
      <rect x={13} y={2} width={1} height={10} fill={C} />

      {/* eyes (no mouth, ever) — thin tall rects */}
      <Eye x={5 + offset.x} y={5 + offset.y} side="L" mood={mood} />
      <Eye x={8 + offset.x} y={5 + offset.y} side="R" mood={mood} />
    </svg>
  );
}

function Eye({
  x,
  y,
  side,
  mood,
}: {
  x: number;
  y: number;
  side: "L" | "R";
  mood: Mood;
}) {
  const C = "var(--foreground)";
  const closed = <rect x={x} y={y + 2} width={1} height={1} fill={C} />;

  // single eye closed (wink) — the other stays idle
  if (mood === "winkR" && side === "R") return closed;
  if (mood === "winkL" && side === "L") return closed;

  if (mood === "blink" || mood === "annoyed") return closed;

  if (mood === "happy" || mood === "greet") {
    // happy eye — single pixel lifted, like a squint ^
    return <rect x={x} y={y + 1} width={1} height={1} fill={C} />;
  }

  // idle — thin tall 1×4
  return <rect x={x} y={y} width={1} height={4} fill={C} />;
}
