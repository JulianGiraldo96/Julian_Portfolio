"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SPRING } from "./motion";

/* NotchTunes, playable in the browser.

   The top of a MacBook screen with the widget hanging off the notch, built
   from the app's own numbers (Layout in NotchController.swift): wings of 78,
   an inset of 6, a 440 card with a 108 cover, radius 26 below and 12 on the
   art. Hover the notch and it opens; the cover and the bars are one piece
   each (a shared layoutId) that travel between the two states, which is how
   the app does it with matchedGeometryEffect.

   The players are the point of the case, so they can be swapped. Each one
   accepts a different set of commands, and the demo behaves the way the app
   does with each. The tracks are made up. */

type Cap = "works" | "refused" | "off" | "none";
type SourceId = "music" | "spotify" | "ytmusic";

const SOURCES: Record<
  SourceId,
  { name: string; short: string; shuffle: Cap; repeat: Cap; favorite: Cap; like: "star" | "heart"; why: string }
> = {
  music: {
    name: "Apple Music",
    short: "Music",
    shuffle: "works",
    repeat: "works",
    favorite: "works",
    like: "star",
    why: "Apple Music: play, skip, scrub, shuffle, repeat and the star, all from the notch.",
  },
  spotify: {
    name: "Spotify",
    short: "Spotify",
    shuffle: "works",
    repeat: "works",
    favorite: "works",
    like: "heart",
    why: "Spotify: shuffle and repeat, and the heart saves the song to your Liked Songs.",
  },
  ytmusic: {
    name: "YouTube Music",
    short: "YT Music",
    shuffle: "works",
    repeat: "works",
    favorite: "works",
    like: "star",
    why: "Read straight from the page in Safari or Chrome. The star is the thumbs up.",
  },
};

const TRACKS = [
  { title: "Slow Lights Over the River", artist: "Marla Venn", dur: 221, art: ["#3DE0FF", "#2F6BFF", "#6B22D6"] },
  { title: "Paper Weather", artist: "The Quiet Hours", dur: 252, art: ["#FFB36B", "#FF5E7E", "#8A2BE2"] },
  { title: "North of Noon", artist: "Ezra Kale", dur: 178, art: ["#B8F28B", "#3A9D5D", "#14372A"] },
];

