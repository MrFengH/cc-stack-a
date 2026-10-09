import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame, Video } from "remotion";
import { PyramidEditorial, SectionKicker } from "./editorial/EditorialOverlays";

export const SceneProduct: React.FC = () => {
  const frame = useCurrentFrame();

  // Entrada: Match Zoom recibido desde Escena 03 (frames 0 a 18)
  const matchEnterScale = interpolate(frame, [0, 18], [1.28, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const enterOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Salida: Push lateral hacia el carrito (frames 254 a 270)
  const exitSlideX = interpolate(frame, [254, 270], [0, -90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const exitOpacity = interpolate(frame, [262, 270], [1, 0], {
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
        transform: `translateX(${exitSlideX}px)`,
        opacity: enterOpacity * exitOpacity,
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: "35% 42%",
          transform: `scale(${matchEnterScale})`,
        }}
      >
        <Video
          src={staticFile("recordings/04-detalle-producto.webm")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Rótulo Editorial Mínimo */}
      <SectionKicker
        title="Pirámide Olfativa"
        subtitle="Evolución en piel · Stock verificado en tiempo real"
        position="top-left"
        startFrame={8}
        durationInFrames={60}
      />

      {/* Notas Editoriales Estructuradas (sin tarjetas flotantes) */}
      <PyramidEditorial startFrame={45} />
    </div>
  );
};
