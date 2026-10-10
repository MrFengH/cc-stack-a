import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cam, ClipHold, font, Rec, Tap, Words } from "../components/primitives";
import { THE_ONE } from "../data/facts";
import L from "../data/layout.json";
import { C, EASE_IN, EASE_IN_OUT, EASE_OUT, keys, tw } from "../theme";

// Product hero: The One's photo arrives from the catalogue zoom and settles; the chapter title takes the right.
export const ProductHero: React.FC = () => {
  const f = useCurrentFrame();
  const p = tw(f, [6, 30], [0, 1], EASE_IN_OUT);
  // starts exactly where the filter shot's zoom left the card image (268 css wide at zoom 3.15, centred)
  const lerp = (a: number, b: number) => a + (b - a) * p;
  const RATIO = 1600 / 1252,
    w0 = 268 * 3.15;
  const w = lerp(w0, 600),
    h = w * RATIO;
  const x = lerp(960 - w0 / 2, 200),
    y = lerp(540 - (w0 * RATIO) / 2, 138);
  const titleOut = 104;
  return (
    <AbsoluteFill style={{ background: C.sage }}>
      <div style={{ position: "absolute", left: x, top: y + tw(f, [30, 138], [0, -26], (t) => t), width: w, height: h, overflow: "hidden" }}>
        <Rec
          name="product-photo-the-one"
          style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.0 + tw(f, [0, 138], [0, 0.1], (t) => t)) }}
        />
      </div>
      <div style={{ position: "absolute", left: 930, top: 250 }}>
        <Words text="Corazón" at={30} out={titleOut} style={font(230, 600, { color: C.ink })} />
        <Words text="De 30 minutos a 3 horas" at={36} stagger={2} out={titleOut} style={font(36, 400, { color: C.inkSoft, marginTop: 26, letterSpacing: 0 })} />
        <Words text="elegir bien." at={66} out={titleOut} style={font(130, 500, { color: C.pine, marginTop: 70 })} />
      </div>
      <div style={{ position: "absolute", left: 930, top: 470 }}>
        <Words text="The One" at={titleOut + 16} style={font(170, 600, { color: C.ink })} />
        <Words
          text="Dolce & Gabbana · Eau de Parfum 75 ml"
          at={titleOut + 22}
          stagger={2}
          style={font(38, 400, { color: C.inkSoft, marginTop: 24, letterSpacing: 0 })}
        />
      </div>
    </AbsoluteFill>
  );
};

// Pyramid: the real product page scrolls (sped up) down to "Cómo evoluciona en la piel"; the camera
// lands on it and the Corazón cell lights up — the structure of this film, found in the UI.
const PYR = { x: 870, y: 140, w: 730, h: 344, cellTop: 56.5, cellH: 145 };
export const cellRect = (i: number) => ({ x: PYR.x + (PYR.w / 3) * i, y: PYR.y + PYR.cellTop, w: PYR.w / 3, h: PYR.cellH });

export const PyramidCells: React.FC<{ active: number; glow: number; dim: number }> = ({ active, glow, dim }) => (
  <>
    <Rec name="product-pyramid" style={{ position: "absolute", left: PYR.x, top: PYR.y, width: PYR.w, height: PYR.h }} />
    {[0, 1, 2].map((i) => {
      const r = cellRect(i);
      return i === active ? (
        <div
          key={i}
          style={{
            position: "absolute",
            left: r.x,
            top: r.y,
            width: r.w,
            height: r.h,
            boxShadow: `inset 0 0 0 ${2.5 * glow}px ${C.pine}`,
            background: `rgba(35,70,60,${0.07 * glow})`,
          }}
        />
      ) : (
        <div key={i} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, background: C.ground, opacity: 0.55 * dim }} />
      );
    })}
  </>
);

export const Pyramid: React.FC = () => {
  const f = useCurrentFrame();
  const cx = PYR.x + PYR.w / 2,
    cy = PYR.y + 130;
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Cam
        zoom={keys(f, [
          [0, 1],
          [46, 1],
          [64, 2.2],
          [90, 2.3],
        ])}
        cx={keys(f, [
          [0, 960],
          [46, 960],
          [64, cx],
        ])}
        cy={keys(f, [
          [0, 540],
          [46, 540],
          [64, cy],
        ])}
      >
        <ClipHold name="product-to-pyramid" length={125} trimBefore={8} playbackRate={2.4} />
        {/* crisp 2x element capture laid exactly over the frozen frame once the camera moves in */}
        <div style={{ opacity: tw(f, [48, 52], [0, 1]) }}>
          <PyramidCells active={1} glow={tw(f, [62, 74], [0, 1])} dim={tw(f, [62, 74], [0, 1])} />
        </div>
      </Cam>
    </AbsoluteFill>
  );
};

