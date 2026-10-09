import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame, Video } from "remotion";
import { PriceSavingsMotion, SectionKicker } from "./editorial/EditorialOverlays";

export const SceneCart: React.FC = () => {
  const frame = useCurrentFrame();

  // Entrada: Lateral push desde Escena 04 (frames 0 a 16)
  const enterX = interpolate(frame, [0, 16], [90, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const enterOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Salida: Push vertical hacia Checkout (frames 226 a 240)
  const exitSlideY = interpolate(frame, [226, 240], [0, -90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const exitOpacity = interpolate(frame, [232, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Movimiento de cámara:
  // Punch-in hacia el bloque de cupón y resumen de precios
  // Micro-hold / settle cuando se aplica el cupón (frame 120-135)
  const isHold = frame >= 120 && frame <= 135;
  const scale = isHold
    ? 1.08
    : interpolate(frame, [0, 115, 140, 240], [1.0, 1.08, 1.09, 1.06], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      });

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0d0f12",
        transform: `translate(${enterX}px, ${exitSlideY}px)`,
        opacity: enterOpacity * exitOpacity,
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: "65% 45%",
          transform: `scale(${scale})`,
        }}
      >
        <Video
          src={staticFile("recordings/05-carrito-cupon.webm")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Rótulo Editorial (2s) */}
      <SectionKicker
        title="Cupones en Tiempo Real"
        subtitle="Validación inmediata y recálculo automático del total"
        position="top-left"
        startFrame={8}
        durationInFrames={60}
      />

      {/* Motion Graphic Numérico de Ahorro Directo */}
      <PriceSavingsMotion applyFrame={124} />
    </div>
  );
};
