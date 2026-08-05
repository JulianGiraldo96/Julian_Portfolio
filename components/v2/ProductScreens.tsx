/* Vector portraits of the four products, drawn from the real interfaces:
   Duo's ERP (teal status system, KPI row, shift tables), TaurusWebs' bulk entry
   grid (blue ribbon, green validation pills), Savee's weekly planner and
   Meinerva's dark reading screen. No photography, no backdrop, so each one can
   lift out of its folder as a shape. Decorative: every card states its product
   in text, so these carry aria-hidden. */

const shell = "drop-shadow-[0_18px_34px_rgba(0,0,0,0.18)]";

/* ---------- Duo ERP ---------- */
export function ErpScreen({ className = "" }: { className?: string }) {
  const rows = [
    { y: 150, pill: "#3d9c85", w: 46 },
    { y: 168, pill: "#3d9c85", w: 38 },
    { y: 186, pill: "#b07020", w: 30 },
    { y: 204, pill: "#b07020", w: 42 },
  ];
  return (
    <svg
      viewBox="0 0 360 240"
      aria-hidden
      className={`${shell} ${className}`}
      role="presentation"
    >
      <rect width="360" height="240" rx="12" fill="#FAFAFA" />
      <rect x="0.5" y="0.5" width="359" height="239" rx="11.5" fill="none" stroke="#E4E4E1" />
      {/* window bar */}
      <path d="M0 12A12 12 0 0 1 12 0h336a12 12 0 0 1 12 12v14H0z" fill="#fff" />
      <line x1="0" y1="26" x2="360" y2="26" stroke="#EDEDEA" />
      {[12, 21, 30].map((cx) => (
        <circle key={cx} cx={cx} cy="13" r="3" fill="#E0E0DC" />
      ))}
      <rect x="150" y="9" width="60" height="8" rx="4" fill="#EDEDEA" />

      {/* sidebar */}
      <rect x="0" y="26" width="62" height="214" fill="#fff" />
      <line x1="62" y1="26" x2="62" y2="240" stroke="#EDEDEA" />
      <rect x="10" y="36" width="26" height="7" rx="3.5" fill="#161616" />
      <rect x="6" y="54" width="50" height="14" rx="4" fill="#EAF6F2" />
      <rect x="12" y="58" width="30" height="6" rx="3" fill="#3d9c85" />
      {[74, 90, 106, 122, 138, 154, 170].map((y) => (
        <rect key={y} x="12" y={y} width={y % 3 === 0 ? 34 : 26} height="5" rx="2.5" fill="#DCDCD8" />
      ))}

      {/* KPI row */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={72 + i * 71} y="36" width="63" height="40" rx="6" fill="#fff" stroke="#EDEDEA" />
          <rect x={80 + i * 71} y="44" width="24" height="4" rx="2" fill="#D2D2CE" />
          <rect x={80 + i * 71} y="54" width={18 + i * 4} height="9" rx="2" fill="#161616" />
          <rect x={80 + i * 71} y="67" width="30" height="3" rx="1.5" fill="#E2E2DE" />
        </g>
      ))}

      {/* chart */}
      <rect x="72" y="84" width="134" height="56" rx="6" fill="#fff" stroke="#EDEDEA" />
      <path
        d="M80 130 L96 120 L110 124 L124 108 L138 112 L152 98 L168 102 L182 92 L198 96 L198 134 L80 134 Z"
        fill="#79cab7"
        fillOpacity="0.28"
      />
      <path
        d="M80 130 L96 120 L110 124 L124 108 L138 112 L152 98 L168 102 L182 92 L198 96"
        fill="none"
        stroke="#2e8a77"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* side list */}
      <rect x="214" y="84" width="134" height="56" rx="6" fill="#fff" stroke="#EDEDEA" />
      {[94, 106, 118, 130].map((y, i) => (
        <g key={y}>
          <rect x="222" y={y} width={40 - i * 4} height="4" rx="2" fill="#DCDCD8" />
          <rect x="308" y={y} width="32" height="4" rx="2" fill="#EDEDEA" />
        </g>
      ))}

      {/* table */}
      <rect x="72" y="146" width="276" height="82" rx="6" fill="#fff" stroke="#EDEDEA" />
      {rows.map((r, i) => (
        <g key={r.y}>
          {i > 0 && <line x1="72" y1={r.y - 4} x2="348" y2={r.y - 4} stroke="#F3F3F0" />}
          <circle cx="86" cy={r.y + 4} r="5" fill="#EFEFEB" />
          <rect x="98" y={r.y + 1} width={r.w} height="5" rx="2.5" fill="#C9C9C4" />
          <rect x="200" y={r.y + 1} width="34" height="5" rx="2.5" fill="#E4E4E0" />
          <rect
            x="286"
            y={r.y - 2}
            width="48"
            height="13"
            rx="6.5"
            fill="none"
            stroke={r.pill}
            strokeWidth="1.2"
          />
          <circle cx="296" cy={r.y + 4.5} r="2" fill={r.pill} />
          <rect x="302" y={r.y + 2.5} width="24" height="4" rx="2" fill={r.pill} fillOpacity="0.55" />
        </g>
      ))}
    </svg>
  );
}

