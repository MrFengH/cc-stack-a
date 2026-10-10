"""Voice audition v2 — "crafted" Edge candidate: same words, directed through punctuation, per-segment
rate/pitch and hand-set gaps (Edge TTS has no style/emotion control). Segments are rendered separately and
assembled with exact silences.
Usage: .venv-tts\\Scripts\\python.exe scripts\\voice_edge_crafted.py <voice> <candidate-id>
"""
import subprocess
import sys
import tempfile
from pathlib import Path

import librosa
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
TTS = ROOT / ".venv" / "Scripts" / "edge-tts.exe"
OUT = ROOT / "public" / "audio" / "voice-tests-v2"
SR = 48000

# (text, rate, pitch, gap-after seconds) — same words as the plain audition phrases
PHRASES = {
    "1-apertura": [("Todo perfume… se cuenta en tres notas.", "-14%", "-4Hz", 0)],
    "2-centro": [("El corazón:", "-16%", "-6Hz", 0.32), ("elegir bien.", "-14%", "-5Hz", 0)],
    "3-cierre": [("Nota Alta.", "-18%", "-7Hz", 0.55), ("Perfumería online en Panamá.", "-12%", "-4Hz", 0)],
}


def render(text: str, voice: str, rate: str, pitch: str) -> np.ndarray:
    with tempfile.TemporaryDirectory() as tmp:
        mp3 = Path(tmp) / "seg.mp3"
        subprocess.run([str(TTS), "--voice", voice, f"--rate={rate}", f"--pitch={pitch}", "--text", text, "--write-media", str(mp3)], check=True)
        y, _ = librosa.load(mp3, sr=SR, mono=True)
    y, _ = librosa.effects.trim(y, top_db=40)
    return y


def assemble(segments, voice: str) -> np.ndarray:
    parts = []
    for text, rate, pitch, gap in segments:
        parts += [render(text, voice, rate, pitch), np.zeros(int(gap * SR))]
    lead = np.zeros(int(0.05 * SR))
    return np.concatenate([lead, *parts, np.zeros(int(0.3 * SR))])


if __name__ == "__main__":
    voice, cid = sys.argv[1], sys.argv[2]
    for key, segs in PHRASES.items():
        sf.write(OUT / f"{cid}__{key}.wav", assemble(segs, voice), SR)
        print(cid, key)
