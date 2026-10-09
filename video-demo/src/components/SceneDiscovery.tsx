import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame, Video } from "remotion";
import { SectionKicker } from "./editorial/EditorialOverlays";

export const SceneDiscovery: React.FC = () => {
  const frame = useCurrentFrame();

  // Entrada: Continuous Push vertical desde Escena 01 (frames 0 a 16)
  const enterY = interpolate(frame, [0, 16], [90, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const enterOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Salida: Slide lateral continuo hacia el catálogo (frames 224 a 240)
  const exitX = interpolate(frame, [224, 240], [0, -110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const exitOpacity = interpolate(frame, [230, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dinámica de cámara interna:
  // Punch-in hacia las tarjetas olfativas mientras ocurre el hover
  const scale = interpolate(frame, [20, 100, 210], [1.0, 1.08, 1.11], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 1, 0.5, 1),
  });

  const panX = interpolate(frame, [50, 150], [0, -35], {
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
        transform: `translate(${exitX}px, ${enterY}px)`,
        opacity: enterOpacity * exitOpacity,
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: "45% 60%",
          transform: `scale(${scale}) translate(${panX}px, 0px)`,
        }}
      >
        <Video
          src={staticFile("recordings/02-descubrimiento-familias.webm")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Rótulo Editorial Mínimo (2s) */}
      <SectionKicker
        title="Familias Olfativas"
        subtitle="Exploración por emoción y acordes de autor"
        position="top-left"
        startFrame={15}
        durationInFrames={65}
      />
    </div>
  );
};
