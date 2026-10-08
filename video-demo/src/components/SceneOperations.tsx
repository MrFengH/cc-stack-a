import React from "react";
import {
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { HeaderCallout, PillHighlight } from "./Overlays";

export const SceneOperations: React.FC = () => {
  const frame = useCurrentFrame();

  // Part 1: Pedidos (frames 0 to 135)
  // Part 2: Inventario (frames 135 to 270)
  const isPart1 = frame < 135;

  const part1Scale = interpolate(frame, [0, 135], [1.02, 1.10], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  const part2Scale = interpolate(frame, [135, 270], [1.02, 1.14], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  // Crossfade between Part 1 and Part 2 (frames 130 to 142)
  const part2Opacity = interpolate(frame, [130, 142], [0, 1], {
    extrapolateLeft: "clamp",
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
      {/* Layer 1: Pedidos */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 45%",
          transform: `scale(${part1Scale})`,
          opacity: 1 - part2Opacity,
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/09a-panel-pedidos.webm")}
          trimBefore={10}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Layer 2: Inventario */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "60% 50%",
          transform: `scale(${part2Scale})`,
          opacity: part2Opacity,
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/09b-panel-inventario.webm")}
          trimBefore={10}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <HeaderCallout
        category="Gestión Operativa"
        title="Operación Ágil"
        subtitle={
          isPart1
            ? "Pipeline de pedidos clasificado por estado en tiempo real"
            : "Control y ajuste de stock inline directo desde la tabla"
        }
        position="top-right"
        startFrame={8}
        durationInFrames={230}
      />

      {/* Highlight on Orders filter */}
      <PillHighlight
        label="Pipeline de Pedidos · Filtrado por Estado"
        x={360}
        y={280}
        startFrame={30}
        durationInFrames={90}
        accentColor="#38bdf8"
      />

      {/* Highlight on Inventory inline adjuster */}
      <PillHighlight
        label="Ajuste inmediato de unidades sin recargar"
        x={1120}
        y={540}
        startFrame={150}
        durationInFrames={100}
        accentColor="#f59e0b"
      />
    </div>
  );
};
