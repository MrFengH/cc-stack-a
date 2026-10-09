import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame, Video } from "remotion";
import { SectionKicker } from "./editorial/EditorialOverlays";

export const SceneOperations: React.FC = () => {
  const frame = useCurrentFrame();

  // Entrada: Lateral slide dentro del panel (frames 0 a 16)
  const enterX = interpolate(frame, [0, 16], [90, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const enterOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Salida: Scale down hacia el Outro (frames 236 a 250)
  const exitScale = interpolate(frame, [236, 250], [1.0, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const exitOpacity = interpolate(frame, [242, 250], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // DIVISIÓN RÍTMICA SINCOPADA:
  // Parte A: Pedidos (frames 0 a 125)
  // HARD CUT instantáneo en frame 125
  // Parte B: Inventario (frames 125 a 250)
  const isOrders = frame < 125;

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0d0f12",
        transform: `translateX(${enterX}px) scale(${exitScale})`,
        opacity: enterOpacity * exitOpacity,
      }}
    >
      {isOrders ? (
        <div
          style={{
            width: 1920,
            height: 1080,
            transformOrigin: "42% 40%",
            transform: "scale(1.08)",
          }}
        >
          <Video
            src={staticFile("recordings/09a-panel-pedidos.webm")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ) : (
        <div
          style={{
            width: 1920,
            height: 1080,
            transformOrigin: "52% 48%",
            transform: "scale(1.06)",
          }}
        >
          <Video
            src={staticFile("recordings/09b-panel-inventario.webm")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Rótulo Editorial Dinámico */}
      <SectionKicker
        title={isOrders ? "01 · Gestión de Despachos" : "02 · Inventario en Vivo"}
        subtitle={
          isOrders
            ? "Pipeline de pedidos pagados y preparación inmediata"
            : "Ajuste ágil de existencias directo en la tabla"
        }
        theme="dark"
        position="top-left"
        startFrame={isOrders ? 8 : 128}
        durationInFrames={55}
      />
    </div>
  );
};
