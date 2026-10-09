import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame, Video } from "remotion";
import { EditorialHeroTitle } from "./editorial/EditorialOverlays";

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // Apertura de alto impacto:
  // Frames 0-70: Hero editorial monumental con máscara
  // Frames 70-240: Reveal de la plataforma completa y scroll continuo ultra fluido
  const maskProgress = interpolate(frame, [45, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Scale y movimiento del video
  // Comienza con punch sutil (1.06x) y se expande suavemente
  const videoScale = interpolate(frame, [0, 80, 240], [1.06, 1.02, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });

  // Transición de salida hacia Escena 02 (Push vertical continuo en frames 226-240)
  const exitSlideY = interpolate(frame, [226, 240], [0, -90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const exitOpacity = interpolate(frame, [232, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background spotlight/glow editorial sutil
  const bgBrightness = interpolate(maskProgress, [0, 1], [0.35, 1]);

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#08090c",
      }}
    >
      {/* 1. Capa de Video con máscara de expansión */}
      <div
        style={{
          width: 1920,
          height: 1080,
          position: "absolute",
          top: 0,
          left: 0,
          transform: `translateY(${exitSlideY}px) scale(${videoScale})`,
          opacity: exitOpacity,
          filter: `brightness(${bgBrightness})`,
        }}
      >
        <Video
          src={staticFile("recordings/01-intro-home.webm")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* 2. Titular Editorial Hero (desaparece limpiamente tras el impacto inicial) */}
      <EditorialHeroTitle startFrame={0} durationInFrames={75} />
    </div>
  );
};
