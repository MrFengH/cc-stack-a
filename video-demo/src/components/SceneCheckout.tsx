import React from "react";
import {
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { HeaderCallout, PillHighlight } from "./Overlays";

export const SceneCheckout: React.FC = () => {
  const frame = useCurrentFrame();

  // Smooth cinematic pan from shipping address down to local payment methods
  const translateY = interpolate(
    frame,
    [0, 100, 200, 270],
    [0, -25, -60, -60],
    {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateRight: "clamp",
    }
  );

  const scale = interpolate(frame, [0, 150, 270], [1.02, 1.08, 1.08], {
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
          transformOrigin: "45% 60%",
          transform: `scale(${scale}) translateY(${translateY}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/06-checkout-pagos.webm")}
          trimBefore={15}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <HeaderCallout
        category="Experiencia Hiperlocal"
        title="Checkout Local"
        subtitle="Cobertura en Panamá, retiro en 4 horas y medios de pago nacionales"
        position="top-right"
        startFrame={8}
        durationInFrames={230}
      />

      {/* Store pickup highlight */}
      <PillHighlight
        label="Retiro en tienda · Listo en 4 horas"
        x={360}
        y={460}
        startFrame={45}
        durationInFrames={80}
        accentColor="#a855f7"
      />

      {/* Yappy payment highlight */}
      <PillHighlight
        label="Yappy Panamá · Solicitud directa al móvil"
        x={360}
        y={610}
        startFrame={120}
        durationInFrames={110}
        accentColor="#06b6d4"
      />
    </div>
  );
};
