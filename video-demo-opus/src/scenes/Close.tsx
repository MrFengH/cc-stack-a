import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { font, Words } from "../components/primitives";
import { C, EASE_IN_OUT, tw } from "../theme";

// The close lands on the bell ("la nota alta"): the three rules of the pyramid draw together under the
// wordmark, then the line the VO speaks, then the sign-off.
export const Close: React.FC = () => {
  const f = useCurrentFrame();
  const join = tw(f, [8, 40], [0, 1], EASE_IN_OUT);
  return (
    <AbsoluteFill style={{ background: C.pineDeep, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          translate: `0 ${tw(f, [0, 60], [24, 0])}px`,
          scale: String(tw(f, [0, 216], [1, 1.045], (t) => t)),
        }}
      >
        <Words text="Nota Alta" at={0} stagger={6} dur={22} style={font(230, 600, { color: C.ground, justifyContent: "center" })} />
        <div style={{ position: "relative", width: 900, height: 2, marginTop: 44 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 0,
                height: 2,
                background: C.onPineSoft,
                opacity: 0.6,
                left: `${i * 35 * (1 - join)}%`,
                width: `${30 + 70 * join}%`,
                scale: `${tw(f, [2 + i * 4, 16 + i * 4], [0, 1])} 1`,
                transformOrigin: "left",
              }}
            />
          ))}
        </div>
        <Words
          text="Perfumería online en Panamá."
          at={72}
          stagger={3}
          style={font(54, 500, { color: C.onPineSoft, marginTop: 44, letterSpacing: "-0.01em", justifyContent: "center" })}
        />
        <Words
          text="De la primera nota a la última."
          at={124}
          stagger={3}
          style={font(36, 400, { color: C.pineTint, marginTop: 22, letterSpacing: 0, opacity: 0.8, justifyContent: "center" })}
        />
      </div>
    </AbsoluteFill>
  );
};
