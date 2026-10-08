import React from "react";
import {
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { HeaderCallout, PillHighlight } from "./Overlays";

export const ScenePanel: React.FC = () => {
  const frame = useCurrentFrame();

  // Short crossfade for perspective switch (frames 0 to 18)
  const entryOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Scale: zoom in on KPIs, then smoothly reframe for sales chart
  const scale = interpolate(
    frame,
    [0, 80, 160, 270],
    [1.0, 1.12, 1.10, 1.08],
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
        opacity: entryOpacity,
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: "48% 40%",
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/08-panel-metricas.webm")}
          trimBefore={10}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <HeaderCallout
        category="Centro de Operaciones"
        title="Panel de Control"
        subtitle="Analítica comercial consolidada y estado del negocio en vivo"
        position="top-left"
        startFrame={10}
        durationInFrames={230}
      />

      {/* KPI highlight */}
      <PillHighlight
        label="$10,560.50 · 54 Pedidos Procesados"
        x={360}
        y={280}
        startFrame={30}
        durationInFrames={80}
        accentColor="#d4af37"
      />

      {/* Sales Growth highlight */}
      <PillHighlight
        label="+112.7% Crecimiento últimos 30 días"
        x={720}
        y={490}
        startFrame={110}
        durationInFrames={120}
        accentColor="#22c55e"
      />
    </div>
  );
};
