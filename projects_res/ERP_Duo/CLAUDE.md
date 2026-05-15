# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Duo · Sicilian Ice Cream ERP** — a portfolio demo dashboard for a 5-store gelato operation in Berlin. No backend, no build system.

## Development

Open directly in any browser — no server, no install, no build step:

```bash
open "ERP Duo Dashboard.html"
```

Viewport is fixed at `width=1440`. Always preview at that width. Save a new version to `Versions/` before major restructures (naming: `duo_erp_v{n}.html`).

## Architecture

Single self-contained HTML file (~1380 lines). All CSS, markup, and JS are inline.

**External CDN dependencies:**
- Chart.js 4.4.1 (`chart.umd.min.js`)
- Leaflet 1.9.4 (map + CSS)
- Google Fonts: Barlow (UI) + JetBrains Mono (numbers/mono)

**Layout:** CSS Grid — `220px sidebar + 1fr main`. Sidebar is `position: sticky; height: 100vh`.

**View system:** Three in-page views toggled via `showView(name)`:
- `#viewDashboard` — default, toggled via `display`
- `#viewInventory` — toggled via `.on` class
- `#viewStaff` — toggled via `.on` class

Nav items set `active` class on themselves; `showView()` handles title + scroll reset.

**All data is hardcoded** in JS arrays/objects — no API calls, no fetch.

## Design tokens (CSS variables)

```
--bg: #FAFAFA       --card: #FFFFFF     --line: #EEEEEE
--ink: #161616      --t1: #3A3A3A       --t2: #777777
--t3: #A5A5A5       --t4: #D4D4D4
--teal: #7BC4B0     --teal-deep: #3D8A78
--red: #C03030      --amber: #B07020
--r-sm: 6px         --r-md: 10px        --r-lg: 14px    --r-pill: 999px
```

Primary accent is `--teal` / `--teal-deep`. Status colors: teal = ok, amber = warn, red = crit. Never use raw hex in new styles — use tokens.

## Key components

| Class/ID | Purpose |
|---|---|
| `.kpi` / `.kpi.primary` | KPI stat cards (left teal border on primary) |
| `.card` | Generic white bordered container |
| `.pill` / `.pill.ok/.warn/.crit` | Border-only status badges |
| `.tabs` / `.pill-tabs` | Button group toggles (`.on` = active) |
| `table.dt` | Data tables with `.num`, `.muted`, `.r`, `.c` modifiers |
| `.products-grid` | 4-col product stock tiles (`.crit` / `.warn` states) |
| `.section-label` | ALL-CAPS section header row with optional `.count` badge |
| `.grid-21` | 2fr + 1fr two-column layout |

## Inventory view internals

- `ALL` array — rows: `[name, category, location, stock, min, status, expiry, action]`
- `renderInv(filter)` — re-renders `#invTable`; filter is `"all"`, `"ok"`, `"warn"`, or `"crit"`
- `INV_DAYS` object — maps flavor name → days of stock remaining
- `#invFilters` buttons set `data-f` attribute to drive filter

## Map (Leaflet)

- Center: Berlin Kreuzberg lab `[52.500, 13.395]`
- `STORE_POS` — 5 store coords + delivery status (`done` / `transit` / `pending`)
- `focusStore(storeId)` — fits bounds, opens popup, highlights store card and route row
- `routeForStore()` / `storeForRoute()` — bidirectional store↔route mapping
- Call `map.invalidateSize()` after any layout change that hides/shows the map container

## Chart.js conventions

Both charts use `responsive: true, maintainAspectRatio: false`. Color constants at top of `<script>`:
- `TEAL`, `TEAL_FILL` — line dataset accent
- `DARK_BAR`, `DARK_BORDER` — bar dataset fill/border
- Tooltip style: white bg, `#E8E8E8` border, no color swatches
