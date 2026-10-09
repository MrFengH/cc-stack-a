import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Editorial Hero Title para Escena 01 (Intro)
 * Tipografía pura de gran impacto sin cajas ni bordes glassmorphic.
 */
export const EditorialHeroTitle: React.FC<{
  startFrame?: number;
  durationInFrames?: number;
}> = ({ startFrame = 0, durationInFrames = 80 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > startFrame + durationInFrames) {
    return null;
  }

  const localFrame = frame - startFrame;

  // Entrada con spring suave
  const titleEntrance = spring({
    frame: localFrame,
    fps,
    config: { damping: 16, mass: 0.8, stiffness: 100 },
  });

  // Salida rápida y limpia hacia el Home (últimos 16 frames)
  const exitProgress = interpolate(
    localFrame,
    [durationInFrames - 16, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.2, 1) }
  );

  const opacity = (1 - exitProgress) * interpolate(titleEntrance, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(titleEntrance, [0, 1], [40, 0]) - exitProgress * 25;
  const scale = interpolate(localFrame, [0, durationInFrames], [0.98, 1.03]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1920,
        height: 1080,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 40,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 82,
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 10px 40px rgba(0,0,0,0.8)",
            lineHeight: 1.1,
          }}
        >
          Nota Alta
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 24,
            fontWeight: 400,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.82)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            textShadow: "0 4px 20px rgba(0,0,0,0.7)",
          }}
        >
          Perfumería digital en Panamá
        </div>
      </div>
    </div>
  );
};

/**
 * Section Kicker: Rótulo tipográfico efímero de alta gama (aparece 1.5-2s)
 * Sin cajas oscuras, alineado limpiamente con los márgenes.
 */