/* ---------- TaurusWebs ---------- */
export function TaurusScreen({ className = "" }: { className?: string }) {
  const rows = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg
      viewBox="0 0 360 240"
      aria-hidden
      className={`${shell} ${className}`}
      role="presentation"
    >
      <rect width="360" height="240" rx="12" fill="#F7F9FC" />
      <rect x="0.5" y="0.5" width="359" height="239" rx="11.5" fill="none" stroke="#DCE4EF" />
      {/* blue ribbon */}
      <path d="M0 12A12 12 0 0 1 12 0h336a12 12 0 0 1 12 12v22H0z" fill="#1F5FBF" />
      <rect x="12" y="12" width="42" height="8" rx="4" fill="#fff" fillOpacity="0.9" />
      {[70, 104, 138].map((x) => (
        <rect key={x} x={x} y="13" width="24" height="6" rx="3" fill="#fff" fillOpacity="0.45" />
      ))}
      <circle cx="344" cy="16" r="6" fill="#fff" fillOpacity="0.25" />

      {/* toolbar */}
      <rect x="0" y="34" width="360" height="26" fill="#fff" />
      <line x1="0" y1="60" x2="360" y2="60" stroke="#E4EAF4" />
      <rect x="12" y="41" width="66" height="13" rx="6.5" fill="#1F5FBF" />
      <rect x="20" y="45" width="42" height="5" rx="2.5" fill="#fff" fillOpacity="0.85" />
      {[86, 148, 200].map((x, i) => (
        <g key={x}>
          <rect x={x} y="41" width={i === 0 ? 56 : 46} height="13" rx="6.5" fill="#EEF3FB" stroke="#DCE4EF" />
          <rect x={x + 9} y="45" width={i === 0 ? 38 : 28} height="5" rx="2.5" fill="#96A6BF" />
        </g>
      ))}
      <rect x="272" y="41" width="76" height="13" rx="3" fill="#fff" stroke="#DCE4EF" />
      <rect x="279" y="45" width="34" height="5" rx="2.5" fill="#C3CDDD" />

      {/* header row */}
      <rect x="0" y="60" width="360" height="18" fill="#EDF2FA" />
      <rect x="10" y="66" width="8" height="7" rx="2" fill="#fff" stroke="#B9C6DA" />
      {[30, 84, 140, 196, 246, 296].map((x) => (
        <rect key={x} x={x} y="67" width={x === 30 ? 34 : 28} height="5" rx="2.5" fill="#8496B0" />
      ))}

      {/* data rows */}
      {rows.map((i) => {
        const y = 78 + i * 21;
        const ok = i !== 2 && i !== 5;
        return (
          <g key={i}>
            <rect x="0" y={y} width="360" height="21" fill={i % 2 ? "#FBFCFE" : "#fff"} />
            <line x1="0" y1={y + 21} x2="360" y2={y + 21} stroke="#EEF2F8" />
            <rect
              x="10"
              y={y + 7}
              width="8"
              height="7"
              rx="2"
              fill={ok ? "#1F5FBF" : "#fff"}
              stroke={ok ? "#1F5FBF" : "#B9C6DA"}
            />
            {ok && <path d={`M11.6 ${y + 10.5} l1.8 1.8 3.2 -3.4`} stroke="#fff" strokeWidth="1.2" fill="none" />}
            <rect x="30" y={y + 8} width="30" height="5" rx="2.5" fill="#5A6B85" />
            <rect x="84" y={y + 8} width="22" height="5" rx="2.5" fill="#AAB6C8" />
            <rect x="140" y={y + 8} width="34" height="5" rx="2.5" fill="#AAB6C8" />
            <rect x="196" y={y + 8} width="26" height="5" rx="2.5" fill="#AAB6C8" />
            <rect
              x="246"
              y={y + 5}
              width="52"
              height="11"
              rx="5.5"
              fill={ok ? "#E4F4EA" : "#FDF0E2"}
            />
            <rect
              x="253"
              y={y + 8}
              width={ok ? 30 : 26}
              height="5"
              rx="2.5"
              fill={ok ? "#2E7D46" : "#B0741F"}
            />
            <rect x="312" y={y + 8} width="30" height="5" rx="2.5" fill="#D6DEEA" />
          </g>
        );
      })}

      {/* footer action */}
      <rect x="0" y="225" width="360" height="15" fill="#fff" />
      <rect x="246" y="228" width="102" height="12" rx="3" fill="#2E7D46" />
      <rect x="266" y="231" width="62" height="5" rx="2.5" fill="#fff" fillOpacity="0.9" />
    </svg>
  );
}

