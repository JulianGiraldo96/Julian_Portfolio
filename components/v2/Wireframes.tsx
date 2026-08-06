"use client";

/* Low fidelity wireframes, drawn the way they would be in Figma: one weight of
   line, grey blocks standing in for words, and no colour to argue about.

   Everything is stroked in `currentColor` and filled with it at low opacity, so
   every set inverts with the theme instead of being black rectangles that
   vanish on a dark page.

   Each frame is one answer to the same question, and they are meant to be read
   side by side. Phone projects draw the device centred inside the same landscape
   frame, so a row of four stays one row of four whatever the product is.

   The primitives below keep each frame to a handful of lines. Add a frame by
   composing them, not by hand placing rectangles. */

const S = {
  stroke: "currentColor",
  strokeWidth: 1.1,
  fill: "none",
  vectorEffect: "non-scaling-stroke" as const,
};

const W = 320;
const H = 230;

/* a grey block where a word would be */
function Bar({
  x,
  y,
  w,
  h = 4,
  o = 0.16,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  o?: number;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="currentColor" opacity={o} />;
}

function Box({
  x,
  y,
  w,
  h,
  r = 3,
  dash,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  dash?: boolean;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={r} {...S} strokeDasharray={dash ? "3 4" : undefined} />;
}

function Solid({ x, y, w, h, r = 3 }: { x: number; y: number; w: number; h: number; r?: number }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={r} fill="currentColor" opacity="0.85" />
      <rect x={x} y={y} width={w} height={h} rx={r} {...S} />
    </>
  );
}

function Check({ x, y }: { x: number; y: number }) {
  return (
    <>
      <Box x={x} y={y} w={9} h={9} r={2} />
      <path d={`M${x + 2.2} ${y + 4.6} l2 2 l3.4 -4`} {...S} />
    </>
  );
}

function Caret({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y} l4 4 l4 -4`} {...S} />;
}

function Chevron({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y} l4 3.5 l-4 3.5`} {...S} />;
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden role="presentation" className="h-auto w-full">
      <rect x="0.6" y="0.6" width={W - 1.2} height={H - 1.2} rx="4" {...S} />
      {children}
    </svg>
  );
}

/* a phone artboard centred in the landscape frame, so mobile projects sit in
   the same grid as the desktop ones */
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <Frame>
      <rect x="112" y="14" width="96" height="202" rx="10" {...S} />
      <Bar x={146} y={22} w={28} h={3} o={0.3} />
      {children}
    </Frame>
  );
}

/* ══════════════════ Duo Scan Memory ══════════════════ */

export function WireTicker() {
  return (
    <Frame>
      <line x1="0" y1="22" x2={W} y2="22" {...S} />
      <Bar x={12} y={9} w={56} />
      <Box x={20} y={40} w={280} h={62} r={4} />
      <Bar x={40} y={62} w={150} h={16} o={0.2} />
      <Bar x={210} y={66} w={50} h={8} />
      <line x1="20" y1="120" x2="300" y2="120" {...S} strokeDasharray="3 4" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <Box x={20 + i * 57} y={134} w={48} h={36} />
          <Bar x={28 + i * 57} y={148} w={32} />
          <Bar x={28 + i * 57} y={158} w={18} />
        </g>
      ))}
      <Bar x={20} y={190} w={120} />
      <Box x={230} y={184} w={70} h={22} r={4} />
    </Frame>
  );
}

export function WireTiles() {
  return (
    <Frame>
      <Box x={12} y={12} w={120} h={20} r={4} />
      <Bar x={22} y={19} w={70} />
      <Caret x={118} y={20} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 12 + (i % 3) * 100;
        const y = 46 + Math.floor(i / 3) * 76;
        return (
          <g key={i}>
            <Box x={x} y={y} w={88} h={64} r={4} />
            <Bar x={x + 12} y={y + 12} w={44} />
            <Bar x={x + 12} y={y + 28} w={26} h={20} o={0.24} />
            <circle cx={x + 70} cy={y + 44} r="9" {...S} />
            <path d={`M${x + 66} ${y + 44} h8 M${x + 70} ${y + 40} v8`} {...S} />
          </g>
        );
      })}
      <Box x={212} y={198} w={96} h={20} r={4} />
      <Bar x={228} y={205} w={64} />
    </Frame>
  );
}

