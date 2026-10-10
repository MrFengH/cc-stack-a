import { Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, EASE_IN_OUT, fontFamily, tw } from "../theme";

// A captured still from public/recordings/stills (element captures are 2x, so they stay sharp when zoomed).
export const Rec: React.FC<{ name: string; ext?: "png" | "jpg"; style?: React.CSSProperties }> = ({ name, ext = "png", style }) => (
  <Img src={staticFile(`recordings/stills/${name}.${ext}`)} style={{ display: "block", ...style }} />
);

// A frame-stepped capture from public/recordings, laid out on the 1920x1080 page grid it was captured on.
export const Clip: React.FC<{ name: string; trimBefore?: number; playbackRate?: number }> = ({ name, trimBefore, playbackRate }) => (
  <Video
    src={staticFile(`recordings/${name}.mp4`)}
    muted
    trimBefore={trimBefore}
    playbackRate={playbackRate}
    style={{ position: "absolute", width: 1920, height: 1080 }}
  />
);

// Clip that freezes on its own last frame (the "-last.jpg" still) once it runs out, so the camera can keep moving.
export const ClipHold: React.FC<{ name: string; length: number; trimBefore?: number; playbackRate?: number }> = ({
  name,
  length,
  trimBefore = 0,
  playbackRate = 1,
}) => {
  // every remaining source frame plays (the last output frame samples < clip duration), then the still takes over
  const playFor = Math.max(1, Math.ceil((length - trimBefore) / playbackRate));
  return (
    <AbsoluteFill>
      <Rec name={`${name}-last`} ext="jpg" style={{ position: "absolute", width: 1920, height: 1080 }} />
      <Sequence durationInFrames={playFor} premountFor={30}>
        <Clip name={name} trimBefore={trimBefore} playbackRate={playbackRate} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Camera over a 1920x1080 "page": puts source point (cx, cy) at screen centre, scaled by zoom.
// Unless `free`, the focus is clamped so the page always covers the frame (no empty edges).
export const Cam: React.FC<{ zoom: number; cx: number; cy: number; free?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({
  zoom,
  cx: rawX,
  cy: rawY,
  free = false,
  children,
  style,
}) => {
  const lim = (v: number, half: number, size: number) => (free || zoom < 1 ? v : Math.min(size - half / zoom, Math.max(half / zoom, v)));
  const cx = lim(rawX, 960, 1920),
    cy = lim(rawY, 540, 1080);
  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        transformOrigin: "0 0",
        transform: `translate(${960 - cx * zoom}px, ${540 - cy * zoom}px) scale(${zoom})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export type Edge = "push" | "fade" | "cut";

// A shot on the absolute timeline. "push" = the page scrolls: the outgoing shot leaves upwards while the
// next one rises from below — the store's own scroll vocabulary, used as the film's main transition.
export const Shot: React.FC<{ from: number; dur: number; enter?: Edge; exit?: Edge; T?: number; bg?: string; name?: string; children: React.ReactNode }> = ({
  from,
  dur,
  enter = "cut",
  exit = "cut",
  T = 14,
  bg,
  name,
  children,
}) => (
  <Sequence from={from} durationInFrames={dur} name={name} premountFor={30}>
    <ShotBody dur={dur} enter={enter} exit={exit} T={T} bg={bg}>
      {children}
    </ShotBody>
  </Sequence>
);

const ShotBody: React.FC<{ dur: number; enter: Edge; exit: Edge; T: number; bg?: string; children: React.ReactNode }> = ({
  dur,
  enter,
  exit,
  T,
  bg,
  children,
}) => {
  const f = useCurrentFrame();
  const yIn = enter === "push" ? tw(f, [0, T], [1080, 0], EASE_IN_OUT) : 0;
  const yOut = exit === "push" ? tw(f, [dur - T, dur], [0, -1080], EASE_IN_OUT) : 0;
  const opacity = (enter === "fade" ? tw(f, [0, T], [0, 1]) : 1) * (exit === "fade" ? tw(f, [dur - T, dur], [1, 0]) : 1);
  return <AbsoluteFill style={{ background: bg, overflow: "hidden", translate: `0 ${yIn + yOut}px`, opacity }}>{children}</AbsoluteFill>;
};

// Words rise out of a mask one after another (used for every line of display type).
export const Words: React.FC<{ text: string; at: number; stagger?: number; dur?: number; style?: React.CSSProperties; out?: number }> = ({
  text,
  at,
  stagger = 4,
  dur = 16,
  style,
  out,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ fontFamily, display: "flex", flexWrap: "wrap", columnGap: "0.24em", ...style }}>
      {text.split(" ").map((w, i) => {
        const s = at + i * stagger;
        const y = tw(f, [s, s + dur], [105, 0]) + (out !== undefined ? tw(f, [out + i * 2, out + i * 2 + 12], [0, -105], EASE_IN_OUT) : 0);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.12em", marginBottom: "-0.12em" }}>
            <span style={{ display: "inline-block", translate: `0 ${y}%` }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

// A tap: a ring that closes in on the point and vanishes on the click frame — it marks a real click recorded
// in the clip, and never outlives it (the page usually changes on the very next frame).
export const Tap: React.FC<{ x: number; y: number; at: number; color?: string }> = ({ x, y, at, color = C.pine }) => {
  const f = useCurrentFrame();
  if (f < at - 9 || f > at + 3) return null;
  const r = tw(f, [at - 9, at], [42, 15]);
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        border: `3px solid ${color}`,
        opacity: Math.min(tw(f, [at - 9, at - 5], [0, 0.9]), tw(f, [at, at + 3], [0.9, 0])),
      }}
    />
  );
};

// Eased number count (deterministic: a pure function of the frame).
export const useCount = (to: number, start: number, dur: number) => {
  const f = useCurrentFrame();
  // expo-out that lands exactly on 1, so the final frame shows the real figure, not 99.9% of it
  return to * tw(f, [start, start + dur], [0, 1], (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)));
};

export const font = (size: number, weight = 600, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily,
  fontSize: size,
  fontWeight: weight,
  letterSpacing: size > 60 ? "-0.04em" : "-0.01em",
  lineHeight: 1.02,
  fontFeatureSettings: '"ss01"',
  ...extra,
});
