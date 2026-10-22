"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { TopBar } from "./TopBar";
import { NotchDemo } from "./NotchDemo";
import { SplitTitle } from "./Playful";
import { useIsMac } from "./useIsMac";
import { ENERGY } from "./motion";

/* NotchTunes, given away from the portfolio.

   The page has three jobs, in order: show what the thing is (a replica that
   plays, at the top), make the case for how it was designed, and get it onto
   a stranger's Mac without them giving up at the Gatekeeper warning. That
   last one is where a free unsigned app loses people, so the warning is
   named before they meet it, with the exact path through it. */

export const DMG = "/notchtunes/NotchTunes.dmg";
export const DMG_META = "Version 1.1 · 1.2 MB · macOS 14+ · Apple Silicon";
const EMAIL = "application@juliang.de";
const PHONE = "+49 176 23670893";
const REPO = "https://github.com/JulianGiraldo96/NotchTunes";

const states = [
  {
    n: "01",
    title: "Closed",
    body: "The cover sits to the left of the notch. To the right, three marks: grey dots in pause, green bars while something plays.",
  },
  {
    n: "02",
    title: "Open",
    body: "Hover the notch and the cover grows out of it into a card: title, artist, a scrubber you can drag, play, skip, shuffle, repeat and volume.",
  },
  {
    n: "03",
    title: "Menu bar",
    body: "A small icon in the menu bar opens the player, switches Open at login on or off, and quits.",
  },
];

const decisions = [
  {
    title: "One card, four players",
    body: "Apple Music, Spotify, and YouTube or YouTube Music in Safari or Chrome. Whatever is playing wins, and a native player beats the browser. When nothing plays, the card stays on the last source, so play resumes what you were listening to instead of starting Music.",
  },
  {
    title: "It never lies about state",
    body: "Music on macOS 26 accepts shuffle and repeat and then quietly ignores them. NotchTunes sends the command, reads the player again on the next check, and dims the button if nothing changed. A dead button that looks alive is worse than one that admits it.",
  },
  {
    title: "It grows out of the notch",
    body: "The cover and the bars are single pieces that travel between both states, so the card opens out of the hardware instead of appearing under it. The dots and the bars are the same three capsules changing height and colour, not two icons swapping.",
  },
  {
    title: "It opens at once",
    body: "macOS slows the timers of background apps to about one second. That second was the whole delay between hovering and opening, so the app keeps itself awake. The bars are capped at 30 frames a second, which took the CPU from 20% to between 4% and 8%.",
  },
  {
    title: "Ads do not break it",
    body: "During a YouTube ad the page's video describes the ad, so a 3:33 song read as 44 seconds. NotchTunes spots the ad, keeps the real title and holds the progress at zero until the song is back.",
  },
];

const steps: { title: string; body: React.ReactNode }[] = [
  {
    title: "Download and open it",
    body: "Open NotchTunes.dmg from your Downloads.",
  },
  {
    title: "Drag it into Applications",
    body: "Drop NotchTunes on the Applications shortcut next to it, then open it from Applications.",
  },
  {
    title: "macOS will stop it the first time",
    body: (
      <>
        You will see a message saying Apple could not verify it. That is
        expected: apps are only signed by Apple through a paid developer
        account, and this one is a free gift. Go to{" "}
        <Path>System Settings → Privacy &amp; Security</Path>, scroll to the
        note about NotchTunes, click <Path>Open Anyway</Path> and confirm. You
        only do this once.
      </>
    ),
  },
  {
    title: "Say yes to the permissions",
    body: (
      <>
        It asks to control Music, Spotify and your browser. Without that it
        cannot see what is playing. Said no by mistake? Turn it back on in{" "}
        <Path>System Settings → Privacy &amp; Security → Automation</Path>.
      </>
    ),
  },
  {
    title: "Using Chrome? One switch",
    body: (
      <>
        In Chrome, turn on{" "}
        <Path>View → Developer → Allow JavaScript from Apple Events</Path> once,
        so it can read YouTube. Safari needs nothing.
      </>
    ),
  },
];

