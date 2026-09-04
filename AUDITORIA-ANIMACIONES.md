# Auditoría de animaciones — v2

**Fecha:** 2026-09-03
**Alcance:** todo el código de motion del sitio (`components/v2/*`, `components/SmoothScroll.tsx`, `app/globals.css`, View Transitions en `Theme.tsx`).
**Estado del repo:** git roto (`fatal: bad object HEAD`), sin commit stamp verificable.

---

## Resumen

El sistema de motion ya estaba muy cuidado: `MotionConfig reducedMotion="user"`, `prefers-reduced-motion`
en cada `@keyframes`, `EASE` consistente, `whileTap` en todo lo presionable, solo `transform`/`opacity`,
sin `transition: all`, sin `ease-in`. La mayoría de decisiones están documentadas y son deliberadas — no
se tocaron.

Se encontraron **7 puntos mejorables**. Los 7 quedaron **corregidos** en esta pasada.

---

## Hallazgos y correcciones

### 1 · CursorLoop → CardDemo — loop infinito sin gate + poco vivo + sincronizadas · **HIGH** · hecho

**Problema.** El cursor falso de cada card (`CursorLoop.tsx`) corría `repeat: Infinity` sobre ~5
elementos `motion` por card, **montado y animando aunque la card estuviera fuera de viewport**. El
movimiento leía mecánico (`ease-out` = teletransporte, clic al instante de llegar), **el clic no producía
ningún resultado**, y **las tres cards iban sincronizadas** — clic en una = clic en todas.

**Corrección — `CursorLoop.tsx` eliminado, reemplazado por `components/v2/CardDemo.tsx`:**
- **Gate por visibilidad:** `useInView` — cero animación fuera de viewport.
- **Viaje humano:** `ease-in-out` por segmento (acelera y frena).
- **Apunta antes de hacer clic:** el puntero se asienta un beat, *después* dispara — el cursor se hunde,
  sale un anillo sonar, el control se presiona.
- **El clic produce un resultado, y persiste hasta que el loop reinicia:**
  - ERP Duo: resuelve la alerta "Missing IBAN" → checkbox + tachado, y estampa "logged" en "ON NOW".
  - Scan Memory: tilda "Stracciatella" → check verde, y "sent" al aceptar (con el botón inundándose).
  - TaurusWebs: "seleccionar todo" → los 4 checkboxes de fila caen en cascada, y "70 / 70" al guardar.
- **Zoom:** 1 push-in por card (`transform` de un `<g>` que envuelve mockup + overlay, así van juntos y
  alineados; el `<svg>` recorta lo que el zoom empuja fuera). Encuadrado sobre la zona del resultado
  (panel de alertas / lista escaneada / cuerpo de la tabla), no sobre el control diminuto.
- **Desincronizadas:** cada demo tiene su `phase` (arranque: 0 / 2.6 / 5.1 s) y su `tempo` (1.0 / 1.12 /
  0.92), y rutas de distinta forma y duración → sus loops nunca coinciden ni vuelven a alinearse.
- **Fuera:** el "bob de reposo" (temblorcito del cursor) y el halo — eran ruido.
- Coordenadas alineadas pixel a pixel con los SVG de `ProductScreens.tsx`.
- Savee (screen raster, no SVG) y Meinerva conservan un loop de tap simple, también desincronizado.

### 2 · Duraciones sin tokenizar · **MEDIUM** · hecho

**Problema.** `motion.ts` definía una escala `DURATION` pero solo la usaban `V2Button` y `V2Home`. El
resto tecleaba a mano: `0.6`×6, `0.55`×5, `0.5`×5, `0.45`×3 — casi-duplicados del mismo reveal.

**Corrección:**
- `components/v2/motion.ts`: escala `DURATION` completa y nombrada
  (`press .14 / hover .2 / flood .26 / fast .35 / base .5 / slow .8 / draw 1.2`) + helpers
  `fadeUp()`, `fadeIn()`, `hairline()`. `SPRING` pasa a estilo Apple (`{ duration: 0.5, bounce: 0.2 }`).
- Convertidos a tokens: `V2CaseStudy.tsx`, `V2Flow.tsx`, `V2DotStat.tsx`, `V2BulkTable.tsx`,
  `ProjectFolder.tsx`. Los reveals grandes bajan de 0.6 → 0.5 (más responsivo, dentro de guía).

### 3 · V2BulkTable — toggle before/after lento + salto de altura · **MEDIUM** · hecho

