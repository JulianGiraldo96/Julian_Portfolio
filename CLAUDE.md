@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js version

This project runs **Next.js 16.2.4 with React 19.2.4**. Per `AGENTS.md`, this is NOT the Next.js that matches older training data — APIs, conventions, and file structure may differ. Before writing Next.js code (routing, metadata, fonts, config, server/client boundaries), consult `node_modules/next/dist/docs/` and obey any deprecation notices in that version.

## Commands

- `npm run dev` — start dev server at http://localhost:3000
- `npm run build` — production build
- `npm run start` — run the built app
- `npm run lint` — ESLint (uses `eslint.config.mjs` with `eslint-config-next`)
- `node scripts/snap.mjs` — Playwright script that screenshots the reference Framer site (`fair-office-758527.framer.app`) into `/tmp/framer_snaps`. Used as a visual reference while porting the design; requires `playwright` installed locally (not in `package.json`).

No test framework is configured.

## Architecture

Single-page portfolio site for Julian Giraldo (visual/experience designer). Next.js **App Router** with one route.

- `app/layout.tsx` — root layout. Loads Geist Sans, Geist Mono, and Inter (as `--font-display`) via `next/font/google`. Wraps the app in `SmoothScroll` and injects global `Cursor` + `Nav`. Body gets `has-cursor` class, signalling the custom cursor is active.
- `app/page.tsx` — composes the whole site as vertically stacked sections: `Hero → Work → About → Experience → Contact`. Adding a section means adding a component here.
- `app/globals.css` — Tailwind v4 (via `@tailwindcss/postcss`) + CSS custom properties for the font variables and theme tokens (`bg-background`, `text-foreground`).
- `components/` — all section components plus shared UI primitives:
  - `SmoothScroll.tsx` wraps children with **Lenis** smooth scrolling; any scroll-linked animation must be compatible with Lenis driving the scroll position.
  - `Cursor.tsx` is a custom cursor that follows pointer movement; `MagneticButton.tsx` and `RevealText.tsx` are interaction primitives used by sections. Animations use the `motion` package (Framer Motion successor).
- `@/*` path alias maps to the project root (see `tsconfig.json`), so imports are `@/components/...`.

## Conventions

- Strict TypeScript. `jsx: react-jsx` — no `import React` needed for JSX.
- Tailwind v4 is configured via PostCSS only (no `tailwind.config.*`); extend theme through CSS custom properties in `globals.css`.
- Keep the layout-level providers (`SmoothScroll`, `Cursor`, `Nav`) in `app/layout.tsx` — sections should not re-mount their own scroll/cursor machinery.

## Image rules (MANDATORY — never break these)

- **No letterboxing / black bars ever.** Images must always render at their natural aspect ratio. Never place an image inside a fixed-size container that is a different shape — this creates black borders on the sides or top/bottom.
- Never use `object-contain` inside a fixed aspect-ratio box unless the box's ratio exactly matches the image. Use `object-cover` (crops) or let the container size to the image (`h-auto`, `w-auto`).
- For scrollable screen galleries (`ScreensGrid`): fix height (`h-[480px]`), set `width: auto` on the image, and let the container shrink-wrap the image width. No forced aspect-ratio wrapper.
- For inline section images with a background (`SectionMedia` with `bg`): the wrapper must be `w-full` and contain only `<img class="w-full h-auto" />` so height is always proportional to width.
