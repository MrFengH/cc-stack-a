import React from "react";
import {
  Easing,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth zoom out from 1.08x to 1.00x
  const scale = interpolate(frame, [0, 210], [1.08, 1.0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateRight: "clamp",
  });

  // Card entrance
  const cardEnter = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 100 },
  });

  // Final fade out to black (last 25 frames)
  const fadeOut = interpolate(frame, [185, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(cardEnter, [0, 1], [0, 1]);
  const cardScale = interpolate(cardEnter, [0, 1], [0.92, 1]);

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0d0f12",
      }}
    >
      {/* Background Video */}
      <div
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: "50% 40%",
          transform: `scale(${scale})`,
          filter: `brightness(${interpolate(frame, [0, 60], [1, 0.75])})`,
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/01-intro-home.webm")}
          trimBefore={0}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Centered Brand Showcase Card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
        }}
      >
        <div
          style={{
            background: "rgba(10, 12, 16, 0.88)",
            backdropFilter: "blur(24px)",
            border: "1.5px solid rgba(212, 175, 55, 0.4)",
            boxShadow:
              "0 25px 60px rgba(0, 0, 0, 0.6), 0 0 50px rgba(212, 175, 55, 0.2)",
            borderRadius: 24,
            padding: "48px 64px",
            textAlign: "center",
            maxWidth: 760,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 30,
              background: "rgba(212, 175, 55, 0.15)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              color: "#e5c365",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <span>Product Showcase</span>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 54,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              fontFamily: "system-ui, -apple-system, sans-serif",
              lineHeight: 1.1,
            }}
          >
            Nota Alta
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 500,
              color: "#e2e8f0",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "-0.01em",
              lineHeight: 1.35,
            }}
          >
            La experiencia completa de perfumería digital
          </p>

          <div
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 20,
              color: "#94a3b8",
              fontSize: 14,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <span>Envíos 24-48h</span>
            <span>•</span>
            <span>Yappy & ACH</span>
            <span>•</span>
            <span>Ciudad de Panamá</span>
          </div>
        </div>
      </div>

      {/* Final Fade to Black */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000000",
          opacity: fadeOut,
          zIndex: 100,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