**Problema.** `AnimatePresence mode="wait"` en un segmented control: al alternar, encolaba
salida (0.32s) + entrada (0.32s) ≈ 0.6s de ida y vuelta antes de asentar. Y la altura del contenedor
teletransportaba entre dos alturas muy distintas (formulario vs. tabla).

**Corrección (`components/v2/V2BulkTable.tsx`):**
- `mode="popLayout"` — el panel entrante arranca el frame que se pide, sin esperar la salida del otro.
- Entrada/salida bajan a `DURATION.fast` (0.35s).
- `layout` en el marco → la altura de la card se anima suave entre los dos tamaños en vez de saltar.
- El pill del `layoutId` usa el token `SPRING`.

### 4 · `@keyframes v2-dot-in` arrancaba en `scale(0.4)` · **LOW** · hecho

**Problema.** Los puntitos de `V2DotStat` "saltaban" desde el 40% de su tamaño (≈5px). Guía: nada
aparece de la nada, mínimo `scale(0.9)` — salvo casos de "llenado" donde puede ser algo menor.

**Corrección (`app/globals.css`):** `scale(0.4)` → `scale(0.66)`.

### 5 · Token `SPRING` muerto / spring tecleado a mano · **LOW** · hecho

**Problema.** `SPRING` definido en `motion.ts` y nunca usado. `V2BulkTable` tecleaba su propio
`{ stiffness: 380, damping: 34 }`.

**Corrección:** `SPRING` redefinido (estilo Apple) y usado en el pill de `V2BulkTable`.

### 6 · Barrido de tema con curva built-in débil · **LOW** · hecho

**Problema.** `Theme.tsx` animaba el `clip-path` circular (650ms) con `easing: "ease-in-out"` — la curva
nativa se arrastra en ambos extremos para un barrido de ese tamaño.

**Corrección (`components/v2/Theme.tsx`):** `easing: "cubic-bezier(0.77, 0, 0.175, 1)"`.

### 7 · RouteVeil — `backdrop-blur` de 40px durante la navegación · **LOW** · hecho

**Problema.** `backdrop-blur-2xl` (40px) a pantalla completa, animado durante cada cambio de página. El
presupuesto en transición es ~20px; caro en Safari.

**Corrección (`components/v2/RouteVeil.tsx`):** `backdrop-blur-2xl` → `backdrop-blur-lg` (16px). Sigue
leyendo como velo.

---

## Fuera de alcance, pero corregido para poder verificar

**Build roto por `OLD/`.** `npm run build` fallaba en el type-check por el snapshot archivado
`OLD/pre-stroke-redesign-2026-08-26/` (imports rotos, `any` implícitos). No estaba en `tsconfig.exclude`
ni en `.gitignore`.

**Corrección (`tsconfig.json`):** `"exclude": ["node_modules", "OLD"]`. `OLD/` es material de
referencia, no entrada de build.

---

## Verificación

- `npx tsc --noEmit` — limpio.
- `npx eslint` sobre los archivos tocados — limpio.
- `npm run build` — verde, 12 rutas estáticas.

### Feel-check (a ojo, con el sitio corriendo — `./scripts/preview.sh`)

1. **CursorLoop:** scrollear a "Selected work". El cursor de cada card debe:
   - moverse con aceleración/frenado, no a saltos;
   - pararse sobre un control, *esperar*, y recién ahí "hacer clic" (hundida del cursor + anillo +
     relleno del control);
   - no hacer nada mientras la card está fuera de pantalla (abrir DevTools → Performance, confirmar que
     no hay animación corriendo para las cards de "Academic projects" hasta scrollear hasta ellas).
2. **V2BulkTable** (dentro de un case study): alternar "Before / After" rápido varias veces — debe
   sentirse instantáneo, y la altura de la card debe deslizar entre tamaños, no saltar.
3. **Cambio de tema:** el círculo debe mantener velocidad en el medio del barrido.
4. **Reduced motion** (DevTools → Rendering → Emulate `prefers-reduced-motion`): recargar; los cursores
   falsos no deben aparecer, los reveals mantienen opacidad sin desplazamiento.

---

## Pendiente / fase 2 (opcional)

- Terminar de rutear por `DURATION` los pocos números crudos que quedan en `CursorLoop` (son ritmos
  bespoke: 2.2s del halo, 3.6s del bob) y el `650` del View Transition — se dejaron a propósito.
- `group-hover` en las cards de `ProjectFolder` sin guard `@media (hover: hover)` → hover pegajoso al
  tap en táctil. Menor: la card navega al tocar, así que el estado pegado dura un instante.