const NOTCH_W = 186;
const NOTCH_H = 32;
const WING = 78;
const INSET = 6;

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function NotchDemo({
  showSources = true,
  autoPeek = true,
}: {
  showSources?: boolean;
  autoPeek?: boolean;
}) {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { amount: 0.6, once: true });

  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [src, setSrc] = useState<SourceId>("music");
  /* the track and the place in it move together, so the end of one song
     and the start of the next are a single update */
  const [at, setAt] = useState({ ti: 0, pos: 64 });
  const { ti, pos } = at;
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.62);
  const [fav, setFav] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [dimmed, setDimmed] = useState<Set<"shuffle" | "repeat" | "favorite">>(new Set());
  const [note, setNote] = useState<string | null>(null);

  const track = TRACKS[ti];
  const source = SOURCES[src];

  /* the clock: a quarter second at a time, onto the next track at the end */
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setAt((a) =>
        a.pos + 0.25 < TRACKS[a.ti].dur
          ? { ti: a.ti, pos: a.pos + 0.25 }
          : { ti: (a.ti + 1) % TRACKS.length, pos: 0 },
      );
    }, 250);
    return () => window.clearInterval(id);
  }, [playing]);

  /* once, when the stage comes into view: start the music and open the card
     for a moment, so the page shows what the notch does before anyone has
     to guess that it can be hovered */
  useEffect(() => {
    if (!inView || !autoPeek || touched) return;
    const t1 = window.setTimeout(() => setPlaying(true), 400);
    if (reduced) return () => window.clearTimeout(t1);
    const t2 = window.setTimeout(() => setOpen(true), 1100);
    const t3 = window.setTimeout(() => setOpen(false), 4200);
    return () => [t1, t2, t3].forEach((t) => window.clearTimeout(t));
  }, [inView, autoPeek, touched, reduced]);

  const touch = () => setTouched(true);

  const pick = (id: SourceId) => {
    setSrc(id);
    setDimmed(new Set());
    setShuffle(false);
    setRepeat(false);
    setFav(false);
    setNote(null);
  };

  /* a command the player may quietly drop: light the button at once, then
     look again, the way the app re-reads the player 350 ms after a command */
  const attempt = (
    what: "shuffle" | "repeat" | "favorite",
    cap: Cap,
    value: boolean,
    set: (v: boolean) => void,
  ) => {
    if (cap === "off" || dimmed.has(what)) return;
    set(!value);
    if (cap !== "refused") return;
    window.setTimeout(() => {
      set(value);
      setDimmed((d) => new Set(d).add(what));
      setNote(
        `${source.name} ignored ${what === "favorite" ? "the favourite" : what}. The next check saw nothing changed, so the button dims instead of lying.`,
      );
    }, 450);
  };

  const step = (dir: 1 | -1) => {
    setAt((a) => ({ ti: (a.ti + dir + TRACKS.length) % TRACKS.length, pos: 0 }));
  };

  return (
    <div className="w-full">
      {/* the top of the screen */}
      <div
        ref={stage}
        className="relative h-[300px] overflow-hidden rounded-[22px] border border-[var(--v2-line)] md:h-[330px]"
        style={{
          background:
            WALLPAPER,
        }}
      >
        <MenuBar />

        <LayoutGroup id="notch-demo">
          <div className="absolute inset-x-0 top-0 z-10 flex justify-center px-3">
            <motion.div
              layout
              transition={reduced ? { duration: 0 } : SPRING}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") {
                  touch();
                  setOpen(true);
                }
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === "mouse") setOpen(false);
              }}
              className="relative overflow-hidden bg-black shadow-[0_18px_50px_-12px_rgba(0,0,0,0.9)]"
              style={{
                width: open ? "min(440px, 100%)" : NOTCH_W + WING * 2,
                height: open ? NOTCH_H + 178 : NOTCH_H,
                borderBottomLeftRadius: open ? 26 : 12,
                borderBottomRightRadius: open ? 26 : 12,
              }}
            >
              {/* tapping the notch opens it on a touch screen, and a keyboard
                  can reach it too */}
              <button
                type="button"
                aria-expanded={open}
                aria-label={open ? "Close the NotchTunes card" : "Open the NotchTunes card"}
                onClick={() => {
                  touch();
                  setOpen((o) => !o);
                }}
                className="absolute inset-x-0 top-0 z-20 cursor-pointer outline-offset-[-3px]"
                style={{ height: NOTCH_H }}
              />

              {open ? (
                <Expanded
                  key="open"
                  track={track}
                  ti={ti}
                  playing={playing}
                  pos={pos}
                  vol={vol}
                  source={source}
                  fav={fav}
                  shuffle={shuffle}
                  repeat={repeat}
                  dimmed={dimmed}
                  onPlay={() => {
                    touch();
                    setPlaying((p) => !p);
                  }}
                  onStep={(d) => {
                    touch();
                    step(d);
                  }}
                  onSeek={(s) => {
                    touch();
                    setAt((a) => ({ ti: a.ti, pos: s }));
                  }}
                  onVol={(v) => {
                    touch();
                    setVol(v);
                  }}
                  onFav={() => {
                    touch();
                    attempt("favorite", source.favorite, fav, setFav);
                  }}
                  onShuffle={() => {
                    touch();
                    attempt("shuffle", source.shuffle, shuffle, setShuffle);
                  }}
                  onRepeat={() => {
                    touch();
                    attempt("repeat", source.repeat, repeat, setRepeat);
                  }}
                  reduced={!!reduced}
                />
              ) : (
                <Collapsed key="shut" track={track} ti={ti} playing={playing} reduced={!!reduced} />
              )}
            </motion.div>
          </div>
        </LayoutGroup>

        {/* until the notch has been tried once: a ring breathing out of it and
            a pill pointing at it, so nobody takes the replica for a picture */}
        <AnimatePresence>
          {!touched && !open && (
            <motion.div
              key="try"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="pointer-events-none absolute inset-x-0 top-0"
            >
              {!reduced && (
                <motion.span
                  aria-hidden
                  className="absolute left-1/2 top-0 -ml-[171px] rounded-b-[12px] border-2 border-t-0 border-white/70"
                  style={{ width: NOTCH_W + WING * 2, height: NOTCH_H, transformOrigin: "50% 0%" }}
                  animate={{ scale: [1, 1.12], opacity: [0.8, 0] }}
                  transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity, repeatDelay: 0.4 }}
                />
              )}
              <motion.p
                className="absolute inset-x-0 top-[50px] flex justify-center"
                animate={reduced ? undefined : { y: [0, -4, 0] }}
                transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-black/45 px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white">
                  <span aria-hidden>↑</span>
                  <span className="[@media(pointer:fine)]:hidden">Try it: tap the notch</span>
                  <span className="hidden [@media(pointer:fine)]:inline">Try it: hover the notch</span>
                </span>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* once open: what else answers */}
        <AnimatePresence>
          {open && (
            <motion.p
              key="more"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              className="pointer-events-none absolute inset-x-0 top-[232px] px-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/70 md:top-[250px]"
            >
              <span className="sm:hidden">Play, drag, like · players below ↓</span>
              <span className="hidden sm:inline">Play, drag the bar, like it · switch players below ↓</span>
            </motion.p>
          )}
        </AnimatePresence>

        <div className="pointer-events-none absolute bottom-3 right-4 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/70">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#30d158]" />
          Interactive
        </div>
        <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/35">
          Live replica<span className="hidden sm:inline"> · tracks are made up</span>
        </p>
      </div>

      {showSources && (
        <div className="mt-4">
          <div role="radiogroup" aria-label="Player" className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--v2-label)]">
              Playing from
            </span>
            {(Object.keys(SOURCES) as SourceId[]).map((id) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={src === id}
                onClick={() => {
                  touch();
                  pick(id);
                  setOpen(true);
                }}
                className={`rounded-full border px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                  src === id
                    ? "border-transparent bg-[var(--v2-invert-bg)] text-[var(--v2-invert-ink)]"
                    : "border-[var(--v2-line)] text-[var(--v2-secondary)] hover:border-[var(--v2-line-strong)]"
                }`}
              >
                {SOURCES[id].name}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="mt-3 min-h-[3em] max-w-[62ch] text-[14px] leading-relaxed text-[var(--v2-secondary)]">
            {note ?? source.why}
          </p>
        </div>
      )}
    </div>
  );
}

