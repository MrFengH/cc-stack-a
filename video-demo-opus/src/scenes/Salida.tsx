import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cam, ClipHold, font, Rec, Tap, useCount, Words } from "../components/primitives";
import { BRANDS } from "../data/facts";
import L from "../data/layout.json";
import { C, EASE_IN, EASE_IN_OUT, EASE_OUT, keys, tw } from "../theme";

// Home: the storefront as it opens, a slow push while the page settles into its benefits strip.
export const HomeHero: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Cam
      zoom={keys(f, [
        [0, 1.02],
        [82, 1.09],
      ])}
      cx={keys(f, [
        [0, 960],
        [82, 800],
      ])}
      cy={keys(f, [
        [0, 540],
        [82, 500],
      ])}
    >
      <ClipHold name="home-hero" length={127} trimBefore={4} />
    </Cam>
  );
};

// Families: the four real family tiles land on 8th notes; headline is the store's own copy.
const FAMILIES = ["citricos", "florales", "amaderados", "gourmand"];
export const Families: React.FC = () => {
  const f = useCurrentFrame();
  const W = 340,
    H = 546,
    GAP = 36,
    X0 = (1920 - (W * 4 + GAP * 3)) / 2;
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <div style={{ position: "absolute", left: X0, top: 120 }}>
        <Words text="Elige por cómo quieres oler" at={0} stagger={3} style={font(76, 600, { color: C.ink })} />
      </div>
      <Cam
        zoom={keys(f, [
          [0, 1],
          [80, 1.04],
        ])}
        cx={960}
        cy={600}
      >
        {FAMILIES.map((name, i) => {
          const s = 4 + i * 9;
          return (
            <div
              key={name}
              style={{
                position: "absolute",
                left: X0 + i * (W + GAP),
                top: 290 + tw(f, [s, s + 22], [140, 0]),
                width: W,
                height: H,
                clipPath: `inset(${tw(f, [s, s + 18], [100, 0])}% 0 0 0)`,
              }}
            >
              <Rec name={`family-${name}`} style={{ width: W, height: H }} />
            </div>
          );
        })}
      </Cam>
    </AbsoluteFill>
  );
};

// Brands: "14 casas" counts up while the store's 14 houses run past a reading line, slowing to a stop.
const ROW = 92;
export const Brands: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(useCount(14, 6, 30));
  const offset = tw(f, [0, 62], [0, (BRANDS.length - 1) * ROW], EASE_OUT);
  const centre = 540;
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <div style={{ position: "absolute", left: 200, top: 250 }}>
        <div style={font(380, 600, { color: C.pine, fontVariantNumeric: "tabular-nums", opacity: tw(f, [4, 12], [0, 1]) })}>{n}</div>
        <Words text="casas de perfumería," at={14} stagger={3} style={font(52, 500, { color: C.ink, marginTop: 10 })} />
        <Words text="de París a Nueva York." at={20} stagger={3} style={font(52, 500, { color: C.inkSoft })} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1010,
          top: centre - 1,
          width: 760,
          height: 1.5,
          background: C.line,
          scale: `${tw(f, [0, 16], [0, 1], EASE_IN_OUT)} 1`,
          transformOrigin: "left",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1010,
          top: 0,
          width: 800,
          height: 1080,
          WebkitMaskImage: "linear-gradient(transparent 8%, #000 38%, #000 62%, transparent 92%)",
          maskImage: "linear-gradient(transparent 8%, #000 38%, #000 62%, transparent 92%)",
        }}
      >
        {BRANDS.map((b, i) => {
          const mid = centre + i * ROW - offset; // vertical centre of this row
          const d = Math.min(1, Math.abs(mid - centre) / (ROW * 2));
          return (
            <div
              key={b}
              style={font(66, 600, {
                position: "absolute",
                top: mid - ROW / 2 - 12,
                left: 0,
                color: d < 0.3 ? C.ink : C.inkSoft,
                opacity: 1 - d * 0.6,
                whiteSpace: "nowrap",
              })}
            >
              {b}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
// Search: the camera sits on the real search field (clamped to the page top, so logo and hero frame it) while "vainilla" is typed, then snaps out to the results.
export const Search: React.FC = () => {
  const f = useCurrentFrame();
  const sx = L.searchInput.x + L.searchInput.w / 2,
    sy = L.searchInput.y + L.searchInput.h / 2;
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Cam
        zoom={keys(f, [
          [0, 2.2],
          [46, 2.36],
          [58, 1.02],
          [90, 1.06],
        ])}
        cx={keys(f, [
          [0, sx - 40],
          [46, sx - 40],
          [58, 960],
        ])}
        cy={keys(f, [
          [0, sy],
          [46, sy],
          [58, 540],
          [90, 520],
        ])}
      >
        <ClipHold name="search-vainilla" length={123} />
      </Cam>
    </AbsoluteFill>
  );
};

// Filter: one click on "$100 a $150" re-cuts the catalogue (23 → 8 perfumes), then the camera dives into
// The One's photo — the match-zoom into the product chapter.
export const Filter: React.FC = () => {
  const f = useCurrentFrame();
  const card = L.filterCards[0];
  const ix = card.x + card.w / 2,
    iy = card.y + card.h / 2;
  const link = L.filterLink;
  return (
    <AbsoluteFill style={{ background: C.ground }}>
      <Cam
        zoom={keys(
          f,
          [
            [0, 1.75],
            [30, 1.75],
            [46, 1.2],
            [56, 1.2],
            [72, 3.15],
          ],
          EASE_IN_OUT,
        )}
        cx={keys(f, [
          [0, 560],
          [30, 560],
          [46, 900],
          [56, ix],
          [72, ix],
        ])}
        cy={keys(f, [
          [0, 300],
          [30, 300],
          [46, 520],
          [56, iy],
          [72, iy],
        ])}
      >
        <ClipHold name="filter-price" length={46} />
        <Tap x={link.x + 12} y={link.y + link.h / 2} at={14} />
      </Cam>
      {/* the last frames dissolve into the product chapter (see ProductHero) */}
      <AbsoluteFill style={{ background: C.sage, opacity: tw(f, [60, 72], [0, 0.35], EASE_IN) }} />
    </AbsoluteFill>
  );
};
