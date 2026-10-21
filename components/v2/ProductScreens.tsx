/* One drawing per product, sitting on its card and on its case study cover.
   All line art, drawn from the real interfaces: Duo's ERP (teal status
   system, KPI row, shift row), Duo Scan Memory, TaurusWebs' bulk entry grid
   (blue), and the two mobile ones as three phones each (Savee drawn,
   Meinerva from its real prototype screens, see below). All five share one
   360 x 240 frame, so every card is the same kind of object. Stroke only,
   no filled panels, so the card's own tint shows through and the drawing reads
   like a wireframe rather than a screenshot: outline boxes, thin dividers,
   each product's own accent colour used only on the few things worth pointing
   at (a status dot, a chart line, a checked box). No filter of any kind here:
   a drop-shadow is a CSS filter, and a filter region on a scaled element
   inside an `isolate` stacking context is what painted the hard edged ghost
   rectangle beside the first card. Decorative: every card names its product
   in text, so these are aria-hidden. */

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

/* ---------- Phones (Savee, Meinerva) ---------- */
/* The two mobile products are drawn as three phones in a row on the same
   360 x 240 frame as the desktop ones, each phone one step of the flow with
   its step named underneath, so the card reads as an app being used rather
   than as a dashboard. Phone geometry is shared with CardDemo, which places
   its pointer and results in these same coordinates. */
export const PHONE = { w: 98, h: 212, y: 4, xs: [11, 131, 251], rx: 14 } as const;

/* a point on a 390 x 844 prototype screen, mapped onto phone `i` */
export function onPhone(i: number, px: number, py: number) {
  const k = PHONE.w / 390;
  return { x: PHONE.xs[i] + px * k, y: PHONE.y + py * k };
}

function StepLabels({ steps }: { steps: string[] }) {
  return (
    <>
      {steps.map((t, i) => (
        <text
          key={t}
          x={PHONE.xs[i] + PHONE.w / 2}
          y="233"
          fontSize="5.2"
          fill={TEXT_DIM}
          textAnchor="middle"
          letterSpacing="0.5"
        >
          <tspan fill={TEXT_MUTED}>{String(i + 1).padStart(2, "0")}</tspan>
          {"  "}
          {t.toUpperCase()}
        </text>
      ))}
    </>
  );
}

/* ---------- Savee ---------- */
/* Drawn from the real screens: the SAVEE wordmark, the toggle in the corner,
   the floating tab bar, the list grouped by aisle. Watch a recipe short, add
   it, and the list on the third phone fills with its ingredients (CardDemo
   draws that part). */
export const SAVEE_ACCENT = "#6CC24A";

function SaveeChrome({ active, corner }: { active: number; corner: "plus" | "play" | "fork" }) {
  const a = SAVEE_ACCENT;
  return (
    <>
      <text x="8" y="11" fontSize="4.2" fontWeight="600" fill={TEXT_DIM}>
        18:12
      </text>
      <rect x="83" y="7.2" width="8" height="4" rx="1.2" fill="none" stroke={TEXT_MUTED} strokeWidth="0.6" />
      <text x="8" y="27" fontSize="7.4" fontWeight="800" fill={a} letterSpacing="0.3">
        SAVEE
      </text>
      {corner === "plus" ? (
        <g stroke={a} strokeWidth="0.9" fill="none" strokeLinecap="round">
          <circle cx="86" cy="24.5" r="5" />
          <path d="M83.6 24.5 h4.8 M86 22.1 v4.8" />
        </g>
      ) : (
        <g>
          <rect x="66" y="19.5" width="25" height="10" rx="5" fill="none" stroke={LINE_STRONG} />
          {/* the toggle flips sides: video mode sits on the left, the
              recipe (fork) on the right, as in the app */}
          <circle cx={corner === "play" ? 71 : 86} cy="24.5" r="3.6" fill={a} />
          {corner === "play" ? (
            <path d="M70 22.6 L73 24.5 L70 26.4 Z" fill="var(--v2-bg)" />
          ) : (
            <path d="M84.6 26.2 L87.2 22.8 M86.2 22.4 l1.4 1.1" stroke="var(--v2-bg)" strokeWidth="0.7" strokeLinecap="round" />
          )}
        </g>
      )}
      {/* the floating tab bar */}
      <rect x="6" y="192" width="86" height="14" rx="7" fill="none" stroke={LINE_STRONG} />
      {[17, 33, 49, 65, 81].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy="199"
          r={i === 4 ? 3 : 2.3}
          fill={i === active ? a : "none"}
          fillOpacity={i === active ? 0.9 : 1}
          stroke={i === active ? a : TEXT_MUTED}
          strokeWidth="0.7"
        />
      ))}
    </>
  );
}