/* ---------- Savee ---------- */
export function SaveeScreen({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 300"
      aria-hidden
      className={`${shell} ${className}`}
      role="presentation"
    >
      <rect width="160" height="300" rx="22" fill="#0E0E0C" />
      <rect x="4" y="4" width="152" height="292" rx="18" fill="#FCFDFB" />
      {/* status bar */}
      <rect x="16" y="14" width="18" height="5" rx="2.5" fill="#20211E" />
      <rect x="120" y="14" width="24" height="5" rx="2.5" fill="#C9CCC4" />
      <rect x="62" y="10" width="36" height="9" rx="4.5" fill="#0E0E0C" />

      {/* header */}
      <rect x="16" y="32" width="52" height="9" rx="4.5" fill="#20211E" />
      <rect x="16" y="46" width="80" height="5" rx="2.5" fill="#B7BCB1" />
      <circle cx="136" cy="40" r="10" fill="#E7F6EA" />
      <path d="M132 40l3 3 6 -6.5" stroke="#2F9E52" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* week strip */}
      {[0, 1, 2, 3, 4].map((i) => {
        const active = i === 1;
        return (
          <g key={i}>
            <rect
              x={16 + i * 26}
              y="62"
              width="21"
              height="28"
              rx="8"
              fill={active ? "#35C46A" : "#F1F3EE"}
            />
            <rect
              x={21 + i * 26}
              y="69"
              width="11"
              height="4"
              rx="2"
              fill={active ? "#fff" : "#C2C7BB"}
            />
            <rect
              x={22 + i * 26}
              y="78"
              width="9"
              height="6"
              rx="2"
              fill={active ? "#fff" : "#8E9488"}
            />
          </g>
        );
      })}

      {/* meal cards */}
      {[100, 152].map((y, i) => (
        <g key={y}>
          <rect x="16" y={y} width="128" height="44" rx="10" fill="#fff" stroke="#EBEEE7" />
          <rect x="24" y={y + 8} width="28" height="28" rx="8" fill={i ? "#FFF2DC" : "#E7F6EA"} />
          <circle cx="38" cy={y + 22} r="7" fill={i ? "#F0B754" : "#68CE8C"} fillOpacity="0.55" />
          <rect x="60" y={y + 12} width="54" height="6" rx="3" fill="#2B2C28" />
          <rect x="60" y={y + 24} width="36" height="4" rx="2" fill="#B7BCB1" />
          <rect x="122" y={y + 10} width="14" height="9" rx="4.5" fill="#F1F3EE" />
        </g>
      ))}

      {/* shopping list */}
      <rect x="16" y="208" width="44" height="5" rx="2.5" fill="#20211E" />
      {[222, 240, 258].map((y, i) => (
        <g key={y}>
          <rect
            x="16"
            y={y}
            width="10"
            height="10"
            rx="3"
            fill={i < 2 ? "#35C46A" : "#fff"}
            stroke={i < 2 ? "#35C46A" : "#D3D7CE"}
          />
          {i < 2 && (
            <path d={`M18.5 ${y + 5} l2 2 4 -4.4`} stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          )}
          <rect
            x="32"
            y={y + 3}
            width={62 - i * 12}
            height="5"
            rx="2.5"
            fill={i < 2 ? "#C9CCC4" : "#5C6058"}
          />
          {i < 2 && <line x1="32" y1={y + 5.5} x2={94 - i * 12} y2={y + 5.5} stroke="#9BA095" strokeWidth="1" />}
        </g>
      ))}

      {/* tab bar */}
      <rect x="16" y="278" width="128" height="1" fill="#EDEFE9" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={40 + i * 40} cy="288" r={i === 0 ? 4.5 : 3.5} fill={i === 0 ? "#35C46A" : "#D3D7CE"} />
      ))}
    </svg>
  );
}

