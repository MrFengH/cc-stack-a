import React from "react";
import {
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { HeaderCallout, PillHighlight } from "./Overlays";

export const SceneProduct: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle zoom in as scroll reaches the olfactory notes
  const scale = interpolate(frame, [0, 90, 270], [1.0, 1.08, 1.10], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0d0f12",
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: "50% 55%",
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/04-detalle-producto.webm")}
          trimBefore={10}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <HeaderCallout
        category="Ficha Sensorial"
        title="Pirámide Olfativa"
        subtitle="Evolución temporal en piel, stock verificado y cupones de marca"
        position="top-left"
        startFrame={8}
        durationInFrames={230}
      />

      {/* Sequential Notes Highlights */}
      <PillHighlight
        label="1. Salida · Melocotón, lichi & bergamota (15 min)"
        x={640}
        y={460}
        startFrame={55}
        durationInFrames={90}
        accentColor="#f59e0b"
      />

      <PillHighlight
        label="2. Corazón · Lirio, jazmín & ciruela (30 min - 3 h)"
        x={720}
        y={530}
        startFrame={105}
        durationInFrames={85}
        accentColor="#ec4899"
      />

      <PillHighlight
        label="3. Fondo · Vainilla, ámbar & vetiver (Todo el día)"
        x={800}
        y={600}
        startFrame={155}
        durationInFrames={90}
        accentColor="#d4af37"
      />
    </div>
  );
};