function SaveeRow({ y, name, qty, sub }: { y: number; name: string; qty: string; sub?: string }) {
  return (
    <g>
      <circle cx="13" cy={y - 1.6} r="3" fill="none" stroke={LINE_STRONG} strokeWidth="0.8" />
      <text x="20" y={y} fontSize="4.6" fill={TEXT}>
        {name}
      </text>
      {sub && (
        <text x="20" y={y + 4.6} fontSize="3.2" fill={TEXT_MUTED}>
          {sub}
        </text>
      )}
      <text x="90" y={y} fontSize="4.2" fill={TEXT_DIM} textAnchor="end">
        {qty}
      </text>
    </g>
  );
}

export function SaveeScreen({ className = "" }: { className?: string }) {
  const a = SAVEE_ACCENT;
  return (
    <svg
      viewBox="0 0 360 240"
      aria-hidden
      role="presentation"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      fontFamily="inherit"
    >
      {PHONE.xs.map((x) => (
        <rect key={x} x={x} y={PHONE.y} width={PHONE.w} height={PHONE.h} rx={PHONE.rx} fill="none" stroke={LINE_STRONG} />
      ))}

      {/* 1 · the feed: a recipe short playing */}
      <g transform={`translate(${PHONE.xs[0]} ${PHONE.y})`}>
        <SaveeChrome active={0} corner="plus" />
        <rect x="6" y="34" width="86" height="152" rx="8" fill="none" stroke={LINE} />
        <path d="M6 150 Q24 124 40 136 T70 120 T92 130" fill="none" stroke={LINE_STRONG} strokeWidth="1" strokeLinecap="round" />
        <circle cx="49" cy="100" r="10" fill="none" stroke={a} strokeWidth="1" />
        <path d="M46 95 L54.5 100 L46 105 Z" fill={a} />
        <g fill="none" stroke={TEXT_DIM} strokeWidth="0.8" strokeLinejoin="round">
          <path d="M84 46.5 c-1.6-2.4-4.6-0.6-2.6 1.8 l2.6 2.6 2.6-2.6 c2-2.4-1-4.2-2.6-1.8 z" />
          <path d="M81.6 56 h4.8 v6.4 l-2.4-1.8 -2.4 1.8 z" />
        </g>
        <text x="12" y="167" fontSize="5.4" fontWeight="600" fill={TEXT}>
          Tomato basil pasta
        </text>
        <text x="12" y="174.5" fontSize="3.8" fill={TEXT_MUTED}>
          20 min · Easy
        </text>
        <line x1="12" y1="182" x2="86" y2="182" stroke={LINE_STRONG} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="12" y1="182" x2="30" y2="182" stroke={a} strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* 2 · the recipe, with the list it brings */}
      <g transform={`translate(${PHONE.xs[1]} ${PHONE.y})`}>
        <SaveeChrome active={2} corner="play" />
        <rect x="6" y="34" width="86" height="54" rx="7" fill="none" stroke={LINE} />
        <path d="M6 70 Q26 52 44 62 T92 54" fill="none" stroke={LINE_STRONG} strokeWidth="1" strokeLinecap="round" />
        <rect x="11" y="68" width="76" height="16" rx="4" fill="none" stroke={LINE_STRONG} />
        <text x="15" y="75" fontSize="4.4" fontWeight="600" fill={TEXT}>
          Tomato basil pasta
        </text>
        <text x="15" y="81" fontSize="3.4" fill={TEXT_MUTED}>
          20 min · Easy
        </text>
        <rect x="6" y="94" width="86" height="12" rx="6" fill="none" stroke={LINE} />
        <text x="11" y="101.6" fontSize="4.2" fill={TEXT}>
          Adjust portions
        </text>
        <text x="86" y="101.6" fontSize="4.2" fill={TEXT_DIM} textAnchor="end">
          –  2  +
        </text>
        <text x="49" y="120" fontSize="4.4" fontWeight="600" fill={TEXT} textAnchor="middle">
          Shopping list for this recipe
        </text>
        <SaveeRow y={133} name="Tomatoes" qty="400 g" />
        <SaveeRow y={146} name="Basil" qty="1 bunch" />
        <SaveeRow y={159} name="Spaghetti" qty="250 g" />
        <rect x="12" y="170" width="74" height="13" rx="6.5" fill="none" stroke={a} strokeWidth="0.9" />
        <text x="49" y="178.4" fontSize="4.6" fontWeight="600" fill={a} textAnchor="middle">
          + Add to list
        </text>
      </g>

      {/* 3 · the shopping list, waiting for the recipe */}
      <g transform={`translate(${PHONE.xs[2]} ${PHONE.y})`}>
        <SaveeChrome active={2} corner="fork" />
        <text x="49" y="42" fontSize="5" fontWeight="600" fill={TEXT} textAnchor="middle">
          My shopping list
        </text>
        <text x="8" y="53" fontSize="3.8" fill={TEXT_MUTED}>
          Sort by ▾
        </text>
        <text x="8" y="64" fontSize="4.6" fontWeight="600" fill={TEXT}>
          Veggies & Fruits
        </text>
        <SaveeRow y={76} name="Blueberry" qty="25 g" />
        <SaveeRow y={88} name="Banana" qty="1 Pcs." />
        <text x="8" y="102" fontSize="4.6" fontWeight="600" fill={TEXT}>
          Bakery
        </text>
        <SaveeRow y={114} name="Sliced bread" qty="1 Pkt." />
        <text x="8" y="130" fontSize="4.6" fontWeight="600" fill={TEXT}>
          From recipes
        </text>
        <rect x="8" y="136" width="82" height="44" rx="5" fill="none" stroke={LINE_STRONG} strokeDasharray="2 2.2" />
        <text x="49" y="160" fontSize="4" fill={TEXT_MUTED} textAnchor="middle">
          Add a recipe to fill this
        </text>
      </g>

      <StepLabels steps={["Watch", "Add to list", "Shop"]} />
    </svg>
  );
}