export const SectionKicker: React.FC<{
  title: string;
  subtitle?: string;
  theme?: "light" | "dark";
  startFrame?: number;
  durationInFrames?: number;
  position?: "top-left" | "top-right" | "bottom-left";
}> = ({
  title,
  subtitle,
  theme = "light",
  startFrame = 10,
  durationInFrames = 70,
  position = "top-left",
}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame || frame > startFrame + durationInFrames) {
    return null;
  }

  const localFrame = frame - startFrame;

  // Entrada con clip-path horizontal o fade
  const enter = interpolate(localFrame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const exit = interpolate(localFrame, [durationInFrames - 14, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  const opacity = Math.min(enter, exit);
  const translateX = interpolate(enter, [0, 1], [-20, 0]);

  const textColor = theme === "dark" ? "#ffffff" : "#111827";
  const subColor = theme === "dark" ? "rgba(255,255,255,0.65)" : "#4b5563";

  const posStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 40,
    pointerEvents: "none",
    opacity,
    transform: `translateX(${translateX}px)`,
    ...(position === "top-left" && { top: 60, left: 70 }),
    ...(position === "top-right" && { top: 60, right: 70, textAlign: "right" }),
    ...(position === "bottom-left" && { bottom: 60, left: 70 }),
  };

  return (
    <div style={posStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          ...(position === "top-right" && { justifyContent: "flex-end" }),
        }}
      >
        <div
          style={{
            width: 4,
            height: 28,
            backgroundColor: "#d97706",
            borderRadius: 2,
          }}
        />
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: textColor,
              fontFamily: "system-ui, -apple-system, sans-serif",
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.04em",
                color: subColor,
                fontFamily: "system-ui, -apple-system, sans-serif",
                marginTop: 2,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * PyramidEditorial: Presentación visual de las 3 etapas olfativas para Escena 04
 * Líneas limpias, tipografía estructurada y tiempos de evolución.
 */
export const PyramidEditorial: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 40 }) => {
  const frame = useCurrentFrame();

  const notes = [
    {
      stage: "SALIDA",
      time: "15 MIN",
      desc: "Melocotón, lichi & bergamota",
      color: "#f59e0b",
      appearAt: startFrame,
    },
    {
      stage: "CORAZÓN",
      time: "30 MIN — 3 H",
      desc: "Lirio, jazmín & ciruela",
      color: "#ec4899",
      appearAt: startFrame + 40,
    },
    {
      stage: "FONDO",
      time: "TODO EL DÍA",
      desc: "Vainilla, ámbar & vetiver",
      color: "#8b5cf6",
      appearAt: startFrame + 80,
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 140,
        right: 80,
        zIndex: 40,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {notes.map((note) => {
        if (frame < note.appearAt) return null;
        const progress = interpolate(frame, [note.appearAt, note.appearAt + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        return (
          <div
            key={note.stage}
            style={{
              opacity: progress,
              transform: `translateX(${interpolate(progress, [0, 1], [30, 0])}px)`,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: note.color,
                boxShadow: `0 0 14px ${note.color}`,
              }}
            />
            <div
              style={{
                background: "rgba(255, 255, 255, 0.94)",
                padding: "8px 16px",
                borderRadius: 8,
                boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", color: "#111827" }}>
                  {note.stage}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: note.color, letterSpacing: "0.04em" }}>
                  {note.time}
                </span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#4b5563", marginTop: 2 }}>
                {note.desc}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * PriceSavingsMotion: Motion graphic numérico para Escena 05 (Carrito)
 * Cifras directas con tachado animado y confirmación del ahorro.
 */
export const PriceSavingsMotion: React.FC<{
  applyFrame?: number;
}> = ({ applyFrame = 75 }) => {
  const frame = useCurrentFrame();

  if (frame < applyFrame - 10) return null;

  const isApplied = frame >= applyFrame;
  const animProgress = interpolate(frame, [applyFrame, applyFrame + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 220,
        right: 140,
        zIndex: 40,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <span
          style={{
            fontSize: isApplied ? 22 : 32,
            fontWeight: 700,
            color: isApplied ? "#9ca3af" : "#111827",
            textDecoration: isApplied ? "line-through" : "none",
          }}
        >
          $119.00
        </span>
        {isApplied && (
          <span
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#059669",
              opacity: animProgress,
              transform: `scale(${interpolate(animProgress, [0, 1], [0.8, 1])})`,
            }}
          >
            $107.10
          </span>
        )}
      </div>

      {isApplied && (
        <div
          style={{
            opacity: animProgress,
            transform: `translateY(${interpolate(animProgress, [0, 1], [8, 0])}px)`,
            background: "#ecfdf5",
            color: "#047857",
            padding: "5px 12px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.06em",
            border: "1px solid #a7f3d0",
          }}
        >
          AHORRO INMEDIATO: -$11.90 (10%)
        </div>
      )}
    </div>
  );
};

/**
 * CheckoutStepIndicator: Tres fases de checkout para Escena 06
 * 01 ENTREGA · 02 RETIRO · 03 PAGO LOCAL
 */
export const CheckoutStepIndicator: React.FC<{
  currentStep?: 1 | 2 | 3;
}> = ({ currentStep = 3 }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const steps = [
    { num: "01", label: "ENTREGA" },
    { num: "02", label: "RETIRO EXPRESS" },
    { num: "03", label: "PAGO LOCAL (YAPPY)" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 0,
        width: 1920,
        display: "flex",
        justifyContent: "center",
        zIndex: 40,
        pointerEvents: "none",
        opacity: enter,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          background: "rgba(255, 255, 255, 0.95)",
          padding: "8px 24px",
          borderRadius: 30,
          boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {steps.map((st, idx) => {
          const isActive = idx + 1 === currentStep;
          return (
            <div
              key={st.num}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: isActive ? 1 : 0.45,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: isActive ? "#047857" : "#6b7280",
                }}
              >
                {st.num}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: isActive ? "#111827" : "#6b7280",
                }}
              >
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * ContextSwitchTransition: Transición monumental CLIENTE → NEGOCIO (Escena 07 -> 08)
 * Wipe dinámico con división visual nítida.
 */
export const ContextSwitchTransition: React.FC<{
  progress: number; // 0 a 1
}> = ({ progress }) => {
  if (progress <= 0 || progress >= 1) return null;

  const clipLeft = interpolate(progress, [0, 1], [100, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1920,
        height: 1080,
        zIndex: 90,
        pointerEvents: "none",
        backgroundColor: "#0d0f12",
        clipPath: `polygon(${clipLeft}% 0, 100% 0, 100% 100%, ${Math.max(0, clipLeft - 10)}% 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.24em", color: "#d97706" }}>
          CAMBIO DE PERSPECTIVA
        </div>
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "0.14em", marginTop: 8 }}>
          GESTIÓN DEL NEGOCIO
        </div>
      </div>
    </div>
  );
};

/**
 * EditorialOutro: Cierre tipográfico de marca para Escena 10
 */
export const EditorialOutro: React.FC<{
  startFrame?: number;
}> = ({ startFrame = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame) return null;

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 16, mass: 0.8, stiffness: 90 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1920,
        height: 1080,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
        pointerEvents: "none",
        opacity: entrance,
        transform: `scale(${interpolate(entrance, [0, 1], [0.94, 1.0])})`,
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "rgba(10, 12, 16, 0.72)",
          backdropFilter: "blur(20px)",
          padding: "48px 80px",
          borderRadius: 24,
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div
          style={{
            fontSize: 74,
            fontWeight: 800,
            letterSpacing: "0.20em",
            textTransform: "uppercase",
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
            lineHeight: 1.1,
          }}
        >
          Nota Alta
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: "0.10em",
            color: "rgba(255, 255, 255, 0.85)",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          Perfumería digital, de principio a fin.
        </div>
      </div>
    </div>
  );
};
