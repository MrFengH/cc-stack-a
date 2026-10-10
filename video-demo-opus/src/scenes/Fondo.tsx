import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cam, ClipHold, font, Rec, useCount, Words } from "../components/primitives";
import { KPIS, money, SALES_30D_DELTA, SALES_30D_TOTAL, SALES_DAILY, SALES_MAX_LABEL } from "../data/facts";
import { C, EASE_IN, EASE_IN_OUT, keys, tw } from "../theme";
import { cellRect, PyramidCells } from "./Corazon";

// The "Fondo" cell of the real pyramid becomes the door to the last chapter: the camera dives into it
// and the cell's rectangle opens out to fill the frame in pine.
export const FondoDoor: React.FC = () => {
  const f = useCurrentFrame();
  const mid = cellRect(1),
    fondo = cellRect(2);
  const Z = 5.5,
    cw = fondo.w * Z,
    ch = fondo.h * Z;
  const open = tw(f, [18, 32], [0, 1], EASE_IN_OUT);
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Cam
        zoom={keys(
          f,
          [
            [0, 2.3],
            [6, 2.3],
            [20, Z],
          ],
          EASE_IN,
        )}
        cx={keys(
          f,
          [
            [0, mid.x + mid.w / 2],
            [6, mid.x + mid.w / 2],
            [20, fondo.x + fondo.w / 2],
          ],
          EASE_IN,
        )}
        cy={keys(
          f,
          [
            [0, mid.y + 74],
            [20, fondo.y + fondo.h / 2],
          ],
          EASE_IN,
        )}
      >
        <PyramidCells active={2} glow={tw(f, [0, 8], [0, 1])} dim={1} />
      </Cam>
      <div
        style={{
          position: "absolute",
          background: C.pineDeep,
          opacity: tw(f, [12, 19], [0, 1]),
          left: (1 - open) * (960 - cw / 2),
          top: (1 - open) * (540 - ch / 2),
          width: cw + (1920 - cw) * open,
          height: ch + (1080 - ch) * open,
        }}
      />
      <div style={{ position: "absolute", left: 200, top: 250 }}>
        <Words text="Fondo" at={28} style={font(250, 600, { color: C.ground })} />
        <Words text="Lo que queda al final del día" at={34} stagger={2} style={font(36, 400, { color: C.onPineSoft, marginTop: 26, letterSpacing: 0 })} />
        <Words text="lo que queda." at={58} style={font(130, 500, { color: C.pineTint, marginTop: 70 })} />
      </div>
    </AbsoluteFill>
  );
};

// Tracking: the real stepper of order NA-00411 is read step by step; the order history rises behind it.
const STEP_EDGES = [0.13, 0.31, 0.5, 0.69, 1];
export const STEP_TICKS = [16, 25, 34]; // the three completed steps (local frames) — the SFX use them too
export const Tracking: React.FC = () => {
  const f = useCurrentFrame();
  const reveal = STEP_EDGES.reduce((acc, edge, i) => {
    const s = 16 + i * 9;
    return acc + (edge - (STEP_EDGES[i - 1] ?? 0)) * tw(f, [s - 3, s + 3], [0, 1], EASE_IN_OUT);
  }, 0);
  const W = 1500,
    H = (W * 316) / 1632;
  return (
    <AbsoluteFill style={{ background: C.pineDeep }}>
      <div
        style={{
          position: "absolute",
          left: 1090,
          top: keys(f, [
            [20, 1120],
            [44, 760],
            [108, 720],
          ]),
          width: 640,
          opacity: tw(f, [20, 34], [0, 0.82]), // history stays subordinate to the tracker
        }}
      >
        <Rec name="account-orders" style={{ width: 640, boxShadow: "0 40px 80px rgba(0,0,0,.35)" }} />
      </div>
      <div style={{ position: "absolute", left: 210, top: 140 }}>
        <Words text="Pedido NA-00411" at={2} style={font(96, 600, { color: C.ground })} />
        <div
          style={{
            ...font(30, 500, { color: "#284866", letterSpacing: 0 }),
            display: "inline-block",
            marginTop: 24,
            padding: "10px 18px",
            background: "#e3ebf3",
            opacity: tw(f, [10, 16], [0, 1]),
            translate: `0 ${tw(f, [10, 20], [20, 0])}px`,
          }}
        >
          En preparación
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 210,
          top: 380,
          width: W,
          height: H,
          background: C.surface,
          opacity: tw(f, [6, 14], [0, 1]),
          boxShadow: "0 40px 80px rgba(0,0,0,.3)",
        }}
      >
        <div style={{ clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }}>
          <Rec name="order-411-tracking" style={{ width: W, height: H }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// KPIs: the panel's four headline figures, set large and counted up to their exact values.
export const Kpis: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.pineDeep }}>
      <div style={{ position: "absolute", left: 200, top: 250 }}>
        <Words text="Nota Alta Panel · Resumen" at={0} stagger={2} style={font(36, 500, { color: C.onPineSoft, letterSpacing: 0 })} />
      </div>
      {KPIS.map((k, i) => {
        const s = 4 + i * 6;
        return <Kpi key={k.label} label={k.label} value={k.value} isMoney={k.money} s={s} x={200 + (i % 2) * 900} y={370 + Math.floor(i / 2) * 290} f={f} />;
      })}
    </AbsoluteFill>
  );
};