// Price: the camera reads the real buy box — price, savings, then stock — like an eye would.
export const Price: React.FC = () => {
  const f = useCurrentFrame();
  const X = (1920 - 506) / 2,
    Y = (1080 - 616) / 2;
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Cam
        zoom={keys(f, [
          [0, 1.55],
          [10, 2.05],
          [34, 2.05],
          [50, 2.1],
          [72, 1.85],
        ])}
        cx={keys(f, [
          [0, X + 200],
          [10, X + 175],
          [34, X + 175],
          [50, X + 160],
        ])}
        cy={keys(f, [
          [0, Y + 150],
          [10, Y + 148],
          [34, Y + 148],
          [50, Y + 245],
          [72, Y + 225],
        ])}
      >
        <Rec name="product-buybox" style={{ position: "absolute", left: X, top: Y, width: 506, height: 616 }} />
      </Cam>
    </AbsoluteFill>
  );
};

// Cart: DG10 typed into the real coupon field, applied; then the numbers are re-set large beside the UI.
export const Cart: React.FC = () => {
  const f = useCurrentFrame();
  const S = L.cartAfter.summary;
  const apply = { x: L.cartBefore.input.x + L.cartBefore.input.w + 52, y: L.cartBefore.input.y + L.cartBefore.input.h / 2 };
  const toHero = tw(f, [78, 100], [0, 1], EASE_IN_OUT);
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <AbsoluteFill style={{ background: C.sage, opacity: toHero }} />
      <div style={{ position: "absolute", inset: 0, translate: `${-toHero * 600}px 0` }}>
        <Cam
          zoom={keys(f, [
            [0, 1.55],
            [36, 1.7],
            [50, 2.3],
            [78, 2.3],
            [100, 1.25],
          ])}
          cx={keys(f, [
            [0, S.x + S.w / 2],
            [36, S.x + S.w / 2],
            [50, S.x + S.w / 2],
            [100, S.x + S.w / 2],
          ])}
          cy={keys(f, [
            [0, 520],
            [36, 560],
            [50, 420],
            [78, 420],
            [100, S.y + S.h / 2],
          ])}
        >
          <ClipHold name="cart-dg10" length={82} />
          {/* once applied, the 2x capture of the same summary replaces the clip for the close-up */}
          <Rec name="cart-summary-dg10" style={{ position: "absolute", left: S.x, top: S.y, width: S.w, height: S.h, opacity: f >= 40 ? 1 : 0 }} />
          <Tap x={apply.x} y={apply.y} at={35} />
          {/* once the hero numbers take over, the page around the summary card falls away */}
          <div
            style={{
              position: "absolute",
              left: S.x,
              top: S.y,
              width: S.w,
              height: S.h,
              boxShadow: `0 0 0 4000px ${C.sage}`,
              opacity: tw(f, [74, 84], [0, 1]),
            }}
          />
        </Cam>
      </div>
      <div style={{ position: "absolute", left: 1040, top: 270 }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Words text={THE_ONE.price} at={84} style={font(120, 500, { color: C.inkSoft })} />
          <div
            style={{
              position: "absolute",
              left: -6,
              right: -6,
              top: "52%",
              height: 7,
              background: C.sale,
              scale: `${tw(f, [96, 106], [0, 1], EASE_IN_OUT)} 1`,
              transformOrigin: "left",
            }}
          />
        </div>
        <Words text={`DG10  ${THE_ONE.discount}`} at={100} style={font(64, 600, { color: C.sale, marginTop: 26, letterSpacing: "0" })} />
        <div style={{ scale: String(tw(f, [110, 122], [0.92, 1], EASE_OUT)), transformOrigin: "left center" }}>
          <Words text={THE_ONE.total} at={110} style={font(240, 600, { color: C.ink, marginTop: 20 })} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Checkout: delivery → "Retiro en tienda", payment → Yappy, ACH, Yappy; the camera follows each choice.
export const Checkout: React.FC = () => {
  const f = useCurrentFrame();
  const K = L.checkout;
  const radio = (r: { x: number; y: number }) => ({ x: r.x + 26, y: r.y + 30 });
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Cam
        zoom={keys(f, [
          [0, 1.6],
          [28, 1.6],
          [42, 1.6],
          [86, 1.6],
          [104, 1.0],
          [126, 1.03],
        ])}
        cx={keys(f, [
          [0, 683],
          [28, 683],
          [42, 683],
          [86, 683],
          [104, 960],
        ])}
        cy={keys(f, [
          [0, 330],
          [28, 330],
          [42, 700],
          [86, 700],
          [104, 520],
        ])}
      >
        <ClipHold name="checkout-options" length={115} />
        <Tap {...radio(K.retiro)} at={16} />
        <Tap {...radio(K.yappy)} at={40} />
        <Tap {...radio(K.ach)} at={64} />
        <Tap {...radio(K.yappy)} at={84} />
      </Cam>
      <AbsoluteFill style={{ background: C.ground, opacity: tw(f, [118, 126], [0, 1], EASE_IN) }} />
    </AbsoluteFill>
  );
};
