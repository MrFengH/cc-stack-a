import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame, Video } from "remotion";
import { SectionKicker } from "./editorial/EditorialOverlays";

export const ScenePanel: React.FC = () => {
  const frame = useCurrentFrame();

  // Entrada: Recepción del cambio de contexto (frames 0 a 18)
  const enterScale = interpolate(frame, [0, 18], [0.95, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const enterOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Salida: Lateral slide dentro del panel hacia Operaciones (frames 264 a 280)
  const exitSlideX = interpolate(frame, [264, 280], [0, -90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const exitOpacity = interpolate(frame, [272, 280], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Secuencia rítmica punch / pan sobre KPIs:
  // 1. Frames 0-60: Punch a facturación ($10,560.50)
  // 2. Frames 60-120: Pan a crecimiento (+112.7%)
  // 3. Frames 120-170: Pan a ticket promedio ($195.56)
  // 4. Frames 170-280: Apertura amplia de cámara a dashboard completo
  let scale = 1.0;
  let originX = "50%";
  let originY = "50%";

  if (frame < 60) {
    scale = interpolate(frame, [0, 20, 60], [1.12, 1.18, 1.18], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    originX = "24%";
    originY = "32%";
  } else if (frame < 120) {
    scale = 1.15;
    originX = interpolate(frame, [60, 75], ["24%", "54%"], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 1, 0.5, 1),
    });
    originY = "40%";
  } else if (frame < 170) {
    scale = 1.12;
    originX = "68%";
    originY = "25%";
  } else {
    // Apertura progresiva al dashboard completo
    scale = interpolate(frame, [170, 220], [1.12, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    originX = "50%";
    originY = "50%";
  }

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0d0f12",
        transform: `translateX(${exitSlideX}px) scale(${enterScale})`,
        opacity: enterOpacity * exitOpacity,
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: `${originX} ${originY}`,
          transform: `scale(${scale})`,
        }}
      >
        <Video
          src={staticFile("recordings/08-panel-metricas.webm")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Rótulo Editorial Tema Oscuro (2s) */}
      <SectionKicker
        title="Panel de Control"
        subtitle="Analítica comercial consolidada y métricas en vivo"
        theme="dark"
        position="top-left"
        startFrame={10}
        durationInFrames={65}
      />
    </div>
  );
};