const fine = [
  {
    title: "Requirements",
    body: "macOS 14 Sonoma or later, on a Mac with Apple Silicon. No notch, as on an external display? It draws a small one at the top of the screen.",
  },
  {
    title: "Privacy",
    body: "No account and no analytics. The only thing it fetches from the internet is cover art.",
  },
  {
    title: "Starts with your Mac",
    body: "On first launch it turns on Open at login. Switch it off from the menu bar icon whenever you like.",
  },
  {
    title: "What it cannot do",
    body: "VLC and players with no scripting or web page stay invisible to it. Spotify support is built in, but I have not had Spotify on my own Mac to test it, so tell me if it misbehaves.",
  },
];

function Path({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[6px] bg-[var(--v2-surface)] px-1.5 py-0.5 font-mono text-[0.86em] text-[var(--v2-ink)] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
      {children}
    </span>
  );
}

export function DownloadButton({ size = "lg" }: { size?: "lg" | "md" }) {
  return (
    <motion.a
      href={DMG}
      download="NotchTunes.dmg"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", duration: 0.35, bounce: 0.3 }}
      className={`inline-flex items-center gap-3 rounded-full bg-[var(--v2-accent)] font-mono uppercase tracking-[0.14em] text-black ${
        size === "lg" ? "px-6 py-3.5 text-[12.5px]" : "px-5 py-3 text-[11.5px]"
      }`}
    >
      <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v8.5M4.5 7.5 8 11l3.5-3.5M3 13.5h10" />
      </svg>
      Download for Mac, free
    </motion.a>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: ENERGY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--v2-label)]">{children}</p>
  );
}

