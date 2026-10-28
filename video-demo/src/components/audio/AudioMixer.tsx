import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

/**
 * Rangos de frames donde la voz de narración está activa
 * basados en mediciones reales de audio TTS (es-PA-MargaritaNeural @ 30 FPS).
 */
const VOICE_RANGES: Array<{ start: number; end: number }> = [
  { start: 15, end: 214 }, // 01 Intro (199f / 6.62s)
  { start: 236, end: 431 }, // 02 Descubrimiento (195f / 6.50s)
  { start: 462, end: 620 }, // 03 Catálogo (158f / 5.28s)
  { start: 686, end: 898 }, // 04 Producto (212f / 7.08s)
  { start: 942, end: 1130 }, // 05 Carrito (188f / 6.26s)
  { start: 1168, end: 1361 }, // 06 Checkout (193f / 6.43s)
  { start: 1424, end: 1601 }, // 07 Tracking (177f / 5.90s)
  { start: 1646, end: 1853 }, // 08 Panel (207f / 6.89s)
  { start: 1912, end: 2086 }, // 09 Operaciones (174f / 5.81s)
  { start: 2146, end: 2302 }, // 10 Cierre (156f / 5.18s)
];

/**
 * Pistas de locución sincronizadas con el flujo visual
 */
const VOICE_TRACKS = [
  { id: "01-intro", from: 15, duration: 199, file: "audio/voice/01-intro.mp3" },
  { id: "02-discovery", from: 236, duration: 195, file: "audio/voice/02-discovery.mp3" },
  { id: "03-catalog", from: 462, duration: 158, file: "audio/voice/03-catalog.mp3" },
  { id: "04-product", from: 686, duration: 212, file: "audio/voice/04-product.mp3" },
  { id: "05-cart", from: 942, duration: 188, file: "audio/voice/05-cart.mp3" },
  { id: "06-checkout", from: 1168, duration: 193, file: "audio/voice/06-checkout.mp3" },
  { id: "07-tracking", from: 1424, duration: 177, file: "audio/voice/07-tracking.mp3" },
  { id: "08-panel", from: 1646, duration: 207, file: "audio/voice/08-panel.mp3" },
  { id: "09-operations", from: 1912, duration: 174, file: "audio/voice/09-operations.mp3" },
  { id: "10-outro", from: 2146, duration: 156, file: "audio/voice/10-outro.mp3" },
];

/**
 * Efectos de sonido sincronizados con transiciones y momentos interactivos
 */
const SFX_CUES = [
  // Transiciones de cámara y escena (Whoosh sutil)
  { id: "whoosh-02", frame: 226, duration: 10, file: "audio/sfx/whoosh.wav", volume: 0.16 },
  { id: "whoosh-03", frame: 452, duration: 10, file: "audio/sfx/whoosh.wav", volume: 0.16 },
  { id: "whoosh-04", frame: 676, duration: 10, file: "audio/sfx/whoosh.wav", volume: 0.18 },
  { id: "whoosh-05", frame: 932, duration: 10, file: "audio/sfx/whoosh.wav", volume: 0.16 },
  { id: "whoosh-06", frame: 1158, duration: 10, file: "audio/sfx/whoosh.wav", volume: 0.16 },
  { id: "whoosh-07", frame: 1414, duration: 10, file: "audio/sfx/whoosh.wav", volume: 0.16 },
  { id: "whoosh-08", frame: 1636, duration: 10, file: "audio/sfx/whoosh.wav", volume: 0.20 },
  { id: "whoosh-09", frame: 1902, duration: 10, file: "audio/sfx/whoosh.wav", volume: 0.16 },
  { id: "whoosh-10", frame: 2136, duration: 10, file: "audio/sfx/whoosh.wav", volume: 0.16 },

  // Interacciones UI clave
  { id: "click-filter", frame: 520, duration: 4, file: "audio/sfx/click.wav", volume: 0.20 },
  { id: "coupon-success", frame: 1040, duration: 26, file: "audio/sfx/coupon-impact.wav", volume: 0.28 },
  { id: "click-yappy", frame: 1240, duration: 4, file: "audio/sfx/click.wav", volume: 0.20 },
  { id: "metric-surge", frame: 1680, duration: 22, file: "audio/sfx/metric-rise.wav", volume: 0.25 },
];

