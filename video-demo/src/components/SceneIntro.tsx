import React from "react";
import {
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { HeaderCallout } from "./Overlays";

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle progressive zoom: 1.00x -> 1.05x
  const scale = interpolate(frame, [0, 240], [1.0, 1.05], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
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
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          transformOrigin: "50% 40%",
          transform: `scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={staticFile("recordings/01-intro-home.webm")}
          trimBefore={0}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <HeaderCallout
        category="Showcase Oficial"
        title="Nota Alta"
        subtitle="Perfumería digital de autor en Panamá"
        badge="Demo 2026"
        position="top-left"
        startFrame={10}
        durationInFrames={190}
      />
    </div>
  );
};
