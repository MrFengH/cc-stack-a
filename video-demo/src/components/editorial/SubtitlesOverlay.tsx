import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import subtitlesData from "../../data/subtitles.json";

export interface SubtitleCue {
  id: number;
  scene: string;
  startFrame: number;
  endFrame: number;
  text: string;
}

export interface SubtitlesOverlayProps {
  /** Permitir ocultar o forzar subtítulos */
  enabled?: boolean;
}

/**
 * SubtitlesOverlay: Presentación editorial de subtítulos sincronizados.
 *
 * Muestra el texto de la locución en una cápsula translúcida elegante
 * con efecto blur y micro-animación de entrada/salida (4 frames),
 * ubicada en la parte inferior central sin interferir con las métricas
 * ni los badges de cabecera de las escenas.
 */
export const SubtitlesOverlay: React.FC<SubtitlesOverlayProps> = ({
  enabled = true,
}) => {
  const frame = useCurrentFrame();

  if (!enabled) {
    return null;
  }

  // Buscar el cue activo para el frame actual
  const currentCue = (subtitlesData as SubtitleCue[]).find(
    (cue) => frame >= cue.startFrame && frame <= cue.endFrame
  );

  if (!currentCue) {
    return null;
  }

  // Fade suave de entrada (primeros 4 frames) y salida (últimos 4 frames)
  const fadeIn = interpolate(
    frame,
    [currentCue.startFrame, currentCue.startFrame + 4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const fadeOut = interpolate(
    frame,
    [currentCue.endFrame - 4, currentCue.endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = Math.min(fadeIn, fadeOut);
  const translateY = interpolate(fadeIn, [0, 1], [6, 0]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 46,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 55,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          backgroundColor: "rgba(8, 10, 14, 0.82)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 9999,
          padding: "10px 30px",
          maxWidth: 1120,
          boxShadow:
            "0 10px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Micro indicador ámbar editorial */}
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "#d97706",
            boxShadow: "0 0 8px rgba(217, 119, 6, 0.8)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: 24,
            fontWeight: 500,
            lineHeight: 1.35,
            letterSpacing: "-0.015em",
            color: "#FFFFFF",
            textAlign: "center",
            textShadow: "0 2px 6px rgba(0, 0, 0, 0.6)",
          }}
        >
          {currentCue.text}
        </span>
      </div>
    </div>
  );
};
