import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface HeaderCalloutProps {
  category?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  startFrame?: number;
  durationInFrames?: number;
}

export const HeaderCallout: React.FC<HeaderCalloutProps> = ({
  category,
  title,
  subtitle,
  badge,
  position = "top-left",
  startFrame = 5,
  durationInFrames = 200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });

  const exitStart = durationInFrames - 15;
  const exit = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < startFrame || frame > durationInFrames) {
    return null;
  }

  const opacity = Math.min(entrance, exit);
  const translateY = interpolate(entrance, [0, 1], [-20, 0]);

  const posStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 50,
    pointerEvents: "none",
    opacity,
    transform: `translateY(${translateY}px)`,
    ...(position === "top-left" && { top: 60, left: 60 }),
    ...(position === "top-right" && { top: 60, right: 60, alignItems: "flex-end" }),
    ...(position === "bottom-left" && { bottom: 60, left: 60 }),
    ...(position === "bottom-right" && { bottom: 60, right: 60, alignItems: "flex-end" }),
  };

  return (
    <div style={posStyle}>
      <div
        style={{
          background: "rgba(12, 13, 16, 0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(212, 175, 55, 0.35)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.45), 0 0 30px rgba(212, 175, 55, 0.12)",
          borderRadius: 16,
          padding: "18px 26px",
          maxWidth: 520,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {category && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#e5c365",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {category}
            </span>
          )}
          {badge && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#ffffff",
                background: "linear-gradient(135deg, #b8860b, #d4af37)",
                padding: "3px 8px",
                borderRadius: 20,
                letterSpacing: "0.06em",
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            fontFamily: "system-ui, -apple-system, sans-serif",
            lineHeight: 1.15,
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 400,
              color: "#b8bcc8",
              fontFamily: "system-ui, -apple-system, sans-serif",
              lineHeight: 1.35,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export interface PillHighlightProps {
  label: string;
  x: number;
  y: number;
  startFrame: number;
  durationInFrames: number;
  accentColor?: string;
}

export const PillHighlight: React.FC<PillHighlightProps> = ({
  label,
  x,
  y,
  startFrame,
  durationInFrames,
  accentColor = "#d4af37",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 140 },
  });

  const exitStart = startFrame + durationInFrames - 10;
  const exit = interpolate(frame, [exitStart, startFrame + durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < startFrame || frame > startFrame + durationInFrames) {
    return null;
  }

  const opacity = Math.min(enter, exit);
  const scale = interpolate(enter, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale})`,
        opacity,
        zIndex: 60,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(15, 17, 23, 0.92)",
          backdropFilter: "blur(12px)",
          border: `1.5px solid ${accentColor}`,
          boxShadow: `0 8px 24px rgba(0, 0, 0, 0.5), 0 0 16px ${accentColor}44`,
          borderRadius: 24,
          padding: "8px 16px",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: accentColor,
            boxShadow: `0 0 8px ${accentColor}`,
          }}
        />
        <span>{label}</span>
      </div>
    </div>
  );
};
