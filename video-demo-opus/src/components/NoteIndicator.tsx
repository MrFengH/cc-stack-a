import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { NOTES } from "../data/facts";
import { C, EASE_IN_OUT, fontFamily, tw } from "../theme";

// Where we are in the pyramid. It surfaces only around each chapter change, where its dot descends
// Salida → Corazón → Fondo, and stays out of the way of the UI shots the rest of the time.
export const CHAPTERS = [144, 576, 1152]; // Salida, Corazón, Fondo start
const WINDOWS = [
  [156, 300],
  [556, 700],
  [1150, 1250],
];

export const NoteIndicator: React.FC = () => {
  const f = useCurrentFrame();
  const [, co, fo] = CHAPTERS;
  const pos = tw(f, [co - 10, co + 10], [0, 1], EASE_IN_OUT) + tw(f, [fo - 10, fo + 10], [0, 1], EASE_IN_OUT);
  const dark = tw(f, [fo, fo + 12], [0, 1]); // light-on-dark once we are in Fondo
  const color = dark > 0.5 ? C.ground : C.ink;
  const opacity = Math.max(
    ...WINDOWS.map(([a, b]) => interpolate(f, [a, a + 12, b - 12, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
  );
  const GAP = 44;
  return (
    <div style={{ position: "absolute", left: 56, top: 540 - GAP, opacity, fontFamily }}>
      <div style={{ position: "absolute", left: 0, top: 6, width: 1.5, height: GAP * 2, background: color, opacity: 0.25 }} />
      <div style={{ position: "absolute", left: -4.25, top: pos * GAP + 2, width: 10, height: 10, borderRadius: 5, background: color }} />
      {NOTES.map((n, i) => (
        <div
          key={n.name}
          style={{
            position: "absolute",
            left: 22,
            top: i * GAP - 4,
            fontSize: 19,
            fontWeight: 500,
            color,
            whiteSpace: "nowrap",
            opacity: 0.35 + 0.65 * Math.max(0, 1 - Math.abs(pos - i)),
          }}
        >
          {n.name}
        </div>
      ))}
    </div>
  );
};
