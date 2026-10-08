import React from "react";
import {
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { HeaderCallout, PillHighlight } from "./Overlays";

export const SceneTracking: React.FC = () => {
  const frame = useCurrentFrame();

  // Crop / zoom in towards the order tracking stepper
  const scale = interpolate(frame, [0, 90, 240], [1.02, 1.14, 1.14], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  const translateY = interpolate(frame, [0, 90, 240], [0, -30, -30], {
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
          transformOrigin: "42% 52%",
          transform: `scale(${scale}) translateY(${translateY}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/07-cuenta-tracking.webm")}
          trimBefore={10}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <HeaderCallout
        category="Autoservicio & Transparencia"
        title="Trazabilidad de Pedidos"
        subtitle="Control total post-compra con línea de tiempo en tiempo real"
        position="top-right"
        startFrame={8}
        durationInFrames={200}
      />

      <PillHighlight
        label="Etapa actual: En preparación"
        x={380}
        y={490}
        startFrame={80}
        durationInFrames={120}
        accentColor="#eab308"
      />
    </div>
  );
};
