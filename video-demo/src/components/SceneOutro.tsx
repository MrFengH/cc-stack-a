import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame, Video } from "remotion";
import { EditorialOutro } from "./editorial/EditorialOverlays";

export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();

  // Entrada con escala elegante (frames 0 a 24)
  const enterScale = interpolate(frame, [0, 24], [0.94, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const enterOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out final cinematográfico a negro (últimos 30 frames: 190 a 220)
  const masterFadeOut = interpolate(frame, [190, 220], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Movimiento sutil de cámara
  const bgScale = interpolate(frame, [0, 220], [1.02, 1.05]);

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#060709",
        transform: `scale(${enterScale})`,
        opacity: enterOpacity * masterFadeOut,
      }}
    >
      {/* Video de fondo enmarcado con viñeteado cinematográfico */}
      <div
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: "50% 45%",
          transform: `scale(${bgScale})`,
          filter: "brightness(0.65) contrast(1.08)",
        }}
      >
        <Video
          src={staticFile("recordings/01-intro-home.webm")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Viñeta cinematográfica */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          background:
            "radial-gradient(circle at center, transparent 35%, rgba(6, 7, 9, 0.85) 90%)",
          pointerEvents: "none",
        }}
      />

      {/* Cierre Editorial de Marca */}
      <EditorialOutro startFrame={20} />
    </div>
  );
};
