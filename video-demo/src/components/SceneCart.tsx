import React from "react";
import {
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { HeaderCallout, PillHighlight } from "./Overlays";

export const SceneCart: React.FC = () => {
  const frame = useCurrentFrame();

  // Smooth zoom towards the coupon and summary box on the right:
  // Starts wide (1.0x) -> zooms in to summary box (1.18x) -> slight micro-hold -> stabilizes
  const scale = interpolate(
    frame,
    [0, 60, 130, 170, 240],
    [1.0, 1.18, 1.18, 1.15, 1.15],
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
          transformOrigin: "78% 48%",
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/05-carrito-cupon.webm")}
          trimBefore={10}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <HeaderCallout
        category="Conversión Fluida"
        title="Cupones en Tiempo Real"
        subtitle="Validación inmediata de códigos y recálculo automático del total"
        position="top-left"
        startFrame={8}
        durationInFrames={200}
      />

      {/* Typing indicator highlight */}
      <PillHighlight
        label="Aplicando cupón: DG10"
        x={1220}
        y={490}
        startFrame={40}
        durationInFrames={65}
        accentColor="#38bdf8"
      />

      {/* Discount confirmed highlight (micro-hold moment) */}
      <PillHighlight
        label="Descuento aplicado: -$11.90 (10% extra)"
        x={1160}
        y={360}
        startFrame={125}
        durationInFrames={95}
        accentColor="#4ade80"
      />
    </div>
  );
};
