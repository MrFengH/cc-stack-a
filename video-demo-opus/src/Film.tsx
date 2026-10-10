import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { NoteIndicator } from "./components/NoteIndicator";
import { Shot } from "./components/primitives";
import { Close } from "./scenes/Close";
import { Cart, Checkout, Price, ProductHero, Pyramid } from "./scenes/Corazon";
import { Chart, FondoDoor, Kpis, Ops, PanelPull, STEP_TICKS, Tracking } from "./scenes/Fondo";
import { Overture } from "./scenes/Overture";
import { Brands, Families, Filter, HomeHero, Search } from "./scenes/Salida";
import { C, FILM_FRAMES } from "./theme";
import V2_CUES from "./data/vo-v2-cues.json";
import V2_LEN from "./data/vo-v2.json";
import V3_CUES from "./data/vo-v3-cues.json";
import V3_LEN from "./data/vo-v3.json";

type Cue = { src: string; at: number; len: number; duck: number; gain?: number };
type Voice = "v1" | "v2" | "v3";

// v1 narration (Edge, Margarita) — kept so the first cut stays reproducible.
// Absolute start frame + speech length in frames (measured with silencedetect; each file starts with
// ~6 frames of silence). Placed on the beat grid against the picture.
const v1 = (file: string, at: number, len: number): Cue => ({ src: `audio/vo/${file}.mp3`, at, len, duck: 0.6 });
const VO_V1: Cue[] = [
  v1("tres-notas", 12, 70),
  v1("salida", 150, 54),
  v1("familia", 290, 26),
  v1("marca", 356, 25),
  v1("nota", 418, 41),
  v1("corazon", 596, 63),
  v1("piramide", 760, 32),
  v1("precio", 798, 35),
  v1("cupon", 878, 24),
  v1("yappy", 1067, 39),
  v1("fondo", 1160, 54),
  v1("pedido", 1246, 56),
  v1("venta", 1350, 53),
  v1("cierre", 1668, 110),
];

// v2 (Chatterbox) and v3 (ElevenLabs) narration: start frames and per-phrase duck depth in vo-vN-cues.json,
// exact speech lengths from the generator's manifest (scripts/voice_v2.py).
const fromCues = (ver: string, cues: object, lens: object): Cue[] =>
  Object.entries(cues)
    .filter(([id]) => !id.startsWith("_"))
    .map(([id, c]) => {
      const { at, duck, gain } = c as { at: number; duck: number; gain?: number };
      return { src: `audio/vo-${ver}/${id}.wav`, at, duck, gain, len: (lens as Record<string, { speechFrames: number }>)[id].speechFrames };
    });
const VO_V2 = fromCues("v2", V2_CUES, V2_LEN);
const VO_V3 = fromCues("v3", V3_CUES, V3_LEN);

// Mix per narration. v1: the same -8 dB broadband duck under every phrase. v2: duck depth set per phrase
// from the measured bed level (light in Salida, deeper where kick/bass play), plus a crossfade to the
// score's "carved" copy (dip at 1–4 kHz, baked by scripts/mix_prep.py) so the voice gets its band while
// the music keeps its body; longer release so phrase ends breathe.
const MIX: Record<Voice, { cues: Cue[]; voiceGain: number; carve: boolean; release: [number, number] }> = {
  v1: { cues: VO_V1, voiceGain: 0.85, carve: false, release: [8, 20] },
  v2: { cues: VO_V2, voiceGain: 1.0, carve: true, release: [10, 26] },
  v3: { cues: VO_V3, voiceGain: 1.0, carve: true, release: [10, 26] },
};