export function WireManifest() {
  return (
    <Frame>
      <line x1="160" y1="0" x2="160" y2={H} {...S} strokeDasharray="3 4" />
      <Bar x={16} y={16} w={62} />
      <Bar x={176} y={16} w={52} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 42 + i * 26;
        return (
          <g key={i}>
            <Box x={16} y={y} w={10} h={10} r={2} />
            <Bar x={34} y={y + 3} w={70} />
            <Bar x={120} y={y + 3} w={20} />
            {i < 4 && (
              <>
                <Check x={176} y={y} />
                <Bar x={194} y={y + 3} w={70} />
                <Bar x={280} y={y + 3} w={20} />
              </>
            )}
          </g>
        );
      })}
      <Box x={16} y={198} w={128} h={20} r={4} dash />
      <Bar x={30} y={205} w={92} />
      <Box x={176} y={198} w={128} h={20} r={4} />
      <Bar x={206} y={205} w={68} />
    </Frame>
  );
}

export function WireList() {
  return (
    <Frame>
      <Box x={12} y={12} w={104} h={20} r={4} />
      <Bar x={22} y={19} w={58} />
      <Caret x={102} y={20} />
      <Box x={176} y={12} w={132} h={20} r={4} />
      <Bar x={188} y={19} w={72} />
      <Box x={12} y={44} w={296} h={140} r={4} />
      <line x1="12" y1="66" x2="308" y2="66" {...S} />
      <Bar x={24} y={52} w={78} />
      <Bar x={266} y={52} w={30} o={0.26} />
      {[0, 1, 2, 3].map((i) => {
        const y = 78 + i * 26;
        return (
          <g key={i}>
            {i > 0 && <line x1="24" y1={y - 6} x2="296" y2={y - 6} {...S} opacity="0.35" />}
            <Box x={24} y={y} w={9} h={9} r={2} />
            <Bar x={42} y={y + 3} w={68} />
            <Bar x={150} y={y + 3} w={78} h={5} o={0.2} />
            <Bar x={252} y={y + 2} w={16} h={7} o={0.3} />
            <Chevron x={288} y={y + 1} />
          </g>
        );
      })}
      <Box x={12} y={196} w={86} h={22} r={4} />
      <Bar x={30} y={204} w={50} />
      <Solid x={208} y={196} w={100} h={22} r={4} />
    </Frame>
  );
}

/* ══════════════════ TaurusWebs ══════════════════ */

/* the form that existed: six fields, one animal, save, repeat */
export function WireOneForm() {
  return (
    <Frame>
      <line x1="0" y1="26" x2={W} y2="26" {...S} />
      <Bar x={14} y={13} w={70} />
      <Bar x={250} y={13} w={56} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 24 + (i % 2) * 148;
        const y = 44 + Math.floor(i / 2) * 42;
        return (
          <g key={i}>
            <Bar x={x} y={y} w={38} />
            <Box x={x} y={y + 8} w={124} h={20} r={3} />
          </g>
        );
      })}
      <Box x={24} y={186} w={80} h={22} r={4} />
      <Bar x={44} y={194} w={40} />
      <Bar x={124} y={195} w={104} />
    </Frame>
  );
}

/* a wizard: same form, cut into steps */
export function WireWizard() {
  return (
    <Frame>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={40 + i * 80} cy="26" r="9" {...S} />
          {i > 0 && <line x1={49 + (i - 1) * 80} y1="26" x2={31 + i * 80} y2="26" {...S} strokeDasharray="3 3" />}
          <Bar x={26 + i * 80} y={44} w={30} />
        </g>
      ))}
      <Box x={40} y={66} w={240} h={104} r={4} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Bar x={58} y={84 + i * 30} w={44} />
          <Box x={58} y={92 + i * 30} w={200} h={18} r={3} />
        </g>
      ))}
      <Box x={40} y={188} w={70} h={22} r={4} dash />
      <Bar x={58} y={196} w={34} />
      <Solid x={210} y={188} w={70} h={22} r={4} />
    </Frame>
  );
}

