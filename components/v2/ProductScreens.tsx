/* Vector portraits of the four products, drawn from the real interfaces:
   Duo's ERP (teal status system, KPI row, shift tables), TaurusWebs' bulk entry
   grid (blue ribbon, green validation pills), Savee's weekly planner and
   Meinerva's dark reading screen. Real labels, not grey blocks, so the card
   shows what the product actually does. No photography and no backdrop, so
   each one can lift out of its folder as a shape.
   No filter of any kind here: a drop-shadow is a CSS filter, and a filter
   region on a scaled element inside an `isolate` stacking context is what
   painted the hard edged ghost rectangle beside the first card. The shadow is
   a box-shadow on the wrapper in ProjectFolder instead.
   Decorative: every card names its product in text, so these are aria-hidden. */


/* ---------- Duo ERP ---------- */
export function ErpScreen({ className = "" }: { className?: string }) {
  const nav = [
    "Dashboard",
    "Inventory",
    "Flavours",
    "Expiring",
    "Orders",
    "Deliveries",
    "Logistics",
    "Production",
    "Staff",
    "Reports",
  ];
  const kpis = [
    { k: "Revenue", v: "€4,780", d: "+12% vs Tue" },
    { k: "Waste", v: "1.4%", d: "-0.6 pts" },
    { k: "On shift", v: "11", d: "across 5 shops" },
    { k: "Expiring", v: "4", d: "next 48 h" },
  ];
  const rows = [
    { n: "Marco G.", r: "Manager", t: "07:00 - 15:00", s: "ON NOW", c: "#2e8a77" },
    { n: "Aisha K.", r: "Scooper", t: "10:00 - 18:00", s: "ON NOW", c: "#2e8a77" },
    { n: "Tom B.", r: "Scooper", t: "14:00 - 22:00", s: "NEXT", c: "#a9691c" },
    { n: "Lia M.", r: "Closer", t: "18:00 - 23:30", s: "NEXT", c: "#a9691c" },
  ];
  return (
    <svg
      viewBox="0 0 360 240"
      aria-hidden
      role="presentation"
      className={className}
      fontFamily="inherit"
    >
      <rect width="360" height="240" rx="11" fill="#FAFAFA" />
      <rect x="0.5" y="0.5" width="359" height="239" rx="10.5" fill="none" stroke="#E2E2DF" />

      {/* window bar */}
      <path d="M0 11A11 11 0 0 1 11 0h338a11 11 0 0 1 11 11v13H0z" fill="#fff" />
      <line x1="0" y1="24" x2="360" y2="24" stroke="#ECECE9" />
      {[11, 19, 27].map((cx) => (
        <circle key={cx} cx={cx} cy="12" r="2.6" fill="#DEDEDA" />
      ))}
      <text x="180" y="15" textAnchor="middle" fontSize="6.4" fill="#8C8C86">
        Duo · Sicilian Ice Cream · ERP
      </text>

      {/* sidebar */}
      <rect x="0" y="24" width="66" height="216" fill="#fff" />
      <line x1="66" y1="24" x2="66" y2="240" stroke="#ECECE9" />
      <text x="10" y="39" fontSize="8" fontWeight="700" fill="#161616" letterSpacing="-0.2">
        Duo
      </text>
      <circle cx="27" cy="36.4" r="1.8" fill="#79cab7" />
      <rect x="6" y="46" width="54" height="13" rx="4" fill="#EAF6F2" />
      {nav.map((label, i) => (
        <text
          key={label}
          x="12"
          y={i === 0 ? 54.6 : 54.6 + i * 15}
          fontSize="6.2"
          fill={i === 0 ? "#2e8a77" : "#9A9A93"}
          fontWeight={i === 0 ? 600 : 400}
        >
          {label}
        </text>
      ))}

      {/* KPI row */}
      {kpis.map((kpi, i) => (
        <g key={kpi.k}>
          <rect x={76 + i * 70} y="34" width="62" height="40" rx="5" fill="#fff" stroke="#ECECE9" />
          <text x={83 + i * 70} y="45" fontSize="5.6" fill="#A5A5A0" letterSpacing="0.3">
            {kpi.k.toUpperCase()}
          </text>
          <text x={83 + i * 70} y="59" fontSize="11.5" fontWeight="700" fill="#161616">
            {kpi.v}
          </text>
          <text x={83 + i * 70} y="69" fontSize="5.4" fill="#B4B4AE">
            {kpi.d}
          </text>
        </g>
      ))}

      {/* chart */}
      <rect x="76" y="80" width="132" height="56" rx="5" fill="#fff" stroke="#ECECE9" />
      <text x="83" y="91" fontSize="5.8" fill="#77776F" fontWeight="600">
        Revenue · this week
      </text>
      <path
        d="M84 128 L98 120 L112 123 L126 110 L140 114 L154 101 L168 105 L182 95 L200 99 L200 131 L84 131 Z"
        fill="#79cab7"
        fillOpacity="0.26"
      />
      <path
        d="M84 128 L98 120 L112 123 L126 110 L140 114 L154 101 L168 105 L182 95 L200 99"
        fill="none"
        stroke="#2e8a77"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="200" cy="99" r="2" fill="#2e8a77" />

      {/* alerts */}
      <rect x="214" y="80" width="134" height="56" rx="5" fill="#fff" stroke="#ECECE9" />
      <text x="221" y="91" fontSize="5.8" fill="#77776F" fontWeight="600">
        Alerts
      </text>
      {[
        ["Contract expires", "8 days"],
        ["Cert not uploaded", "Shop 4"],
        ["Missing IBAN", "payroll"],
      ].map(([a, b], i) => (
        <g key={a}>
          <circle cx="224" cy={101 + i * 11} r="2" fill={i === 0 ? "#B07020" : "#C03030"} />
          <text x="231" y={103 + i * 11} fontSize="5.6" fill="#66665F">
            {a}
          </text>
          <text x="341" y={103 + i * 11} fontSize="5.4" fill="#B4B4AE" textAnchor="end">
            {b}
          </text>
        </g>
      ))}

      {/* shift table */}
      <rect x="76" y="142" width="272" height="86" rx="5" fill="#fff" stroke="#ECECE9" />
      <text x="83" y="153" fontSize="5.8" fontWeight="600" fill="#77776F">
        Shifts · today
      </text>
      <text x="341" y="153" fontSize="5.4" fill="#B4B4AE" textAnchor="end">
        5 shops
      </text>
      {rows.map((r, i) => {
        const y = 163 + i * 15.5;
        return (
          <g key={r.n}>
            <line x1="76" y1={y - 4} x2="348" y2={y - 4} stroke="#F4F4F1" />
            <circle cx="88" cy={y + 4} r="4.6" fill="#F0F0EC" />
            <text x="98" y={y + 3} fontSize="6" fontWeight="600" fill="#2E2E2A">
              {r.n}
            </text>
            <text x="98" y={y + 10} fontSize="5" fill="#B0B0AA">
              {r.r}
            </text>
            <text x="230" y={y + 6} fontSize="5.8" fill="#8A8A84" textAnchor="end">
              {r.t}
            </text>
            <rect x="284" y={y - 1} width="52" height="12" rx="6" fill="none" stroke={r.c} strokeWidth="0.9" />
            <circle cx="292" cy={y + 5} r="1.8" fill={r.c} />
            <text x="298" y={y + 7.2} fontSize="5.2" fill={r.c} letterSpacing="0.4">
              {r.s}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- TaurusWebs ---------- */
export function TaurusScreen({ className = "" }: { className?: string }) {
  const rows = [
    ["CO-4821", "Potrero 3", "412 kg", "Vaca", "Validado"],
    ["CO-4822", "Potrero 3", "398 kg", "Vaca", "Validado"],
    ["CO-4823", "Potrero 1", "··", "Novillo", "Falta peso"],
    ["CO-4824", "Potrero 1", "356 kg", "Novillo", "Validado"],
    ["CO-4825", "Potrero 5", "441 kg", "Toro", "Validado"],
    ["CO-4826", "Potrero 5", "··", "Vaca", "Falta lote"],
    ["CO-4827", "Potrero 2", "377 kg", "Vaca", "Validado"],
  ];
  const heads = ["ID", "Potrero", "Peso", "Tipo", "Estado"];
  const cols = [34, 92, 152, 202, 252];
  return (
    <svg
      viewBox="0 0 360 240"
      aria-hidden
      role="presentation"
      className={className}
      fontFamily="inherit"
    >
      <rect width="360" height="240" rx="11" fill="#F7F9FC" />
      <rect x="0.5" y="0.5" width="359" height="239" rx="10.5" fill="none" stroke="#D8E1EE" />

      {/* ribbon */}
      <path d="M0 11A11 11 0 0 1 11 0h338a11 11 0 0 1 11 11v20H0z" fill="#1F5FBF" />
      <text x="12" y="19.5" fontSize="7.4" fontWeight="700" fill="#fff">
        TaurusWebs
      </text>
      {["Inicio", "Ganado", "Potreros", "Reportes"].map((t, i) => (
        <text key={t} x={78 + i * 42} y="19.5" fontSize="6.2" fill="#C9DAF5">
          {t}
        </text>
      ))}
      <circle cx="345" cy="16" r="5.5" fill="#fff" fillOpacity="0.22" />

      {/* toolbar */}
      <rect x="0" y="31" width="360" height="24" fill="#fff" />
      <line x1="0" y1="55" x2="360" y2="55" stroke="#E4EAF4" />
      <rect x="12" y="37" width="72" height="13" rx="6.5" fill="#1F5FBF" />
      <text x="48" y="45.8" fontSize="6" fontWeight="600" fill="#fff" textAnchor="middle">
        Carga múltiple
      </text>
      {["Pegar filas", "Importar", "Plantilla"].map((t, i) => (
        <g key={t}>
          <rect x={92 + i * 56} y="37" width="50" height="13" rx="6.5" fill="#EEF3FB" stroke="#DCE4EF" />
          <text x={117 + i * 56} y="45.8" fontSize="5.8" fill="#5E7391" textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
      <rect x="272" y="37" width="76" height="13" rx="3" fill="#fff" stroke="#DCE4EF" />
      <text x="279" y="45.8" fontSize="5.8" fill="#9FADC2">
        Buscar animal
      </text>

      {/* header row */}
      <rect x="0" y="55" width="360" height="17" fill="#EDF2FA" />
      <rect x="12" y="60" width="7.5" height="7" rx="2" fill="#fff" stroke="#B9C6DA" />
      {heads.map((h, i) => (
        <text key={h} x={cols[i]} y="66.4" fontSize="5.8" fontWeight="600" fill="#7387A3" letterSpacing="0.2">
          {h}
        </text>
      ))}
      <text x="316" y="66.4" fontSize="5.8" fontWeight="600" fill="#7387A3">
        Fecha
      </text>

      {/* rows */}
      {rows.map((r, i) => {
        const y = 72 + i * 20;
        const ok = r[4] === "Validado";
        return (
          <g key={r[0]}>
            <rect x="0" y={y} width="360" height="20" fill={i % 2 ? "#FBFCFE" : "#fff"} />
            <line x1="0" y1={y + 20} x2="360" y2={y + 20} stroke="#EEF2F8" />
            <rect
              x="12"
              y={y + 6.5}
              width="7.5"
              height="7"
              rx="2"
              fill={ok ? "#1F5FBF" : "#fff"}
              stroke={ok ? "#1F5FBF" : "#B9C6DA"}
            />
            {ok && <path d={`M13.4 ${y + 10} l1.6 1.6 3 -3.2`} stroke="#fff" strokeWidth="1.1" fill="none" />}
            <text x={cols[0]} y={y + 12.4} fontSize="5.9" fontWeight="600" fill="#41536E">
              {r[0]}
            </text>
            <text x={cols[1]} y={y + 12.4} fontSize="5.9" fill="#7E8DA4">
              {r[1]}
            </text>
            <text x={cols[2]} y={y + 12.4} fontSize="5.9" fill={r[2] === "··" ? "#C0492E" : "#7E8DA4"}>
              {r[2]}
            </text>
            <text x={cols[3]} y={y + 12.4} fontSize="5.9" fill="#7E8DA4">
              {r[3]}
            </text>
            <rect x={cols[4] - 4} y={y + 4} width="56" height="12" rx="6" fill={ok ? "#E4F4EA" : "#FDF0E2"} />
            <text
              x={cols[4] + 24}
              y={y + 12.4}
              fontSize="5.6"
              fontWeight="600"
              fill={ok ? "#26703C" : "#9C6417"}
              textAnchor="middle"
            >
              {r[4]}
            </text>
            <text x="316" y={y + 12.4} fontSize="5.6" fill="#B3BECD">
              12.05
            </text>
          </g>
        );
      })}

      {/* footer */}
      <rect x="0" y="212" width="360" height="28" fill="#fff" />
      <line x1="0" y1="212" x2="360" y2="212" stroke="#E4EAF4" />
      <text x="12" y="229" fontSize="6" fill="#8496B0">
        68 de 70 listos · 2 requieren datos
      </text>
      <rect x="238" y="219" width="110" height="14" rx="3" fill="#2E7D46" />
      <text x="293" y="228.6" fontSize="6.2" fontWeight="600" fill="#fff" textAnchor="middle">
        Guardar 68 animales
      </text>
    </svg>
  );
}

/* ---------- Savee ---------- */
export function SaveeScreen({ className = "" }: { className?: string }) {
  /* the real app is dark and video first: a short recipe plays full bleed, and
     saving it schedules the meal and folds its ingredients into one shopping
     list grouped the way a supermarket is */
  const list = [
    { g: "Veggies & Fruits", items: [["Blueberry", "25 g"], ["Banana", "1 pcs"]] },
    { g: "Bakery", items: [["Sliced bread", "1 pkt"]] },
  ];
  return (
    <svg
      viewBox="0 0 170 320"
      aria-hidden
      role="presentation"
      className={className}
      fontFamily="inherit"
    >
      <rect width="170" height="320" rx="24" fill="#000" />
      <rect x="4" y="4" width="162" height="312" rx="20" fill="#111311" />
      <rect x="66" y="10" width="38" height="9" rx="4.5" fill="#000" />
      <text x="18" y="20" fontSize="6.4" fontWeight="600" fill="#EDEFEA">
        9:41
      </text>

      {/* wordmark and the toggle between the feed and the plan */}
      <text x="16" y="42" fontSize="11" fontWeight="800" fill="#3ED47B" letterSpacing="0.6">
        SAVEE
      </text>
      <rect x="112" y="32" width="42" height="15" rx="7.5" fill="#232723" />
      <circle cx="146" cy="39.5" r="6" fill="#3ED47B" />
      <path d="M143.6 39.5 l1.6 1.7 l2.6 -3.2" stroke="#0C0E0C" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* the recipe, scheduled to a day */}
      <rect x="12" y="54" width="146" height="66" rx="7" fill="#2A2620" />
      <path d="M12 92 q22 -20 42 -6 q20 12 38 -6 q24 -14 66 4 v24 a7 7 0 0 1 -7 7 h-132 a7 7 0 0 1 -7 -7z" fill="#7A5B31" opacity="0.85" />
      <circle cx="52" cy="76" r="9" fill="#C89A55" opacity="0.9" />
      <circle cx="76" cy="72" r="7" fill="#A8762F" opacity="0.85" />
      <text x="19" y="65" fontSize="5.4" fill="#EDEFEA" opacity="0.9">
        Schedule for
      </text>
      <text x="19" y="73" fontSize="6.2" fontWeight="700" fill="#fff">
        12.03.2025
      </text>
      <rect x="19" y="96" width="98" height="18" rx="5" fill="#0E100E" opacity="0.72" />
      <text x="26" y="104" fontSize="6.2" fontWeight="700" fill="#fff">
        French Toast
      </text>
      <text x="26" y="111.6" fontSize="5.2" fill="#B7BBB4">
        20 minutes · Easy
      </text>

      {/* portions, the control that decides how much gets bought */}
      <rect x="12" y="126" width="146" height="17" rx="6" fill="#1B1E1B" />
      <text x="20" y="137" fontSize="6" fill="#EDEFEA">
        Adjust portions
      </text>
      <circle cx="122" cy="134.5" r="5.4" fill="#2C312C" />
      <path d="M119.6 134.5 h4.8 M122 132.1 v4.8" stroke="#EDEFEA" strokeWidth="1" strokeLinecap="round" />
      <text x="135" y="137" fontSize="6.4" fontWeight="700" fill="#fff" textAnchor="middle">
        2
      </text>
      <circle cx="148" cy="134.5" r="5.4" fill="#2C312C" />
      <path d="M145.6 134.5 h4.8" stroke="#EDEFEA" strokeWidth="1" strokeLinecap="round" />

      {/* the list that falls out of it, grouped the way a shop is */}
      <rect x="12" y="149" width="146" height="130" rx="7" fill="#1B1E1B" />
      <text x="85" y="161" fontSize="6.4" fontWeight="700" fill="#fff" textAnchor="middle">
        Shopping list for this recipe
      </text>
      <line x1="20" y1="167" x2="150" y2="167" stroke="#2C312C" />
      {list.map((group, gi) => {
        const top = 176 + gi * 44;
        return (
          <g key={group.g}>
            <text x="20" y={top} fontSize="5.8" fontWeight="700" fill="#3ED47B">
              {group.g}
            </text>
            {group.items.map(([name, qty], ii) => {
              const y = top + 10 + ii * 15;
              return (
                <g key={name}>
                  <circle cx="24" cy={y} r="3.6" fill="none" stroke="#4A504A" strokeWidth="1" />
                  <text x="34" y={y + 2.2} fontSize="6" fill="#EDEFEA">
                    {name}
                  </text>
                  <text x="150" y={y + 2.2} fontSize="5.8" fill="#B7BBB4" textAnchor="end">
                    {qty}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* the five destinations */}
      <rect x="12" y="286" width="146" height="24" rx="12" fill="#1B1E1B" />
      {[0, 1, 2, 3, 4].map((i) => {
        const cx = 28 + i * 28.5;
        const on = i === 2;
        return (
          <g key={i}>
            {i === 0 && <path d="M23 302 v-7 l5 -3.4 l5 3.4 v7z" fill="none" stroke="#8A908A" strokeWidth="1.1" strokeLinejoin="round" />}
            {i === 1 && (
              <g stroke="#8A908A" strokeWidth="1.1" fill="none">
                <circle cx={cx} cy="297" r="4" />
                <path d={`M${cx + 3} 300 l3 3`} strokeLinecap="round" />
              </g>
            )}
            {on && (
              <g stroke="#3ED47B" strokeWidth="1.2" fill="none" strokeLinecap="round">
                <path d={`M${cx - 3} 292 v5 M${cx} 292 v5 M${cx + 3} 292 v5`} />
                <path d={`M${cx} 297 v6`} />
              </g>
            )}
            {i === 3 && <path d={`M${cx - 3.4} 292 h6.8 v10 l-3.4 -3 l-3.4 3z`} fill="none" stroke="#8A908A" strokeWidth="1.1" strokeLinejoin="round" />}
            {i === 4 && <circle cx={cx} cy="297" r="5" fill="none" stroke="#3ED47B" strokeWidth="1.2" />}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- Meinerva ---------- */
export function MeinervaScreen({ className = "" }: { className?: string }) {
  const dots = Array.from({ length: 44 }, (_, i) => {
    const t = i / 43;
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
      fontFamily="inherit"
    >
      <rect width="170" height="320" rx="24" fill="#000" />
      <rect x="4" y="4" width="162" height="312" rx="20" fill="#141414" />
      <rect x="66" y="10" width="38" height="9" rx="4.5" fill="#000" />
      <text x="18" y="20" fontSize="6.4" fontWeight="600" fill="#6F6A63">
        9:41
      </text>
      <rect x="132" y="14" width="20" height="5" rx="2.5" fill="#3A3835" />

      {/* the work, still veiled */}
      <rect x="18" y="32" width="134" height="74" rx="9" fill="#1E1C1A" />
      <circle cx="60" cy="68" r="20" fill="#2E2A26" />
      <circle cx="100" cy="62" r="13" fill="#35302B" />
      <path d="M18 94 q36 -19 66 -4 t68 -9 v16 a9 9 0 0 1 -9 9 H27 a9 9 0 0 1 -9 -9 z" fill="#26231F" />
      <rect x="128" y="38" width="16" height="16" rx="8" fill="#000" fillOpacity="0.5" />
      <circle cx="136" cy="46" r="3.2" fill="#8A7F6E" />

      {/* dotted wordmark */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#EDE6D8" fillOpacity={0.55 + (i % 3) * 0.15} />
      ))}
      <text x="85" y="154" fontSize="5.8" textAnchor="middle" fill="#6C655B" letterSpacing="1.2">
        LOOK FIRST
      </text>

      {/* your reading */}
      <rect x="18" y="166" width="134" height="52" rx="9" fill="#1B1917" />
      <text x="27" y="180" fontSize="6.2" fill="#7E7568">
        Your reading
      </text>
      {[189, 199, 209].map((y, i) => (
        <rect key={y} x="27" y={y} width={i === 2 ? 62 : 116 - i * 14} height="3.6" rx="1.8" fill="#3E3A34" />
      ))}

      {/* the hint, locked until you write */}
      <rect x="18" y="226" width="76" height="17" rx="8.5" fill="#2A2622" stroke="#413B33" />
      <circle cx="30" cy="234.5" r="3" fill="#C6A96B" />
      <text x="39" y="237" fontSize="6" fill="#A2957F">
        Unlock hint
      </text>

      {/* community critiques */}
      <text x="18" y="260" fontSize="6" fill="#6C655B">
        Critiques · 12
      </text>
      {[268, 285, 302].map((y, i) => (
        <g key={y}>
          <rect x={18 + i * 3} y={y} width={134 - i * 6} height="14" rx="7" fill="#201D1A" />
          <circle cx={28 + i * 3} cy={y + 7} r="4" fill="#3A342D" />
          <rect x={38 + i * 3} y={y + 5} width={72 - i * 10} height="3.6" rx="1.8" fill="#39342D" />
        </g>
      ))}
    </svg>
  );
}


/* ---------- Duo Scan Memory ---------- */
export function ScanMemoryScreen({ className = "" }: { className?: string }) {
  /* the panel that did not exist before: what has been scanned, and how many
     of each. The whole case study is this list. */
  const scanned = [
    { f: "Pistacchio", n: 12 },
    { f: "Stracciatella", n: 9 },
    { f: "Nocciola", n: 8 },
    { f: "Limone", n: 6 },
    { f: "Cioccolato Fondente", n: 5 },
  ];
  const total = scanned.reduce((a, r) => a + r.n, 0);

  return (
    <svg
      viewBox="0 0 360 240"
      aria-hidden
      role="presentation"
      className={className}
      fontFamily="inherit"
    >
      <rect width="360" height="240" rx="11" fill="#FBFAF8" />
      <rect x="0.5" y="0.5" width="359" height="239" rx="10.5" fill="none" stroke="#E3E0DA" />

      {/* window bar */}
      <path d="M0 11A11 11 0 0 1 11 0h338a11 11 0 0 1 11 11v13H0z" fill="#fff" />
      <line x1="0" y1="24" x2="360" y2="24" stroke="#ECEAE5" />
      {[11, 19, 27].map((cx) => (
        <circle key={cx} cx={cx} cy="12" r="2.6" fill="#DEDCD6" />
      ))}
      <text x="180" y="15" textAnchor="middle" fontSize="6.4" fill="#8C8880">
        Duo · Scan Memory
      </text>

      {/* store picker, the step that now comes first */}
      <text x="14" y="39" fontSize="5.6" fill="#9A968E" letterSpacing="0.4">
        STORE
      </text>
      <rect x="14" y="43" width="104" height="16" rx="4" fill="#fff" stroke="#2E8A77" strokeWidth="1.1" />
      <text x="21" y="53.6" fontSize="6.6" fontWeight="600" fill="#20211E">
        Mitte · Torstraße
      </text>
      <path d="M108 50 l3.4 3.4 3.4-3.4" stroke="#2E8A77" strokeWidth="1.1" fill="none" strokeLinecap="round" />

      <g>
        <circle cx="132" cy="51" r="2.4" fill="#2E8A77" />
        <text x="138" y="53.4" fontSize="6" fill="#6E6A62">
          Scanner connected
        </text>
      </g>

      {/* the scan field: the only thing the old screen had */}
      <rect x="212" y="43" width="134" height="16" rx="4" fill="#F3F1EC" stroke="#E3E0DA" />
      <text x="219" y="53.6" fontSize="6.4" fontFamily="ui-monospace, monospace" fill="#20211E">
        8412 0093 5517
      </text>
      <text x="338" y="53.6" fontSize="5.4" fill="#A8A49B" textAnchor="end">
        LAST
      </text>

      {/* ── the new lower panel ── */}
      <rect x="14" y="68" width="332" height="126" rx="6" fill="#fff" stroke="#E9E6E0" />
      <line x1="14" y1="85" x2="346" y2="85" stroke="#EFEDE8" />
      <text x="22" y="79.6" fontSize="6" fontWeight="600" fill="#6E6A62" letterSpacing="0.3">
        SCANNED THIS DELIVERY
      </text>
      <text x="338" y="79.6" fontSize="6" fontWeight="700" fill="#2E8A77" textAnchor="end">
        {total} units
      </text>

      {scanned.map((r, i) => {
        const y = 92 + i * 20;
        /* one row is picked, which is what puts the delete affordance on it.
           The rest offer the chevron, so it reads as reachable everywhere. */
        const on = i === 0;
        return (
          <g key={r.f}>
            {i > 0 && <line x1="22" y1={y - 6} x2="338" y2={y - 6} stroke="#F4F2ED" />}
            {on && <rect x="18" y={y - 4} width="324" height="17" rx="4" fill="#F1F7F4" />}

            <rect x="22" y={y} width="9" height="9" rx="2.5" fill={on ? "#2E8A77" : "#EAF4F1"} />
            {on ? (
              <path
                d={`M24.3 ${y + 4.6} l1.6 1.7 l2.7 -3.2`}
                stroke="#fff"
                strokeWidth="1.1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <circle cx="26.5" cy={y + 4.5} r="2" fill="#2E8A77" />
            )}

            <text x="38" y={y + 7.4} fontSize="6.8" fontWeight={on ? 600 : 400} fill="#20211E">
              {r.f}
            </text>

            {/* how much of the delivery this flavour is */}
            <rect x="142" y={y + 2} width="74" height="5" rx="2.5" fill="#F1EFEA" />
            <rect x="142" y={y + 2} width={(r.n / 12) * 74} height="5" rx="2.5" fill="#7FC3B2" />

            {/* minus, the count, plus: correct a unit without touching a keyboard */}
            <rect x="230" y={y - 0.5} width="11" height="11" rx="3" fill="#fff" stroke="#DDD9D2" />
            <line
              x1="233"
              y1={y + 5}
              x2="238"
              y2={y + 5}
              stroke="#6E6A62"
              strokeWidth="1.1"
              strokeLinecap="round"
            />

            <text
              x="256"
              y={y + 7.4}
              fontSize="7"
              fontWeight="700"
              fill="#20211E"
              textAnchor="middle"
            >
              {r.n}
            </text>

            <rect x="271" y={y - 0.5} width="11" height="11" rx="3" fill="#fff" stroke="#DDD9D2" />
            <g stroke="#6E6A62" strokeWidth="1.1" strokeLinecap="round">
              <line x1="274" y1={y + 5} x2="279" y2={y + 5} />
              <line x1="276.5" y1={y + 2.5} x2="276.5" y2={y + 7.5} />
            </g>

            {/* far right: the whole row goes, or you step into it */}
            {on ? (
              <g>
                <rect x="318" y={y - 0.5} width="20" height="11" rx="3" fill="#C7402C" />
                <g
                  stroke="#fff"
                  strokeWidth="1.1"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="324.4" y1={y + 2.6} x2="331.6" y2={y + 2.6} />
                  <path d={`M326.8 ${y + 2.6} v-1 h2.4 v1`} />
                  <path d={`M325.4 ${y + 3.6} l0.5 4.6 h4.2 l0.5 -4.6`} />
                </g>
              </g>
            ) : (
              <path
                d={`M330 ${y + 2.4} l2.7 2.6 l-2.7 2.6`}
                stroke="#BDB8AF"
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
      <rect x="14" y="204" width="96" height="20" rx="5" fill="#fff" stroke="#D8D4CC" />
      <text x="62" y="216.8" fontSize="6.6" fill="#4A4740" textAnchor="middle">
        Remove unit
      </text>
      <rect x="238" y="204" width="108" height="20" rx="5" fill="#2E8A77" />
      <text x="292" y="216.8" fontSize="6.6" fontWeight="600" fill="#fff" textAnchor="middle">
        Accept · send to ERP
      </text>
      <text x="120" y="216.8" fontSize="5.8" fill="#A8A49B">
        scan the unit again to take it off
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
