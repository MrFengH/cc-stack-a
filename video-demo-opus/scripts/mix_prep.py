"""Mix prep for narration v2 (Remotion only automates volume, so EQ is baked into files here).

- public/audio/music-carved.wav: the score with a -4.5 dB peaking dip centred on 2.2 kHz (Q 0.8) and a
  mild -2 dB dip at 400 Hz. Film.tsx crossfades to it under each phrase: frequency-aware ducking, so the
  broadband duck can stay shallow and the music keeps its body.
- Voice EQ (public/audio/vo-v2-dry/*.wav -> public/audio/vo-v2/, so re-running never stacks it):
  high-pass 90 Hz, -1.5 dB at 280 Hz, +2.5 dB presence at 4.5 kHz (Chatterbox renders darker than Edge).
  Peaks re-checked to stay <= -1 dBFS.
Biquads: RBJ Audio EQ Cookbook.
Usage: .venv-tts\\Scripts\\python.exe scripts\\mix_prep.py [--music] [--voice v2|v3]  (v3: no presence lift)
"""
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import lfilter

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / "public" / "audio"


def peaking(f0, gain_db, q, sr):
    a = 10 ** (gain_db / 40)
    w = 2 * np.pi * f0 / sr
    alpha = np.sin(w) / (2 * q)
    b = [1 + alpha * a, -2 * np.cos(w), 1 - alpha * a]
    den = [1 + alpha / a, -2 * np.cos(w), 1 - alpha / a]
    return np.array(b) / den[0], np.array(den) / den[0]


def highpass(f0, q, sr):
    w = 2 * np.pi * f0 / sr
    alpha = np.sin(w) / (2 * q)
    c = np.cos(w)
    b = [(1 + c) / 2, -(1 + c), (1 + c) / 2]
    den = [1 + alpha, -2 * c, 1 - alpha]
    return np.array(b) / den[0], np.array(den) / den[0]


def apply(x, filters):
    for b, a in filters:
        x = lfilter(b, a, x, axis=0)
    return x


if __name__ == "__main__":
    if "--music" in sys.argv:
        y, sr = sf.read(AUDIO / "music.wav")
        carved = apply(y, [peaking(2200, -4.5, 0.8, sr), peaking(400, -2.0, 1.0, sr)])
        sf.write(AUDIO / "music-carved.wav", carved, sr, subtype="PCM_16")
        print("music-carved.wav", f"peak={20 * np.log10(np.max(np.abs(carved))):.1f}dBFS")
    if "--voice" in sys.argv:
        ver = sys.argv[sys.argv.index("--voice") + 1] if len(sys.argv) > sys.argv.index("--voice") + 1 else "v2"
        presence = {"v2": 2.5, "v3": 0.0}[ver]  # v3 (ElevenLabs) is already bright: no presence lift
        (AUDIO / f"vo-{ver}").mkdir(exist_ok=True)
        for src in sorted((AUDIO / f"vo-{ver}-dry").glob("*.wav")):
            f = AUDIO / f"vo-{ver}" / src.name
            y, sr = sf.read(src)
            y = apply(y, [highpass(90, 0.707, sr), peaking(280, -1.5, 1.0, sr), peaking(4500, presence, 0.9, sr)])
            peak = np.max(np.abs(y))
            if peak > 0.89:
                y *= 0.89 / peak
            sf.write(f, y, sr, subtype="PCM_24")
            print(f.name, f"peak={20 * np.log10(np.max(np.abs(y))):.1f}dBFS")