/* upload a file, then say which column is which */
export function WireImport() {
  return (
    <Frame>
      <Box x={20} y={18} w={280} h={54} r={4} dash />
      <path d="M155 36 v18 M148 43 l7 -7 l7 7" {...S} />
      <Bar x={126} y={58} w={68} />
      <Bar x={20} y={86} w={62} />
      {[0, 1, 2, 3].map((i) => {
        const y = 102 + i * 26;
        return (
          <g key={i}>
            <Bar x={20} y={y + 4} w={72} />
            <path d={`M106 ${y + 6} h14 M116 ${y + 3} l4 3 l-4 3`} {...S} />
            <Box x={132} y={y} w={110} h={18} r={3} />
            <Bar x={142} y={y + 6} w={62} />
            <Caret x={228} y={y + 6} />
            <Check x={258} y={y + 4} />
          </g>
        );
      })}
      <Solid x={230} y={200} w={70} h={20} r={4} />
    </Frame>
  );
}

/* the editable grid that shipped */
export function WireGrid() {
  return (
    <Frame>
      <line x1="0" y1="24" x2={W} y2="24" {...S} />
      <Bar x={14} y={12} w={54} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Box x={104 + i * 62} y={8} w={54} h={14} r={7} />
          <Bar x={114 + i * 62} y={13} w={34} />
        </g>
      ))}
      <rect x="12" y="36" width="296" height="16" rx="3" fill="currentColor" opacity="0.1" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Bar key={i} x={26 + i * 58} y={41} w={34} o={0.3} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((r) => {
        const y = 58 + r * 22;
        return (
          <g key={r}>
            <line x1="12" y1={y + 18} x2="308" y2={y + 18} {...S} opacity="0.3" />
            <Box x={16} y={y + 5} w={8} h={8} r={2} />
            {[0, 1, 2, 3, 4].map((c) => (
              <Bar key={c} x={26 + c * 58} y={y + 7} w={c === 3 && r === 2 ? 22 : 40} />
            ))}
          </g>
        );
      })}
      <Solid x={216} y={198} w={92} h={20} r={4} />
      <Bar x={16} y={205} w={90} />
    </Frame>
  );
}

/* ══════════════════ ERP Duo ══════════════════ */

/* every module as a card on a landing page */
export function WireModules() {
  return (
    <Frame>
      <Bar x={16} y={16} w={72} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const x = 16 + (i % 4) * 74;
        const y = 36 + Math.floor(i / 4) * 76;
        return (
          <g key={i}>
            <Box x={x} y={y} w={64} h={64} r={4} />
            <Box x={x + 12} y={y + 12} w={16} h={16} r={3} />
            <Bar x={x + 12} y={y + 38} w={40} />
            <Bar x={x + 12} y={y + 48} w={24} />
          </g>
        );
      })}
      <Box x={16} y={192} w={288} h={24} r={4} dash />
      <Bar x={30} y={202} w={104} />
    </Frame>
  );
}

/* search first: type the thing, skip the navigation */
export function WireSearch() {
  return (
    <Frame>
      <Box x={40} y={30} w={240} h={26} r={5} />
      <circle cx="58" cy="43" r="5" {...S} />
      <path d="M62 47 l4 4" {...S} />
      <Bar x={74} y={41} w={110} />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 68 + i * 26;
        return (
          <g key={i}>
            {i === 0 && <rect x="40" y={y - 4} width="240" height="24" rx="3" fill="currentColor" opacity="0.08" />}
            <Bar x={54} y={y + 3} w={16} h={8} o={0.24} />
            <Bar x={80} y={y + 4} w={96} />
            <Bar x={214} y={y + 4} w={50} />
          </g>
        );
      })}
      <line x1="40" y1="200" x2="280" y2="200" {...S} strokeDasharray="3 4" />
      <Bar x={40} y={210} w={130} />
    </Frame>
  );
}

/* sidebar with badge counts, and the dense table it opens: what shipped */
export function WireSidebar() {
  return (
    <Frame>
      <line x1="76" y1="0" x2="76" y2={H} {...S} />
      <Bar x={14} y={16} w={40} o={0.3} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i}>
          {i === 1 && <rect x="8" y={36 + i * 22 - 5} width="60" height="18" rx="3" fill="currentColor" opacity="0.1" />}
          <Bar x={14} y={36 + i * 22} w={i === 1 ? 44 : 36} />
          {(i === 1 || i === 3) && <circle cx="64" cy={38 + i * 22} r="4.5" {...S} />}
        </g>
      ))}
      <Bar x={90} y={16} w={60} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Box x={90 + i * 74} y={30} w={64} h={34} r={3} />
          <Bar x={98 + i * 74} y={38} w={28} />
          <Bar x={98 + i * 74} y={50} w={40} h={8} o={0.26} />
        </g>
      ))}
      <line x1="90" y1="78" x2="308" y2="78" {...S} />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 88 + i * 22;
        return (
          <g key={i}>
            <rect x="90" y={y} width="3" height="14" rx="1.5" fill="currentColor" opacity={i === 1 ? 0.85 : 0.2} />
            <Bar x={102} y={y + 5} w={62} />
            <Bar x={182} y={y + 5} w={44} />
            <Bar x={250} y={y + 4} w={34} h={7} o={0.24} />
          </g>
        );
      })}
      <Bar x={90} y={206} w={110} />
    </Frame>
  );
}