export interface AudioMixerProps {
  musicTrack?: string;
  enableVoice?: boolean;
  enableMusic?: boolean;
  enableSfx?: boolean;
  musicBaseVolume?: number;
  musicDuckedVolume?: number;
}

/**
 * AudioMixer: Componente central de mezcla y sincronización sonora.
 * Implementa audio ducking dinámico continuo para que la voz
 * destaque nítida y cálida mientras la música respira en los silencios.
 */
export const AudioMixer: React.FC<AudioMixerProps> = ({
  musicTrack = "audio/music/background.mp3",
  enableVoice = true,
  enableMusic = true,
  enableSfx = true,
  musicBaseVolume = 0.26,
  musicDuckedVolume = 0.09,
}) => {
  // Función pura de volumen frame-a-frame para el ducking musical
  const getMusicVolume = (frame: number): number => {
    const vDuck = musicDuckedVolume;
    const vPause = musicBaseVolume;
    const rampFrames = 9;

    // Fade-in inicial
    if (frame < 15) {
      if (frame < 8) {
        return (frame / 8.0) * vPause;
      }
      return vPause - ((frame - 8.0) / 7.0) * (vPause - vDuck);
    }

    // Fade-out final (Margarita concluye en 2302, dejando 54 frames de colchón musical)
    if (frame > 2302) {
      if (frame < 2316) {
        return vDuck + ((frame - 2302.0) / 14.0) * (vPause - vDuck);
      }
      if (frame < 2344) {
        return vPause;
      }
      return Math.max(0.0, vPause * (1.0 - (frame - 2344.0) / 12.0));
    }

    // Comprobar si el frame está dentro de algún segmento de locución
    for (const range of VOICE_RANGES) {
      if (frame >= range.start && frame <= range.end) {
        return vDuck;
      }
    }

    // Transición en pausas intermedias entre locuciones
    for (let i = 0; i < VOICE_RANGES.length - 1; i++) {
      const prevEnd = VOICE_RANGES[i].end;
      const nextStart = VOICE_RANGES[i + 1].start;
      if (frame > prevEnd && frame < nextStart) {
        const gapLen = nextStart - prevEnd;
        const ramp = Math.min(rampFrames, Math.floor(gapLen / 2));
        const maxV = gapLen >= 24 ? vPause : vDuck + (vPause - vDuck) * (gapLen / 24.0);
        const distFromPrev = frame - prevEnd;
        const distToNext = nextStart - frame;

        if (distFromPrev < ramp) {
          const t = distFromPrev / ramp;
          return vDuck + (maxV - vDuck) * (0.5 - 0.5 * Math.cos(Math.PI * t));
        }
        if (distToNext < ramp) {
          const t = distToNext / ramp;
          return vDuck + (maxV - vDuck) * (0.5 - 0.5 * Math.cos(Math.PI * t));
        }
        return maxV;
      }
    }

    return vDuck;
  };

  return (
    <>
      {/* 1. Música de fondo con Ducking Dinámico Continuo */}
      {enableMusic && (
        <Audio
          src={staticFile(musicTrack)}
          volume={getMusicVolume}
        />
      )}

      {/* 2. Pistas de Voz Narrativa (Edge TTS Neural) */}
      {enableVoice &&
        VOICE_TRACKS.map((track) => (
          <Sequence
            key={track.id}
            from={track.from}
            durationInFrames={track.duration}
            name={`Voice: ${track.id}`}
          >
            <Audio
              src={staticFile(track.file)}
              volume={1.0}
            />
          </Sequence>
        ))}

      {/* 3. Efectos de Sonido Sutiles (SFX) */}
      {enableSfx &&
        SFX_CUES.map((sfx) => (
          <Sequence
            key={sfx.id}
            from={sfx.frame}
            durationInFrames={sfx.duration}
            name={`SFX: ${sfx.id}`}
          >
            <Audio
              src={staticFile(sfx.file)}
              volume={sfx.volume}
            />
          </Sequence>
        ))}
    </>
  );
};
