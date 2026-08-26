/* One portrait per product, sitting on its card and on its case study cover.
   Four are line-art, drawn from the real interfaces: Duo's ERP (teal status
   system, KPI row, shift row), Duo Scan Memory, TaurusWebs' bulk entry grid
   (blue), Meinerva's dark reading screen. Stroke only, no filled panels, so
   the card's own tint shows through and the drawing reads like a wireframe
   rather than a screenshot: outline boxes, thin dividers, each product's own
   accent colour used only on the few things worth pointing at (a status dot,
   a chart line, a checked box). Savee is the exception and is the real
   exported screen; see the note above it. No filter of any kind here: a
   drop-shadow is a CSS filter, and a filter region on a scaled element inside
   an `isolate` stacking context is what painted the hard edged ghost
   rectangle beside the first card. Decorative: every card names its product
   in text, so these are aria-hidden. */

import Image from "next/image";

/* CSS custom properties, not hex: the same tokens the rest of v2 uses to
   flip between light and dark (globals.css, .v2-root), so the line work
   reads on a light tint in light mode and a near-black tint in dark mode
   without a separate palette to maintain. Browsers resolve var() inside an
   SVG presentation attribute exactly like inside a style rule. */
const LINE = "var(--v2-line)";
const LINE_STRONG = "var(--v2-line-strong)";
const TEXT = "var(--v2-ink)";
const TEXT_DIM = "var(--v2-secondary)";
const TEXT_MUTED = "var(--v2-label)";
const AMBER = "var(--v2-warn)";
const RED = "#C23B2E";

/* ---------- Duo ERP ---------- */
export function ErpScreen({ className = "" }: { className?: string }) {
  const accent = "#2E8A77";
  const stats = [
    { k: "REVENUE", v: "€4,780" },
    { k: "WASTE", v: "1.4%" },
    { k: "ON SHIFT", v: "11" },
    { k: "EXPIRING", v: "4" },
  ];
  const alerts = [
    { c: AMBER, t: "Contract expires" },
    { c: RED, t: "Cert not uploaded" },
    { c: AMBER, t: "Missing IBAN" },
  ];
  return (
    <svg
      viewBox="0 0 360 240"
      aria-hidden
      role="presentation"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      fontFamily="inherit"
    >
      {/* stat row */}
      {stats.map((s, i) => (
        <g key={s.k}>
          <rect x={18 + i * 85} y="14" width="73" height="46" rx="8" fill="none" stroke={LINE} />
          <text x={28 + i * 85} y="30" fontSize="5.4" fill={TEXT_MUTED} letterSpacing="0.4">
            {s.k}
          </text>
          <text x={28 + i * 85} y="45" fontSize="10" fontWeight="600" fill={i === 0 ? accent : TEXT}>
            {s.v}
          </text>
        </g>
      ))}

      {/* chart panel */}
      <rect x="18" y="72" width="166" height="76" rx="8" fill="none" stroke={LINE} />
      <text x="28" y="88" fontSize="5.6" fill={TEXT_DIM}>
        Revenue · this week
      </text>
      <path
        d="M28 132 L44 123 L60 126 L76 111 L92 116 L108 101 L124 106 L140 94 L156 99"
        fill="none"
        stroke={accent}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 132 L44 123 L60 126 L76 111 L92 116 L108 101 L124 106 L140 94 L156 99 L156 138 L28 138 Z"
        fill={accent}
        fillOpacity="0.1"
      />
      <circle cx="156" cy="99" r="2.2" fill={accent} />

      {/* alerts panel */}
      <rect x="196" y="72" width="146" height="76" rx="8" fill="none" stroke={LINE} />
      <text x="206" y="88" fontSize="5.6" fill={TEXT_DIM}>
        Alerts
      </text>
      {alerts.map((a, i) => (
        <g key={a.t}>
          <circle cx="210" cy={101 + i * 15} r="2.2" fill={a.c} />
          <text x="218" y={103 + i * 15} fontSize="5.6" fill={TEXT_DIM}>
            {a.t}
          </text>
        </g>
      ))}

      {/* shift row */}
      <rect x="18" y="160" width="324" height="62" rx="8" fill="none" stroke={LINE} />
      <circle cx="46" cy="191" r="10" fill="none" stroke={LINE} />
      <text x="66" y="186" fontSize="7" fontWeight="600" fill={TEXT}>
        Marco G.
      </text>
      <text x="66" y="197" fontSize="5.6" fill={TEXT_MUTED}>
        Manager
      </text>
      <text x="240" y="194" fontSize="6" fill={TEXT_DIM} textAnchor="end">
        07:00 - 15:00
      </text>
      <rect x="256" y="176" width="66" height="22" rx="11" fill="none" stroke={accent} strokeWidth="1" />
      <circle cx="269" cy="187" r="2" fill={accent} />
      <text x="278" y="189.5" fontSize="5.6" fill={accent} letterSpacing="0.3">
        ON NOW
      </text>
    </svg>
  );
}