/* tabs across the top, one wide surface underneath */
export function WireTabs() {
  return (
    <Frame>
      <line x1="0" y1="30" x2={W} y2="30" {...S} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <Bar x={20 + i * 58} y={13} w={38} />
          {i === 2 && <rect x={16 + i * 58} y="28" width="46" height="2.5" fill="currentColor" opacity="0.85" />}
        </g>
      ))}
      <Box x={16} y={44} w={288} h={40} r={4} />
      <Bar x={30} y={58} w={70} />
      <Bar x={30} y={70} w={130} h={5} o={0.2} />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 96 + i * 24;
        return (
          <g key={i}>
            <line x1="16" y1={y + 18} x2="304" y2={y + 18} {...S} opacity="0.3" />
            <Bar x={26} y={y + 5} w={70} />
            <Bar x={130} y={y + 5} w={50} />
            <Bar x={220} y={y + 4} w={40} h={7} o={0.24} />
          </g>
        );
      })}
    </Frame>
  );
}

/* ══════════════════ Savee ══════════════════ */

export function WireFeed() {
  return (
    <Phone>
      <Bar x={122} y={36} w={38} />
      {[0, 1].map((i) => (
        <g key={i}>
          <Box x={122} y={48 + i * 78} w={76} h={68} r={4} />
          <Bar x={130} y={56 + i * 78} w={30} o={0.24} />
          <rect x="130" y={68 + i * 78} width="60" height="26" rx="3" fill="currentColor" opacity="0.14" />
          <Bar x={130} y={100 + i * 78} w={44} />
          <circle cx="186" cy={102 + i * 78} r="4" {...S} />
        </g>
      ))}
      <line x1="112" y1="200" x2="208" y2="200" {...S} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={124 + i * 18} cy="208" r="3.4" {...S} />
      ))}
    </Phone>
  );
}

export function WireFridge() {
  return (
    <Phone>
      <Bar x={122} y={36} w={44} />
      <Box x={122} y={46} w={76} h={20} r={4} dash />
      <path d="M156 52 v8 M152 56 h8" {...S} />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 74 + i * 22;
        return (
          <g key={i}>
            <Box x={122} y={y} w={8} h={8} r={2} />
            <Bar x={136} y={y + 2} w={38} />
            <Bar x={182} y={y + 2} w={14} o={0.3} />
          </g>
        );
      })}
      <Box x={122} y={190} w={76} h={18} r={4} />
      <Bar x={140} y={196} w={40} />
      <line x1="112" y1="200" x2="208" y2="200" {...S} opacity="0" />
    </Phone>
  );
}

export function WireCalendar() {
  return (
    <Phone>
      <Bar x={122} y={36} w={40} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <circle cx={128 + i * 18} cy="54" r="7.5" {...S} />
          {i === 1 && <circle cx={128 + i * 18} cy="54" r="7.5" fill="currentColor" opacity="0.85" />}
        </g>
      ))}
      {[0, 1, 2].map((i) => {
        const y = 74 + i * 40;
        return (
          <g key={i}>
            <Box x={122} y={y} w={76} h={32} r={4} />
            <circle cx="132" cy={y + 16} r="6" {...S} />
            <Bar x={144} y={y + 10} w={40} />
            <Bar x={144} y={y + 20} w={26} />
          </g>
        );
      })}
      <line x1="112" y1="196" x2="208" y2="196" {...S} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={124 + i * 18} cy="206" r="3.4" {...S} />
      ))}
    </Phone>
  );
}

