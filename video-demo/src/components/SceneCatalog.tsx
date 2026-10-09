import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame, Video } from "remotion";
import { SectionKicker } from "./editorial/EditorialOverlays";

export const SceneCatalog: React.FC = () => {
  const frame = useCurrentFrame();

  // Entrada: Slide lateral desde Escena 02 (frames 0 a 16)
  const enterX = interpolate(frame, [0, 16], [110, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const enterOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Movimiento de cámara interna: Causa → Efecto
  // 1. Frames 0-65: Foco en filtro lateral izquierdo (Dolce & Gabbana)
  // 2. Frames 65-180: Pan hacia la grilla de productos y settle
  // 3. Frames 224-240: MATCH ZOOM hacia la tarjeta del perfume "The One"
  const isMatchZoom = frame >= 222;

  const normalScale = interpolate(frame, [0, 60, 140], [1.0, 1.16, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  });

  const matchZoomScale = interpolate(frame, [222, 240], [1.08, 1.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const currentScale = isMatchZoom ? matchZoomScale : normalScale;

  const panX = interpolate(frame, [50, 110], [50, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });

  const exitOpacity = interpolate(frame, [234, 240], [1, 0], {
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
        transform: `translateX(${enterX}px)`,
        opacity: enterOpacity * exitOpacity,
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: isMatchZoom ? "42% 46%" : "28% 45%",
          transform: `scale(${currentScale}) translateX(${isMatchZoom ? 0 : panX}px)`,
        }}
      >
        <Video
          src={staticFile("recordings/03-catalogo-filtros.webm")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Rótulo Editorial (2s) */}
      <SectionKicker
        title="Catálogo Preciso"
        subtitle="Filtrado reactivo por facetas y notas"
        position="top-left"
        startFrame={10}
        durationInFrames={65}
      />
    </div>
  );
};