/* ---------- Meinerva ---------- */
/* The real prototype screens, not a drawing: the work is the product here, and
   a halftone that turns into colour cannot be drawn in outline. Look for
   twenty seconds while the phone is locked, write a critique over the work
   still in halftone, and the work comes back in colour with the artist's
   hints on it. CardDemo plays the transitions between these screens. */
export const MEINERVA_ACCENT = "#C6A96B";

/* clip ids are fixed, not useId: two Meinerva demos never share a page, and
   CardDemo's overlay has to name the same clips */
export const meinervaClip = (i: number) => `mnv-phone-${i}`;

export const MEINERVA_SHOTS = {
  lock: "/projects/meinerva/wait.webp",
  home: "/projects/meinerva/demo/home.webp",
  write: "/projects/meinerva/demo/write.webp",
  observe: "/projects/meinerva/demo/observe.webp",
  colour: "/projects/meinerva/colour.webp",
  hint: "/projects/meinerva/hint.webp",
};

export function PhoneShot({ i, href }: { i: number; href: string }) {
  return (
    <image
      href={href}
      x={PHONE.xs[i]}
      y={PHONE.y}
      width={PHONE.w}
      height={PHONE.h}
      preserveAspectRatio="xMidYMid slice"
      clipPath={`url(#${meinervaClip(i)})`}
    />
  );
}

export function MeinervaScreen({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 240"
      aria-hidden
      role="presentation"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      fontFamily="inherit"
    >
      <defs>
        {PHONE.xs.map((x, i) => (
          <clipPath key={x} id={meinervaClip(i)}>
            <rect x={x} y={PHONE.y} width={PHONE.w} height={PHONE.h} rx={PHONE.rx} />
          </clipPath>
        ))}
      </defs>
      <PhoneShot i={0} href={MEINERVA_SHOTS.lock} />
      <PhoneShot i={1} href={MEINERVA_SHOTS.home} />
      <PhoneShot i={2} href={MEINERVA_SHOTS.observe} />
      {PHONE.xs.map((x) => (
        <rect key={x} x={x} y={PHONE.y} width={PHONE.w} height={PHONE.h} rx={PHONE.rx} fill="none" stroke={LINE_STRONG} />
      ))}
      <StepLabels steps={["Look, 20 s", "Write a critique", "The work unlocks"]} />
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
      <path d="M112 26 l3.2 3.2 3.2-3.2" stroke={accent} strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />

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

            {/* −  n  +  : nudge this line's count up or down by a unit */}
            <g strokeLinecap="round">
              <rect x="238" y={y - 4} width="9" height="9" rx="2.5" fill="none" stroke={LINE_STRONG} />
              <line x1="240.6" y1={y + 0.5} x2="244.4" y2={y + 0.5} stroke={TEXT_MUTED} strokeWidth="1.1" />
              <rect x="269" y={y - 4} width="9" height="9" rx="2.5" fill="none" stroke={LINE_STRONG} />
              <line x1="271.6" y1={y + 0.5} x2="275.4" y2={y + 0.5} stroke={TEXT_MUTED} strokeWidth="1.1" />
              <line x1="273.5" y1={y - 1.4} x2="273.5" y2={y + 2.4} stroke={TEXT_MUTED} strokeWidth="1.1" />
            </g>
            <text x="258" y={y + 2.4} fontSize="6.6" fontWeight="700" fill={TEXT} textAnchor="middle">
              {r.n}
            </text>

            {/* far right: drop this line's units */}
            <g
              stroke={on ? RED : TEXT_MUTED}
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="314" y1={y - 3} x2="320" y2={y + 3} />
              <line x1="320" y1={y - 3} x2="314" y2={y + 3} />
            </g>
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