export function WireShopping() {
  return (
    <Phone>
      <Bar x={122} y={36} w={52} />
      <Box x={122} y={46} w={76} h={16} r={8} />
      <Bar x={130} y={51} w={26} o={0.3} />
      <Bar x={166} y={51} w={22} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 72 + i * 20;
        return (
          <g key={i}>
            {i < 2 ? <Check x={122} y={y} /> : <Box x={122} y={y} w={9} h={9} r={2} />}
            <Bar x={138} y={y + 2.5} w={i < 2 ? 34 : 48} o={i < 2 ? 0.1 : 0.16} />
            {i < 2 && <line x1="138" y1={y + 4.5} x2="172" y2={y + 4.5} {...S} opacity="0.5" />}
          </g>
        );
      })}
      <line x1="112" y1="196" x2="208" y2="196" {...S} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={124 + i * 18} cy="206" r="3.4" {...S} />
      ))}
    </Phone>
  );
}

/* ══════════════════ Meinerva ══════════════════ */

export function WireWorkList() {
  return (
    <Phone>
      <Bar x={122} y={36} w={46} />
      {[0, 1, 2, 3].map((i) => {
        const y = 50 + i * 38;
        return (
          <g key={i}>
            <Box x={122} y={y} w={76} h={32} r={3} />
            <rect x="128" y={y + 6} width="20" height="20" rx="2" fill="currentColor" opacity="0.18" />
            <Bar x={154} y={y + 10} w={36} />
            <Bar x={154} y={y + 20} w={22} />
          </g>
        );
      })}
      <Bar x={122} y={210} w={50} />
    </Phone>
  );
}

export function WireMap() {
  return (
    <Phone>
      <rect x="118" y="32" width="84" height="112" rx="4" fill="currentColor" opacity="0.08" />
      <Box x={118} y={32} w={84} h={112} r={4} />
      <path d="M118 88 h84 M160 32 v112" {...S} opacity="0.35" strokeDasharray="3 4" />
      {[
        [140, 62],
        [178, 78],
        [150, 116],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" {...S} />
          <circle cx={cx} cy={cy} r="1.8" fill="currentColor" opacity="0.85" />
        </g>
      ))}
      <Box x={122} y={154} w={76} h={38} r={4} />
      <Bar x={130} y={162} w={40} />
      <Bar x={130} y={172} w={56} h={5} o={0.2} />
      <Bar x={130} y={182} w={28} />
      <Bar x={122} y={206} w={44} />
    </Phone>
  );
}

export function WireCamera() {
  return (
    <Phone>
      <rect x="118" y="34" width="84" height="120" rx="4" fill="currentColor" opacity="0.1" />
      {[
        [124, 40, 1, 1],
        [196, 40, -1, 1],
        [124, 148, 1, -1],
        [196, 148, -1, -1],
      ].map(([x, y, sx, sy], i) => (
        <path key={i} d={`M${x} ${y + 10 * sy} v${-10 * sy} h${10 * sx}`} {...S} />
      ))}
      <circle cx="160" cy="94" r="16" {...S} strokeDasharray="4 4" />
      <Bar x={132} y={164} w={56} />
      <circle cx="160" cy="192" r="11" {...S} />
      <circle cx="160" cy="192" r="7" fill="currentColor" opacity="0.85" />
    </Phone>
  );
}

export function WireVeil() {
  return (
    <Phone>
      <rect x="118" y="34" width="84" height="96" rx="4" fill="currentColor" opacity="0.22" />
      <Box x={118} y={34} w={84} h={96} r={4} />
      <path d="M132 108 q14 -34 28 -16 q14 18 28 -8" {...S} opacity="0.5" />
      <circle cx="160" cy="146" r="10" {...S} />
      <path d="M160 140 v6 l4 3" {...S} />
      <Bar x={132} y={164} w={56} />
      <Box x={126} y={178} w={68} h={20} r={10} dash />
      <Bar x={142} y={185} w={36} />
      <Bar x={132} y={210} w={56} h={3} o={0.24} />
    </Phone>
  );
}

export const wireframes = {
  /* scan memory */
  ticker: WireTicker,
  tiles: WireTiles,
  manifest: WireManifest,
  list: WireList,
  /* taurus */
  oneform: WireOneForm,
  wizard: WireWizard,
  import: WireImport,
  grid: WireGrid,
  /* erp duo */
  modules: WireModules,
  search: WireSearch,
  sidebar: WireSidebar,
  tabs: WireTabs,
  /* savee */
  feed: WireFeed,
  fridge: WireFridge,
  calendar: WireCalendar,
  shopping: WireShopping,
  /* meinerva */
  worklist: WireWorkList,
  map: WireMap,
  camera: WireCamera,
  veil: WireVeil,
} as const;

export type WireSlug = keyof typeof wireframes;
