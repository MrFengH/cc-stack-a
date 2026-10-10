import { loadFont } from "@remotion/google-fonts/SchibstedGrotesk";
import { Easing, interpolate } from "remotion";

// The store's own typeface and palette (read from the rendered app).
export const { fontFamily } = loadFont("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });

export const C = {
  ground: "#f1f2ee",
  surface: "#fafaf8",
  sage: "#e4e8e1",
  line: "#d5dad2",
  ink: "#1c2622",
  inkSoft: "#56625c",
  pine: "#23463c",
  pineDeep: "#183229",
  pineTint: "#dce7e1",
  onPineSoft: "#c9d8d0",
  sale: "#b8431f",
} as const;

// 100 BPM grid: the score and every cut share it.
export const BEAT = 18;
export const BAR = 72;
export const bar = (n: number, beat = 0) => n * BAR + beat * BEAT;
export const FILM_FRAMES = bar(26);

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);

// clamped interpolate: every tween in the film is clamped
export const tw = (f: number, input: number[], output: number[], easing: (t: number) => number = EASE_OUT) =>
  interpolate(f, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// Keyframed value: [[frame, value], ...] with one easing per segment.
export const keys = (f: number, k: [number, number][], easing = EASE_IN_OUT) =>
  tw(
    f,
    k.map((p) => p[0]),
    k.map((p) => p[1]),
    easing,
  );
