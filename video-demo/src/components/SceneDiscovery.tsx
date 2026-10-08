import React from "react";
import {
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { HeaderCallout, PillHighlight } from "./Overlays";

export const SceneDiscovery: React.FC = () => {
  const frame = useCurrentFrame();

  // Progressive zoom towards olfactory cards: 1.0 -> 1.12
  const scale = interpolate(frame, [0, 160], [1.0, 1.12], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [0, 160], [0, -35], {
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
          transform: `scale(${scale}) translateY(${translateY}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/02-descubrimiento-familias.webm")}
          trimBefore={10}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <HeaderCallout
        category="Experiencia Olfativa"
        title="Descubrimiento Sensorial"
        subtitle="Encuentra tu fragancia ideal guiado por acordes y familias"
        position="top-left"
        startFrame={8}
        durationInFrames={200}
      />

      <PillHighlight
        label="Familia Gourmand · Vainilla & Praliné"
        x={1260}
        y={480}
        startFrame={45}
        durationInFrames={120}
        accentColor="#d4af37"
      />
    </div>
  );
};
