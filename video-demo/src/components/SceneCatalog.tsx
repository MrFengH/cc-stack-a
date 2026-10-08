import React from "react";
import {
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { HeaderCallout, PillHighlight } from "./Overlays";

export const SceneCatalog: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1: Zoom towards sidebar filters (frames 0 to 90)
  // Phase 2: Pan smoothly towards product results as they update (frames 90 to 240)
  const scale = interpolate(
    frame,
    [0, 80, 130, 240],
    [1.0, 1.15, 1.15, 1.08],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateRight: "clamp",
    }
  );

  const originX = interpolate(
    frame,
    [0, 80, 120, 200],
    [50, 25, 25, 65],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateRight: "clamp",
    }
  );

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
          transformOrigin: `${originX}% 40%`,
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/03-catalogo-filtros.webm")}
          trimBefore={15}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <HeaderCallout
        category="Catálogo Especializado"
        title="Catálogo Preciso"
        subtitle="Filtrado en tiempo real por diseñador, notas y concentración"
        position="top-right"
        startFrame={8}
        durationInFrames={200}
      />

      {/* Highlight on Brand Selection */}
      <PillHighlight
        label="Dolce & Gabbana · 2 Fragancias"
        x={360}
        y={420}
        startFrame={25}
        durationInFrames={80}
        accentColor="#d4af37"
      />

      {/* Highlight on Product Result */}
      <PillHighlight
        label="The One · Eau de Parfum"
        x={980}
        y={540}
        startFrame={125}
        durationInFrames={95}
        accentColor="#4ade80"
      />
    </div>
  );
};