/* One wallpaper from the top edge down, so the black notch reads against
   colour the way it does on a real MacBook. */
export const WALLPAPER =
  "radial-gradient(70% 90% at 12% 0%, #5B8CFF, transparent 70%), radial-gradient(60% 90% at 92% 0%, #9A5BFF, transparent 70%), radial-gradient(120% 80% at 50% 115%, #120b2e, transparent 75%), linear-gradient(#4a4fd0, #1c1450)";

function MenuBar() {
  return (
    <div className="absolute inset-x-0 top-0 flex h-8 items-center justify-between px-4 text-[11.5px] font-medium text-white/80">
      <div className="flex items-center gap-4">
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-white/80" />
        <span className="hidden font-semibold sm:inline">Finder</span>
        <span className="hidden text-white/65 lg:inline">File</span>
        <span className="hidden text-white/65 lg:inline">Edit</span>
        <span className="hidden text-white/65 lg:inline">View</span>
      </div>
      <div className="flex items-center gap-3.5 text-white/70">
        {/* NotchTunes' own menu bar item: open the player, open at login, quit */}
        <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
          <rect x="1" y="3" width="8" height="1.6" rx=".8" />
          <rect x="1" y="7" width="8" height="1.6" rx=".8" />
          <rect x="1" y="11" width="5" height="1.6" rx=".8" />
          <path d="M12.6 2.2v7.6a2 2 0 1 1-1.4-1.9V3.4l3.6-.9v1.5z" />
        </svg>
        <span className="hidden sm:inline">Tue 21 Oct</span>
        <span>9:41</span>
      </div>
    </div>
  );
}