const Kpi: React.FC<{ label: string; value: number; isMoney: boolean; s: number; x: number; y: number; f: number }> = ({
  label,
  value,
  isMoney,
  s,
  x,
  y,
  f,
}) => {
  const v = useCount(value, s + 2, 34);
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {x > 200 && (
        <div
          style={{
            position: "absolute",
            left: -60,
            top: 0,
            width: 1.5,
            height: 220,
            background: "rgba(201,216,208,.28)",
            scale: `1 ${tw(f, [s, s + 16], [0, 1])}`,
            transformOrigin: "top",
          }}
        />
      )}
      <Words text={label} at={s} stagger={2} style={font(32, 400, { color: C.onPineSoft, letterSpacing: 0 })} />
      <div style={font(isMoney ? 124 : 140, 600, { color: C.ground, marginTop: 22, opacity: tw(f, [s + 2, s + 8], [0, 1]) })}>
        {isMoney ? money(v) : Math.round(v)}
      </div>
    </div>
  );
};

// Chart: the 30-day sales series from the panel's own data table, rebuilt bar by bar.
export const Chart: React.FC = () => {
  const f = useCurrentFrame();
  const X0 = 200,
    W = 1520,
    BASE = 900,
    HMAX = 470;
  const max = Math.max(...SALES_DAILY.map((d) => d.value));
  const step = W / SALES_DAILY.length,
    bw = step * 0.7;
  const total = useCount(SALES_30D_TOTAL, 10, 46);
  return (
    <AbsoluteFill style={{ background: C.pineDeep }}>
      <div style={{ position: "absolute", left: X0, top: 150 }}>
        <Words text="Ventas por día, últimos 30 días" at={0} stagger={2} style={font(44, 500, { color: C.ground, letterSpacing: "-0.01em" })} />
      </div>
      {/* left-aligned at a fixed x so the count only grows rightwards (proportional figures, no jitter of the start) */}
      <div style={{ position: "absolute", left: 1180, top: 120 }}>
        <div style={font(110, 600, { color: C.ground, opacity: tw(f, [8, 14], [0, 1]) })}>{money(total)}</div>
        <div style={font(32, 400, { color: C.onPineSoft, marginTop: 14, letterSpacing: 0, opacity: tw(f, [30, 40], [0, 1]) })}>
          <span style={{ color: "#8fd1a8", fontWeight: 600 }}>{SALES_30D_DELTA}</span> frente a los 30 días anteriores
        </div>
      </div>
      {/* max guide, as in the panel */}
      <div
        style={{
          position: "absolute",
          left: X0,
          top: BASE - HMAX,
          width: W,
          borderTop: "1.5px dashed rgba(201,216,208,.3)",
          scale: `${tw(f, [6, 30], [0, 1], EASE_IN_OUT)} 1`,
          transformOrigin: "left",
        }}
      />
      <div
        style={font(24, 400, {
          position: "absolute",
          left: X0,
          top: BASE - HMAX - 40,
          color: C.onPineSoft,
          letterSpacing: 0,
          opacity: tw(f, [24, 32], [0, 1]),
        })}
      >
        {SALES_MAX_LABEL}
      </div>
      {SALES_DAILY.map((d, i) => {
        const s = 8 + i * 1.3;
        const h = Math.max(3, (d.value / max) * HMAX) * tw(f, [s, s + 20], [0, 1]);
        return (
          <div
            key={d.day}
            style={{
              position: "absolute",
              left: X0 + i * step + (step - bw) / 2,
              top: BASE - h,
              width: bw,
              height: h,
              background: d.value ? C.pineTint : "rgba(201,216,208,.35)",
            }}
          />
        );
      })}
      <div style={{ position: "absolute", left: X0, top: BASE, width: W, height: 1.5, background: "rgba(201,216,208,.45)" }} />
      {(
        [
          ["10 Sep", 0],
          ["24 Sep", 14],
          ["Hoy", 29],
        ] as const
      ).map(([t, i]) => (
        <div
          key={t}
          style={font(26, 400, {
            position: "absolute",
            top: BASE + 22,
            left: X0 + i * step + step / 2,
            translate: i === 29 ? "-100% 0" : i === 0 ? "-20% 0" : "-50% 0",
            color: C.onPineSoft,
            letterSpacing: 0,
            opacity: tw(f, [20, 30], [0, 1]),
          })}
        >
          {t}
        </div>
      ))}
    </AbsoluteFill>
  );
};

// Operations: order status, low stock and inventory — the real panel cards, landing on 8th notes.
export const Ops: React.FC = () => {
  const f = useCurrentFrame();
  const card = (s: number, depth: number): React.CSSProperties => ({
    position: "absolute",
    opacity: tw(f, [s, s + 8], [0, 1]),
    translate: `0 ${tw(f, [s, s + 20], [90, 0]) - f * depth}px`,
    boxShadow: "0 40px 80px rgba(0,0,0,.35)",
  });
  return (
    <AbsoluteFill style={{ background: C.pineDeep }}>
      <div style={{ ...card(2, 0.25), left: 300, top: 170 }}>
        <Rec name="panel-inventory-kpis" style={{ width: 1320, height: 90 }} />
      </div>
      <div style={{ ...card(11, 0.45), left: 300, top: 330 }}>
        <Rec name="panel-status" style={{ width: 590, height: 476 }} />
      </div>
      <div style={{ ...card(20, 0.6), left: 1030, top: 330 }}>
        <Rec name="panel-lowstock" style={{ width: 590, height: 483 }} />
      </div>
    </AbsoluteFill>
  );
};

// The whole panel, pulled back from the KPI row while it scrolls; then the breath before the close.
export const PanelPull: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Cam
        zoom={keys(f, [
          [0, 1.8],
          [36, 1.0],
          [90, 1.0],
        ])}
        cx={keys(f, [
          [0, 1080],
          [36, 960],
        ])}
        cy={keys(f, [
          [0, 167],
          [36, 540],
        ])}
      >
        <ClipHold name="panel-scroll" length={115} />
      </Cam>
    </AbsoluteFill>
  );
};