/* ---------- TaurusWebs ---------- */
export function TaurusScreen({ className = "" }: { className?: string }) {
  const accent = "#1F5FBF";
  const rows = [
    { id: "CO-4821", plot: "Potrero 3", w: "412 kg", type: "Vaca", ok: true },
    { id: "CO-4822", plot: "Potrero 3", w: "398 kg", type: "Vaca", ok: true },
    { id: "CO-4823", plot: "Potrero 1", w: "··", type: "Novillo", ok: false },
    { id: "CO-4824", plot: "Potrero 5", w: "441 kg", type: "Toro", ok: true },
  ];
  const heads = ["ID", "Potrero", "Peso", "Tipo", "Estado"];
  const cols = [36, 110, 180, 232, 282];
  return (
    <svg
      viewBox="0 0 360 240"
      aria-hidden
      role="presentation"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      fontFamily="inherit"
    >
      {/* toolbar */}
      <rect x="18" y="16" width="92" height="22" rx="11" fill="none" stroke={accent} strokeWidth="1.1" />
      <text x="64" y="30.5" fontSize="6" fontWeight="600" fill={accent} textAnchor="middle">
        Carga múltiple
      </text>
      <rect x="118" y="16" width="70" height="22" rx="11" fill="none" stroke={LINE} />
      <text x="153" y="30.5" fontSize="5.8" fill={TEXT_DIM} textAnchor="middle">
        Pegar filas
      </text>
      <rect x="250" y="16" width="92" height="22" rx="11" fill="none" stroke={LINE} />
      <text x="260" y="30.5" fontSize="5.8" fill={TEXT_MUTED}>
        Buscar animal
      </text>

      {/* header */}
      <line x1="18" y1="50" x2="342" y2="50" stroke={LINE} />
      <rect x="18" y="53.5" width="9" height="9" rx="2" fill="none" stroke={LINE} />
      {heads.map((h, i) => (
        <text key={h} x={cols[i]} y="60" fontSize="5.8" fontWeight="600" fill={TEXT_MUTED} letterSpacing="0.2">
          {h}
        </text>
      ))}

      {rows.map((r, i) => {
        const y = 72 + i * 32;
        return (
          <g key={r.id}>
            {i > 0 && <line x1="18" y1={y - 6} x2="342" y2={y - 6} stroke={LINE} strokeOpacity="0.5" />}
            <rect x="18" y={y - 4.5} width="9" height="9" rx="2" fill="none" stroke={r.ok ? accent : LINE} />
            {r.ok && (
              <path d={`M20 ${y} l1.6 1.6 3 -3.2`} stroke={accent} strokeWidth="1.1" fill="none" strokeLinecap="round" />
            )}
            <text x={cols[0]} y={y + 2.4} fontSize="6" fontWeight="600" fill={TEXT}>
              {r.id}
            </text>
            <text x={cols[1]} y={y + 2.4} fontSize="6" fill={TEXT_DIM}>
              {r.plot}
            </text>
            <text x={cols[2]} y={y + 2.4} fontSize="6" fill={r.w === "··" ? RED : TEXT_DIM}>
              {r.w}
            </text>
            <text x={cols[3]} y={y + 2.4} fontSize="6" fill={TEXT_DIM}>
              {r.type}
            </text>
            <rect
              x={cols[4] - 2}
              y={y - 6}
              width="58"
              height="16"
              rx="8"
              fill="none"
              stroke={r.ok ? accent : AMBER}
            />
            <text x={cols[4] + 27} y={y + 3} fontSize="5.4" fontWeight="600" fill={r.ok ? accent : AMBER} textAnchor="middle">
              {r.ok ? "Validado" : "Falta peso"}
            </text>
          </g>
        );
      })}

      {/* footer */}
      <line x1="18" y1="204" x2="342" y2="204" stroke={LINE} />
      <text x="18" y="220" fontSize="6" fill={TEXT_MUTED}>
        68 de 70 listos · 2 requieren datos
      </text>
      <rect x="254" y="210" width="88" height="20" rx="10" fill="none" stroke={accent} strokeWidth="1.1" />
      <text x="298" y="223.5" fontSize="6" fontWeight="600" fill={accent} textAnchor="middle">
        Guardar 68
      </text>
    </svg>
  );
}