/* ---------- Meinerva ---------- */
export function MeinervaScreen({ className = "" }: { className?: string }) {
  /* the dotted wordmark: a scattering of dots along a script-like arc */
  const dots = Array.from({ length: 46 }, (_, i) => {
    const t = i / 45;
    return {
      x: 26 + t * 108,
      y: 118 + Math.sin(t * Math.PI * 3) * 9 + Math.cos(t * Math.PI * 5) * 3,
      r: 0.7 + (i % 4) * 0.24,
    };
  });
  return (
    <svg
      viewBox="0 0 160 300"
      aria-hidden
      className={`${shell} ${className}`}
      role="presentation"
    >
      <rect width="160" height="300" rx="22" fill="#000" />
      <rect x="4" y="4" width="152" height="292" rx="18" fill="#141414" />
      <rect x="62" y="10" width="36" height="9" rx="4.5" fill="#000" />
      <rect x="16" y="14" width="18" height="5" rx="2.5" fill="#4C4A46" />
      <rect x="120" y="14" width="24" height="5" rx="2.5" fill="#3A3835" />

      {/* the artwork, veiled */}
      <rect x="16" y="32" width="128" height="70" rx="8" fill="#1E1C1A" />
      <circle cx="58" cy="66" r="19" fill="#2E2A26" />
      <circle cx="96" cy="60" r="12" fill="#35302B" />
      <path d="M16 92 q34 -18 62 -4 t66 -8 v18 a8 8 0 0 1 -8 8 H24 a8 8 0 0 1 -8 -8 z" fill="#26231F" />
      <rect x="122" y="38" width="14" height="14" rx="7" fill="#000" fillOpacity="0.45" />
      <circle cx="129" cy="45" r="3" fill="#8A7F6E" />

      {/* dotted wordmark */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#EDE6D8" fillOpacity={0.55 + (i % 3) * 0.15} />
      ))}
      <rect x="46" y="136" width="68" height="4" rx="2" fill="#4A453E" />

      {/* your reading, then the hint */}
      <rect x="16" y="158" width="128" height="46" rx="8" fill="#1B1917" />
      {[168, 178, 188].map((y, i) => (
        <rect key={y} x="24" y={y} width={i === 2 ? 62 : 104 - i * 12} height="4" rx="2" fill="#3E3A34" />
      ))}
      <rect x="16" y="214" width="60" height="16" rx="8" fill="#2A2622" stroke="#413B33" />
      <circle cx="27" cy="222" r="3" fill="#C6A96B" />
      <rect x="35" y="220" width="30" height="4" rx="2" fill="#9C907C" />

      {/* community critiques stack */}
      {[242, 258, 274].map((y, i) => (
        <g key={y}>
          <rect x={16 + i * 4} y={y} width={128 - i * 8} height="12" rx="6" fill="#201D1A" />
          <circle cx={26 + i * 4} cy={y + 6} r="3.5" fill="#3A342D" />
          <rect x={36 + i * 4} y={y + 4} width={70 - i * 10} height="4" rx="2" fill="#39342D" />
        </g>
      ))}
    </svg>
  );
}

export const screens = {
  "erp-duo": ErpScreen,
  taurus: TaurusScreen,
  savee: SaveeScreen,
  meinerva: MeinervaScreen,
} as const;

export type ScreenSlug = keyof typeof screens;
