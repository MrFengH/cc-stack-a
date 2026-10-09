import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame, Video } from "remotion";
import { ContextSwitchTransition, SectionKicker } from "./editorial/EditorialOverlays";

export const SceneTracking: React.FC = () => {
  const frame = useCurrentFrame();

  // Entrada: Settle desde Checkout (frames 0 a 16)
  const enterScale = interpolate(frame, [0, 16], [0.96, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const enterOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Salida: CAMBIO DE CONTEXTO (CLIENTE -> NEGOCIO) en frames 216 a 240
  const contextProgress = interpolate(frame, [216, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const exitOpacity = interpolate(frame, [234, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Movimiento guiado vertical acompañando el timeline
  const scale = interpolate(frame, [0, 90, 240], [1.0, 1.04, 1.06], {
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
        transform: `scale(${enterScale})`,
        opacity: enterOpacity * exitOpacity,
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: "48% 50%",
          transform: `scale(${scale})`,
        }}
      >
        <Video
          src={staticFile("recordings/07-cuenta-tracking.webm")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Rótulo Editorial Mínimo */}
      <SectionKicker
        title="Seguimiento en Vivo"
        subtitle="Línea de tiempo de despacho e historial completo"
        position="top-left"
        startFrame={10}
        durationInFrames={65}
      />

      {/* Transición Monumental de Contexto: CLIENTE → NEGOCIO */}
      <ContextSwitchTransition progress={contextProgress} />
    </div>
  );
};