const CART_AT = 864;
const TRACKING_AT = 1224;
const TICKS = [CART_AT + 36, ...STEP_TICKS.map((t) => TRACKING_AT + t)];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// envelope of a phrase: 0 -> 1 just before it, held while it is spoken, released after
const envelope = (voice: Voice, v: Cue, f: number) => {
  const [r0, r1] = MIX[voice].release;
  return interpolate(f, [v.at - 6, v.at, v.at + v.len + r0, v.at + v.len + r1], [0, 1, 1, 0], clamp);
};
const duckAt = (voice: Voice, f: number) => Math.max(...MIX[voice].cues.map((v) => envelope(voice, v, f)));
const musicVolume = (voice: Voice, f: number) => {
  const depth = Math.max(...MIX[voice].cues.map((v) => envelope(voice, v, f) * v.duck));
  const fadeOut = interpolate(f, [FILM_FRAMES - 40, FILM_FRAMES], [1, 0], clamp);
  return 0.9 * (1 - depth) * fadeOut;
};
// `silent` is for QA stills only: sparse --frames renders trip Remotion's inline audio mixer.
// `stem` is for mix QA: render the music bed or the voice alone to measure their ratio per phrase.
export const Film: React.FC<{ silent?: boolean; voice?: Voice; stem?: "all" | "music" | "voice" }> = ({ silent = false, voice = "v3", stem = "all" }) => (
  <AbsoluteFill style={{ background: C.pineDeep }}>
    {/* ——— Apertura + Salida ——— */}
    <Shot name="Overture" from={0} dur={232} exit="push" T={16}>
      <Overture />
    </Shot>
    <Shot name="Home" from={216} dur={82} enter="push" exit="push" T={16}>
      <HomeHero />
    </Shot>
    <Shot name="Families" from={282} dur={80} enter="push" exit="push" T={16}>
      <Families />
    </Shot>
    <Shot name="Brands" from={346} dur={68} enter="push">
      <Brands />
    </Shot>
    <Shot name="Search" from={414} dur={90}>
      <Search />
    </Shot>
    <Shot name="Filter" from={504} dur={72}>
      <Filter />
    </Shot>

    {/* ——— Corazón ——— */}
    <Shot name="ProductHero" from={564} dur={138} enter="fade" T={12}>
      <ProductHero />
    </Shot>
    <Shot name="Pyramid" from={702} dur={90}>
      <Pyramid />
    </Shot>
    <Shot name="Price" from={792} dur={72}>
      <Price />
    </Shot>
    <Shot name="Cart" from={CART_AT} dur={144}>
      <Cart />
    </Shot>
    <Shot name="Checkout" from={1008} dur={126}>
      <Checkout />
    </Shot>

    {/* ——— Fondo ——— */}
    <Shot name="FondoDoor" from={1134} dur={106} exit="push" T={16}>
      <FondoDoor />
    </Shot>
    <Shot name="Tracking" from={TRACKING_AT} dur={108} enter="push" T={16}>
      <Tracking />
    </Shot>
    <Shot name="Kpis" from={1332} dur={72}>
      <Kpis />
    </Shot>
    <Shot name="Chart" from={1404} dur={90}>
      <Chart />
    </Shot>
    <Shot name="Ops" from={1494} dur={72}>
      <Ops />
    </Shot>
    <Shot name="PanelPull" from={1566} dur={90} exit="fade" T={18}>
      <PanelPull />
    </Shot>

    {/* ——— Cierre ——— */}
    <Shot name="Close" from={1656} dur={FILM_FRAMES - 1656}>
      <Close />
    </Shot>

    <NoteIndicator />

    {/* ——— Sound ——— */}
    {!silent && (
      <>
        {stem !== "voice" && (
          <Audio src={staticFile("audio/music.wav")} volume={(f) => musicVolume(voice, f) * (MIX[voice].carve ? 1 - duckAt(voice, f) : 1)} />
        )}
        {stem !== "voice" && MIX[voice].carve && <Audio src={staticFile("audio/music-carved.wav")} volume={(f) => musicVolume(voice, f) * duckAt(voice, f)} />}
        {stem !== "music" &&
          MIX[voice].cues.map((v) => (
            <Sequence key={v.src} name={`VO ${v.src}`} from={v.at} durationInFrames={v.len + 30} premountFor={30}>
              <Audio src={staticFile(v.src)} volume={MIX[voice].voiceGain * (v.gain ?? 1)} />
            </Sequence>
          ))}
        {stem !== "voice" &&
          TICKS.map((t) => (
            <Sequence key={t} name="tick" from={t} durationInFrames={10} premountFor={30}>
              <Audio src={staticFile("audio/sfx/tick.wav")} volume={0.28} />
            </Sequence>
          ))}
      </>
    )}
  </AbsoluteFill>
);