/* ---------- Savee ---------- */
/* The only one here that is not drawn. This is the real shopping list screen
   exported from the Figma file, so the card shows the product rather than my
   reading of it.
   It ships as a raster, not as the SVG it was exported as. Figma writes the
   frosted panels as `foreignObject` with `backdrop-filter`, and Chrome refuses
   to render foreign content when an SVG is the src of an `<img>`, so the blur
   and the angular gradients would silently drop out. Rasterised at 2x the
   export is 35KB against the SVG's 2.4MB. Source kept in
   OLD/savee-cover-source/.
   The radius is written per axis so the corners stay circular at every size
   the card renders: at this aspect 14% of the width is 6.5% of the height. */
export function SaveeScreen({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/projects/savee/cover-screen.webp"
      alt=""
      aria-hidden
      width={780}
      height={1688}
      sizes="(max-width: 768px) 60vw, 300px"
      className={className}
      style={{ borderRadius: "14% / 6.5%" }}
    />
  );
}

/* ---------- Meinerva ---------- */
export function MeinervaScreen({ className = "" }: { className?: string }) {
  const accent = "#C6A96B";
  const dots = Array.from({ length: 40 }, (_, i) => {
    const t = i / 39;
    return {
      x: 30 + t * 110,
      y: 136 + Math.sin(t * Math.PI * 3) * 8 + Math.cos(t * Math.PI * 5) * 2.6,
      r: 0.7 + (i % 4) * 0.22,
    };
  });
  return (
    <svg
      viewBox="0 0 170 320"
      aria-hidden
      role="presentation"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      fontFamily="inherit"
    >
      <rect x="4" y="4" width="162" height="312" rx="20" fill="none" stroke={LINE} />
      <text x="18" y="22" fontSize="6.4" fontWeight="600" fill={TEXT_MUTED}>
        9:41
      </text>

      {/* the work, still veiled */}
      <rect x="18" y="32" width="134" height="74" rx="9" fill="none" stroke={LINE} />
      <circle cx="60" cy="68" r="18" fill="none" stroke={LINE_STRONG} />
      <circle cx="98" cy="62" r="11" fill="none" stroke={LINE} />
      <rect x="128" y="40" width="16" height="16" rx="8" fill="none" stroke={accent} />
      <circle cx="136" cy="48" r="2.4" fill={accent} />

      {/* dotted wordmark */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={accent} fillOpacity={0.4 + (i % 3) * 0.12} />
      ))}
      <text x="85" y="154" fontSize="5.8" textAnchor="middle" fill={TEXT_MUTED} letterSpacing="1.2">
        LOOK FIRST
      </text>

      {/* your reading */}
      <rect x="18" y="166" width="134" height="52" rx="9" fill="none" stroke={LINE} />
      <text x="27" y="180" fontSize="6.2" fill={TEXT_MUTED}>
        Your reading
      </text>
      {[189, 199, 209].map((y, i) => (
        <line
          key={y}
          x1="27"
          y1={y}
          x2={27 + (i === 2 ? 62 : 116 - i * 14)}
          y2={y}
          stroke={LINE_STRONG}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}

      {/* the hint, locked until you write */}
      <rect x="18" y="226" width="76" height="17" rx="8.5" fill="none" stroke={accent} />
      <circle cx="30" cy="234.5" r="2.6" fill={accent} />
      <text x="39" y="237" fontSize="6" fill={accent}>
        Unlock hint
      </text>

      {/* community critiques */}
      <text x="18" y="260" fontSize="6" fill={TEXT_MUTED}>
        Critiques · 12
      </text>
      {[268, 285, 302].map((y, i) => (
        <g key={y}>
          <rect x={18 + i * 3} y={y} width={134 - i * 6} height="14" rx="7" fill="none" stroke={LINE} />
          <circle cx={28 + i * 3} cy={y + 7} r="4" fill="none" stroke={LINE_STRONG} />
          <line
            x1={38 + i * 3}
            y1={y + 7}
            x2={38 + i * 3 + (72 - i * 10)}
            y2={y + 7}
            stroke={LINE_STRONG}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
}

/* ---------- Duo Scan Memory ---------- */
export function ScanMemoryScreen({ className = "" }: { className?: string }) {
  const accent = "#2E8A77";
  const scanned = [
    { f: "Pistacchio", n: 12 },
    { f: "Stracciatella", n: 9 },
    { f: "Nocciola", n: 8 },
    { f: "Limone", n: 6 },
  ];
  const total = scanned.reduce((a, r) => a + r.n, 0);

  return (
    <svg
      viewBox="0 0 360 240"
      aria-hidden
      role="presentation"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      fontFamily="inherit"
    >
      {/* store picker */}
      <rect x="18" y="18" width="110" height="22" rx="11" fill="none" stroke={accent} strokeWidth="1.1" />
      <text x="28" y="32.5" fontSize="6.2" fontWeight="600" fill={TEXT}>
        Mitte · Torstraße
      </text>
      <path d="M120 26 l3.2 3.2 3.2-3.2" stroke={accent} strokeWidth="1.1" fill="none" strokeLinecap="round" />

      <g>
        <circle cx="142" cy="29" r="2.2" fill={accent} />
        <text x="149" y="31.4" fontSize="5.6" fill={TEXT_MUTED}>
          Scanner connected
        </text>
      </g>

      {/* the scan field */}
      <rect x="232" y="18" width="110" height="22" rx="11" fill="none" stroke={LINE} />
      <text x="242" y="32.5" fontSize="6" fontFamily="ui-monospace, monospace" fill={TEXT_DIM}>
        8412 0093 5517
      </text>

      {/* ── the new lower panel ── */}
      <rect x="18" y="54" width="324" height="128" rx="8" fill="none" stroke={LINE} />
      <line x1="18" y1="72" x2="342" y2="72" stroke={LINE} />
      <text x="28" y="66" fontSize="5.8" fontWeight="600" fill={TEXT_MUTED} letterSpacing="0.3">
        SCANNED THIS DELIVERY
      </text>
      <text x="332" y="66" fontSize="5.8" fontWeight="700" fill={accent} textAnchor="end">
        {total} units
      </text>

      {scanned.map((r, i) => {
        const y = 90 + i * 22;
        const on = i === 0;
        return (
          <g key={r.f}>
            {i > 0 && <line x1="28" y1={y - 8} x2="332" y2={y - 8} stroke={LINE} strokeOpacity="0.5" />}

            <rect x="28" y={y - 4.5} width="9" height="9" rx="2.5" fill="none" stroke={on ? accent : LINE} />
            {on && (
              <path
                d={`M30.3 ${y} l1.6 1.7 l2.7 -3.2`}
                stroke={accent}
                strokeWidth="1.1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            <text x="44" y={y + 2.4} fontSize="6.6" fontWeight={on ? 600 : 400} fill={TEXT}>
              {r.f}
            </text>

            {/* how much of the delivery this flavour is */}
            <rect x="150" y={y - 2} width="70" height="5" rx="2.5" fill="none" stroke={LINE} />
            <rect x="150" y={y - 2} width={(r.n / 12) * 70} height="5" rx="2.5" fill={accent} fillOpacity="0.5" />

            <text x="256" y={y + 2.4} fontSize="6.6" fontWeight="700" fill={TEXT} textAnchor="middle">
              {r.n}
            </text>

            {/* far right: the whole row goes, or you step into it */}
            {on ? (
              <g stroke={RED} strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="316" y1={y - 2.5} x2="322" y2={y + 3.5} />
                <line x1="322" y1={y - 2.5} x2="316" y2={y + 3.5} />
              </g>
            ) : (
              <path
                d={`M316 ${y - 3} l3.4 3.4 l-3.4 3.4`}
                stroke={TEXT_MUTED}
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </g>
        );
      })}

      {/* the two ways out */}
      <rect x="18" y="198" width="96" height="20" rx="10" fill="none" stroke={LINE} />
      <text x="66" y="211.5" fontSize="6" fill={TEXT_DIM} textAnchor="middle">
        Remove unit
      </text>
      <rect x="246" y="198" width="96" height="20" rx="10" fill="none" stroke={accent} strokeWidth="1.1" />
      <text x="294" y="211.5" fontSize="6" fontWeight="600" fill={accent} textAnchor="middle">
        Accept · send
      </text>
    </svg>
  );
}

export const screens = {
  "erp-duo": ErpScreen,
  "scan-memory": ScanMemoryScreen,
  taurus: TaurusScreen,
  savee: SaveeScreen,
  meinerva: MeinervaScreen,
} as const;

export type ScreenSlug = keyof typeof screens;
