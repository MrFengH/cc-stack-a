import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { font, Words } from "../components/primitives";
import { NOTES } from "../data/facts";
import { BEAT, C, EASE_IN, EASE_IN_OUT, tw } from "../theme";

// The pyramid from the product page, rebuilt as type: three notes land on the motif's three beats.
// Then Corazón and Fondo step back and Salida grows into the first chapter title.
const COL_W = 560;
const LEFT0 = (1920 - COL_W * 3) / 2;

export const Overture: React.FC = () => {
  const f = useCurrentFrame();
  const settle = tw(f, [104, 150], [0, 1], EASE_IN_OUT); // Salida travels to its chapter position
  const others = (i: number) => tw(f, [96 + i * 4, 120 + i * 4], [0, 1], EASE_IN);
  const rule = (i: number) => tw(f, [8 + i * 6, 40 + i * 6], [0, 1]) * (1 - tw(f, [92, 116], [0, 1], EASE_IN));

  return (
    <AbsoluteFill style={{ background: C.ground }}>
      {[1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: LEFT0 + COL_W * i - 50,
            top: 540 - 150,
            width: 1.5,
            height: 300,
            background: C.line,
            scale: `1 ${rule(i)}`,
            transformOrigin: "top",
          }}
        />
      ))}
      {NOTES.map((n, i) => {
        const at = BEAT * (i + 1) - 6;
        const isSalida = i === 0;
        const x = LEFT0 + COL_W * i + (isSalida ? tw(f, [104, 150], [0, 200 - LEFT0], EASE_IN_OUT) : 0);
        const y = 540 - 90 + (isSalida ? settle * -220 : others(i) * 60);
        return (
          <div
            key={n.name}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: isSalida ? 1 : 1 - others(i),
              transformOrigin: "0 0",
              scale: String(1 + settle * (isSalida ? 1.15 : 0)),
            }}
          >
            <Words text={n.name} at={at} style={font(116, 600, { color: C.ink })} />
            <Words text={n.when} at={at + 6} stagger={2} style={font(32, 400, { color: C.inkSoft, marginTop: 18, letterSpacing: "0" })} />
          </div>
        );
      })}
      {/* the verb of the chapter, spoken by the VO: "La salida: descubrir." */}
      <div style={{ position: "absolute", left: 200, top: 690 }}>
        <Words text="descubrir." at={176} style={font(150, 500, { color: C.pine })} />
      </div>
    </AbsoluteFill>
  );
};