function Art({
  ti,
  size,
  radius,
  reduced,
}: {
  ti: number;
  size: number;
  radius: number;
  reduced: boolean;
}) {
  const [a, b, c] = TRACKS[ti].art;
  return (
    <motion.div
      layoutId="nt-art"
      transition={reduced ? { duration: 0 } : SPRING}
      className="relative shrink-0 overflow-hidden"
      style={{ width: size, height: size, borderRadius: radius }}
    >
      {/* a new cover crossfades in over the old one */}
      <AnimatePresence initial={false}>
        <motion.span
          key={ti}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(70% 70% at 30% 25%, ${a}, transparent 70%), radial-gradient(80% 80% at 80% 90%, ${c}, transparent 70%), ${b}`,
          }}
        />
      </AnimatePresence>
    </motion.div>
  );
}

/* Three capsules that are grey dots in pause and green bars while playing:
   the same three shapes either way, so they change instead of swapping. */
function Equalizer({ playing, reduced }: { playing: boolean; reduced: boolean }) {
  return (
    <motion.div
      layoutId="nt-eq"
      transition={reduced ? { duration: 0 } : SPRING}
      aria-hidden
      className="flex h-3 w-[16.5px] items-center justify-between"
    >
      {[0, 1, 2].map((i) => (
        <span key={i} className="relative h-[10.5px] w-[3.5px]">
          <span
            className={`absolute inset-0 rounded-full transition-transform duration-200 ${playing && !reduced ? "nt-eq" : ""}`}
            style={{
              animationDelay: `${i * -0.37}s`,
              animationDuration: `${0.9 + i * 0.23}s`,
              transform: playing ? (reduced ? `scaleY(${[0.7, 1, 0.5][i]})` : undefined) : "scaleY(0.333)",
            }}
          >
            <span className="absolute inset-0 rounded-full bg-[#9e9ea6]" />
            <span
              className="absolute inset-0 rounded-full bg-[#30d158] transition-opacity duration-200"
              style={{ opacity: playing ? 1 : 0 }}
            />
          </span>
        </span>
      ))}
    </motion.div>
  );
}

function Collapsed({
  ti,
  playing,
  reduced,
}: {
  track: (typeof TRACKS)[number];
  ti: number;
  playing: boolean;
  reduced: boolean;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-between" style={{ paddingInline: INSET }}>
      <Art ti={ti} size={NOTCH_H - INSET * 2} radius={5} reduced={reduced} />
      <span className="pr-[3px]">
        <Equalizer playing={playing} reduced={reduced} />
      </span>
    </div>
  );
}

function Expanded({
  track,
  ti,
  playing,
  pos,
  vol,
  source,
  fav,
  shuffle,
  repeat,
  dimmed,
  onPlay,
  onStep,
  onSeek,
  onVol,
  onFav,
  onShuffle,
  onRepeat,
  reduced,
}: {
  track: (typeof TRACKS)[number];
  ti: number;
  playing: boolean;
  pos: number;
  vol: number;
  source: (typeof SOURCES)[SourceId];
  fav: boolean;
  shuffle: boolean;
  repeat: boolean;
  dimmed: Set<"shuffle" | "repeat" | "favorite">;
  onPlay: () => void;
  onStep: (d: 1 | -1) => void;
  onSeek: (s: number) => void;
  onVol: (v: number) => void;
  onFav: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  reduced: boolean;
}) {
  const off = (what: "shuffle" | "repeat" | "favorite", cap: Cap) => cap === "off" || dimmed.has(what);

  return (
    <div className="absolute inset-0 text-white" style={{ paddingTop: NOTCH_H + 10, paddingInline: 18 }}>
      <div className="flex gap-4">
        <Art ti={ti} size={108} radius={12} reduced={reduced} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: reduced ? 0 : 0.12, duration: 0.25 } }}
          className="flex min-w-0 flex-1 flex-col"
        >
          <div className="flex items-start gap-2.5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={ti}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 flex-1"
              >
                <p className="truncate text-[15px] font-semibold leading-5">{track.title}</p>
                <p className="mt-[3px] truncate text-[12px] font-medium text-white/60">{track.artist}</p>
              </motion.div>
            </AnimatePresence>
            <span className="mt-[7px]">
              <Equalizer playing={playing} reduced={reduced} />
            </span>
            {source.favorite !== "none" && (
              <Glyph
                label={source.like === "heart" ? (fav ? "Remove from Liked Songs" : "Like") : fav ? "Remove favourite" : "Favourite"}
                onClick={onFav}
                dim={off("favorite", source.favorite)}
                tint={fav ? (source.like === "heart" ? "#1ed760" : "#ff375f") : undefined}
                className="-mr-1.5 -mt-0.5 h-[26px] w-[26px]"
              >
                <path
                  d={
                    source.like === "heart"
                      ? "M8 13.6S2.2 10.1 2.2 6a3 3 0 0 1 5.8-1.3A3 3 0 0 1 13.8 6c0 4.1-5.8 7.6-5.8 7.6z"
                      : "M8 1.6l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.4l-3.8 2 .7-4.3-3.1-3 4.3-.6z"
                  }
                  fill={fav ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </Glyph>
            )}
          </div>

          <Scrub pos={pos} dur={track.dur} onSeek={onSeek} />

          <div className="mt-1.5 flex items-center justify-between">
            <Glyph label="Shuffle" onClick={onShuffle} dim={off("shuffle", source.shuffle)} tint={shuffle ? "#30d158" : undefined}>
              <path d="M2 4.5h2.4c1.4 0 2.2.6 3 1.8l1.2 1.9c.8 1.2 1.6 1.8 3 1.8H14M2 11.5h2.4c1 0 1.7-.3 2.3-1M14 4.5h-2.4c-.9 0-1.6.3-2.2.9M12.4 3 14 4.5 12.4 6M12.4 8.5 14 10l-1.6 1.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </Glyph>
            <div className="flex items-center gap-3">
              <Glyph label="Previous" onClick={() => onStep(-1)}>
                <path d="M7.5 8 13 4.2v7.6zM2.5 8 8 4.2v7.6zM2 4h1v8H2z" fill="currentColor" />
              </Glyph>
              <Glyph label={playing ? "Pause" : "Play"} onClick={onPlay} className="h-9 w-9" size={21}>
                {playing ? (
                  <path d="M4.5 3h2.4v10H4.5zM9.1 3h2.4v10H9.1z" fill="currentColor" />
                ) : (
                  <path d="M5 2.8 13 8l-8 5.2z" fill="currentColor" />
                )}
              </Glyph>
              <Glyph label="Next" onClick={() => onStep(1)}>
                <path d="M8.5 8 3 4.2v7.6zM13.5 8 8 4.2v7.6zM13 4h1v8h-1z" fill="currentColor" />
              </Glyph>
            </div>
            <Glyph label="Repeat" onClick={onRepeat} dim={off("repeat", source.repeat)} tint={repeat ? "#30d158" : undefined}>
              <path d="M3 7V6a2 2 0 0 1 2-2h8M11.5 2.5 13 4l-1.5 1.5M13 9v1a2 2 0 0 1-2 2H3M4.5 13.5 3 12l1.5-1.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </Glyph>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: reduced ? 0 : 0.16, duration: 0.25 } }}
        className="mt-3 flex items-center gap-2.5"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="h-2.5 w-2.5 text-white/45" fill="currentColor">
          <path d="M2 6h3l4-3.5v11L5 10H2z" />
        </svg>
        <Bar value={vol} label="Volume" onChange={onVol} />
        <svg aria-hidden viewBox="0 0 16 16" className="h-2.5 w-2.5 text-white/45" fill="currentColor">
          <path d="M1 6h3l4-3.5v11L4 10H1zM10.5 5.2a3.6 3.6 0 0 1 0 5.6M12.6 3.2a6.4 6.4 0 0 1 0 9.6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span className="ml-1 rounded-[5px] bg-white/10 px-1.5 py-[3px] font-mono text-[8.5px] uppercase tracking-[0.12em] text-white/70">
          {source.short}
        </span>
      </motion.div>
    </div>
  );
}

function Scrub({ pos, dur, onSeek }: { pos: number; dur: number; onSeek: (s: number) => void }) {
  return (
    <div className="mt-auto pt-3">
      <Bar value={pos / dur} label="Position" onChange={(v) => onSeek(v * dur)} />
      <div className="mt-1 flex justify-between font-mono text-[9.5px] tabular-nums text-white/45">
        <span>{mmss(pos)}</span>
        <span>-{mmss(dur - pos)}</span>
      </div>
    </div>
  );
}

/* a thin track you can click or drag along; arrow keys move it too */
function Bar({ value, label, onChange }: { value: number; label: string; onChange: (v: number) => void }) {
  const at = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onChange(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  };
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        at(e);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) at(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onChange(Math.min(1, value + 0.05));
        if (e.key === "ArrowLeft") onChange(Math.max(0, value - 0.05));
      }}
      className="group relative flex h-3 flex-1 cursor-pointer touch-none items-center"
    >
      <span className="relative h-[4px] w-full overflow-hidden rounded-full bg-white/18">
        <span
          className="absolute inset-0 origin-left rounded-full bg-white/85"
          style={{ transform: `scaleX(${value})` }}
        />
      </span>
    </div>
  );
}

function Glyph({
  label,
  onClick,
  dim = false,
  tint,
  size = 14,
  className = "h-7 w-7",
  children,
}: {
  label: string;
  onClick: () => void;
  dim?: boolean;
  tint?: string;
  size?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-disabled={dim}
      onClick={onClick}
      whileTap={dim ? undefined : { scale: 0.86 }}
      className={`flex shrink-0 items-center justify-center rounded-full transition-[opacity,color] duration-300 hover:bg-white/10 ${className}`}
      style={{ color: tint ?? "#fff", opacity: dim ? 0.28 : 1 }}
    >
      <svg aria-hidden viewBox="0 0 16 16" style={{ width: size, height: size }}>
        {children}
      </svg>
    </motion.button>
  );
}