export function NotchTunesPage() {
  const mac = useIsMac();

  return (
    <MotionConfig reducedMotion="user">
      <div className="v2-root font-sans">
        <TopBar />
        <main id="main" className="mx-auto max-w-[1240px] px-5 md:px-8">
          {/* the gift, and the thing itself, playing */}
          <section aria-labelledby="nt-title" className="grid grid-cols-1 gap-10 pb-16 pt-12 md:grid-cols-12 md:gap-8 md:pb-24 md:pt-20">
            <div className="md:col-span-5 md:pt-4">
              <p className="v2-rise flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--v2-secondary)]">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" />
                <span className="text-[var(--v2-accent)]">A gift for Mac users</span>
                <span aria-hidden className="text-[var(--v2-label)]">&middot;</span>
                <span>Free</span>
              </p>

              <div className="v2-rise v2-rise-1 mt-7 flex items-center gap-4">
                <Image src="/notchtunes/icon.svg" alt="" width={64} height={64} className="h-14 w-14 md:h-16 md:w-16" />
                <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--v2-secondary)]">NotchTunes</span>
              </div>

              <h1
                id="nt-title"
                className="v2-rise v2-rise-1 mt-6 text-balance font-display text-[clamp(2.3rem,4.6vw,4rem)] font-extralight leading-[1.04] tracking-[-0.045em]"
              >
                Your music, living in the <span className="font-normal">notch</span>.
              </h1>

              <p className="v2-rise v2-rise-2 mt-6 max-w-[46ch] text-[16px] leading-relaxed text-[var(--v2-secondary)] md:text-[17px]">
                NotchTunes turns the notch on a MacBook into a tiny player. I
                designed and built it for my own Mac. If you are reading this on
                one, it is yours.
              </p>

              <div className="v2-rise v2-rise-3 mt-8 flex flex-wrap items-center gap-3">
                <DownloadButton />
                <a
                  href="#install"
                  className="rounded-full border border-[var(--v2-line)] px-5 py-3.5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--v2-secondary)] transition-colors duration-200 hover:border-[var(--v2-line-strong)] hover:text-[var(--v2-ink)]"
                >
                  How to install
                </a>
              </div>
              <p className="v2-rise v2-rise-3 mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--v2-label)]">
                <span>{DMG_META}</span>
                <a
                  href={REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--v2-secondary)] underline decoration-[var(--v2-line-strong)] underline-offset-4 transition-colors duration-200 hover:text-[var(--v2-ink)]"
                >
                  Open source on GitHub ↗
                </a>
              </p>
              {!mac && (
                <p className="v2-rise v2-rise-3 mt-4 max-w-[46ch] rounded-[14px] border border-[var(--v2-line)] px-4 py-3 text-[14px] leading-relaxed text-[var(--v2-secondary)]">
                  This is a Mac app. Open{" "}
                  <span className="font-mono text-[var(--v2-ink)]">juliang.de/notchtunes</span>{" "}
                  on your Mac to install it. You can still play with it here.
                </p>
              )}
            </div>

            <div className="v2-rise v2-rise-2 md:col-span-7">
              <NotchDemo />
            </div>
          </section>

          {/* what it does */}
          <section aria-labelledby="nt-what" className="border-t border-[var(--v2-line)] py-14 md:py-20">
            <Label>What it does</Label>
            <SplitTitle
              as="h2"
              text="Three states, nothing else."
              className="mt-4 font-display text-[30px] font-extralight leading-[1.05] tracking-[-0.04em] md:text-[46px]"
            />
            <ol className="mt-10 grid list-none grid-cols-1 gap-4 md:grid-cols-3">
              {states.map((s, i) => (
                <li key={s.n}>
                  <Reveal delay={i * 0.08} className="grain relative h-full overflow-hidden rounded-[20px] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--v2-label)]">{s.n}</p>
                    <h3 className="mt-6 font-display text-[24px] font-light tracking-[-0.03em]">{s.title}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--v2-secondary)]">{s.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </section>

          {/* the case */}
          <section aria-labelledby="nt-case" className="border-t border-[var(--v2-line)] py-14 md:py-20">
            {/* why it exists, before how it was made */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-4">
                <Label>The case · The problem</Label>
                <h2 id="nt-case" className="mt-4 text-balance font-display text-[30px] font-extralight leading-[1.05] tracking-[-0.04em] md:text-[42px]">
                  A notch that does nothing.
                </h2>
              </div>
              <Reveal className="md:col-span-8">
                <p className="max-w-[40ch] text-balance font-display text-[22px] font-light leading-[1.35] tracking-[-0.02em] md:text-[28px]">
                  I love the Dynamic Island on my iPhone: the song I am playing
                  lives right there, one touch away. On my Mac the notch is just
                  a black bar.
                </p>
                <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-[var(--v2-secondary)]">
                  I wanted mine to do more, and I figured a lot of people with a
                  MacBook want the same thing. So I designed and built
                  NotchTunes. I am sharing it for free, and as a sample of the
                  kind of work I can do.
                </p>
              </Reveal>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-4">
                <Label>The design</Label>
                <h3 className="mt-4 text-balance font-display text-[26px] font-extralight leading-[1.08] tracking-[-0.04em] md:text-[34px]">
                  One small card, four players that disagree.
                </h3>
                <p className="mt-5 max-w-[40ch] text-[15px] leading-relaxed text-[var(--v2-secondary)]">
                  Self-initiated, July 2025. I designed it and built it end to
                  end: about 1,800 lines of Swift and SwiftUI.
                </p>
              </div>
              <ol className="list-none border-t border-[var(--v2-line)] md:col-span-8">
                {decisions.map((d, i) => (
                  <li key={d.title} className="border-b border-[var(--v2-line)]">
                    <Reveal delay={i * 0.05} className="grid grid-cols-1 gap-2 py-6 md:grid-cols-[3rem_14rem_1fr] md:gap-6">
                      <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--v2-label)] md:pt-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-[16px] font-medium leading-snug">{d.title}</h3>
                      <p className="text-[15px] leading-relaxed text-[var(--v2-secondary)]">{d.body}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* install */}
          <section id="install" aria-labelledby="nt-install" className="scroll-mt-24 border-t border-[var(--v2-line)] py-14 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Label>Install</Label>
                <h2 id="nt-install" className="mt-4 font-display text-[30px] font-extralight leading-[1.05] tracking-[-0.04em] md:text-[46px]">
                  Two minutes, one warning.
                </h2>
              </div>
              <DownloadButton size="md" />
            </div>
            <ol className="mt-10 grid list-none grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className={i === 2 ? "md:col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
                  <Reveal
                    delay={i * 0.06}
                    className={`relative h-full rounded-[20px] border p-6 ${
                      i === 2
                        ? "border-[var(--v2-accent)] bg-[var(--v2-accent-bg)]"
                        : "border-[var(--v2-line)]"
                    }`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--v2-invert-bg)] font-mono text-[12px] text-[var(--v2-invert-ink)]">
                      {i + 1}
                    </span>
                    <h3 className="mt-5 text-[17px] font-medium leading-snug">{s.title}</h3>
                    <p className="mt-2 text-[15px] leading-[1.75] text-[var(--v2-secondary)]">{s.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>

            {/* for anyone the warning puts off: a person to ask first */}
            <Reveal className="mt-4 grid grid-cols-1 items-center gap-6 rounded-[20px] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-6 md:grid-cols-12 md:p-8">
              <div className="md:col-span-7">
                <h3 className="text-[19px] font-medium leading-snug">Not sure about it? Write to me first.</h3>
                <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-[var(--v2-secondary)]">
                  The warning is there because I have not paid Apple to sign the
                  app, not because anything is hidden. If you would rather ask
                  before you install it, write or call me. That way you also get
                  to know me, and I answer every message.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 md:col-span-5 md:items-end">
                <a
                  href={`mailto:${EMAIL}?subject=NotchTunes`}
                  className="inline-flex items-center gap-2.5 rounded-full border border-[var(--v2-line)] px-5 py-3 font-mono text-[12px] tracking-[0.04em] text-[var(--v2-ink)] transition-colors duration-200 hover:border-[var(--v2-line-strong)]"
                >
                  <span aria-hidden className="text-[var(--v2-label)]">@</span>
                  {EMAIL}
                </a>
                <a
                  href={`tel:${PHONE.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 rounded-full border border-[var(--v2-line)] px-5 py-3 font-mono text-[12px] tracking-[0.04em] text-[var(--v2-ink)] transition-colors duration-200 hover:border-[var(--v2-line-strong)]"
                >
                  <span aria-hidden className="text-[var(--v2-label)]">☏</span>
                  {PHONE}
                </a>
              </div>
            </Reveal>
          </section>

          {/* the fine print */}
          <section aria-label="Details" className="border-t border-[var(--v2-line)] py-14 md:py-20">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {fine.map((f) => (
                <div key={f.title}>
                  <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--v2-label)]">{f.title}</dt>
                  <dd className="mt-3 text-[15px] leading-relaxed text-[var(--v2-secondary)]">{f.body}</dd>
                </div>
              ))}
            </dl>
          </section>
        </main>

        <footer className="mx-auto max-w-[1240px] px-5 pb-14 md:px-8 md:pb-20">
          <div className="grain relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[24px] border border-[var(--v2-line)] bg-[var(--v2-surface)] p-7 md:flex-row md:items-center md:p-10">
            <div>
              <p className="font-display text-[26px] font-extralight leading-tight tracking-[-0.03em] md:text-[34px]">
                Enjoy it. Tell me what you think.
              </p>
              <p className="mt-2 text-[15px] text-[var(--v2-secondary)]">
                Bugs, ideas or a song it got wrong:{" "}
                <a href={`mailto:${EMAIL}?subject=NotchTunes`} className="text-[var(--v2-ink)] underline decoration-[var(--v2-line-strong)] underline-offset-4">
                  {EMAIL}
                </a>{" "}
                or{" "}
                <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="whitespace-nowrap text-[var(--v2-ink)] underline decoration-[var(--v2-line-strong)] underline-offset-4">
                  {PHONE}
                </a>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <DownloadButton size="md" />
              <Link
                href="/"
                className="rounded-full border border-[var(--v2-line)] px-5 py-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--v2-secondary)] transition-colors duration-200 hover:border-[var(--v2-line-strong)] hover:text-[var(--v2-ink)]"
              >
                See my work
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
