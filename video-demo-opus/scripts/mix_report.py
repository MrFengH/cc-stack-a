"""Per-phrase mix report from rendered stems (Film stem="voice" / stem="music", codec wav).

For each narration cue: voice loudness and music-bed loudness over the speech window (pyloudnorm,
gated integrated over the window), their ratio, and the peak of their sum. Plus whole-mix figures.
Usage: .venv-tts\\Scripts\\python.exe scripts\\mix_report.py <voice.wav> <music.wav> [v2|v3]
"""
import json
import sys
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
VER = sys.argv[3] if len(sys.argv) > 3 else "v2"
cues = {k: v for k, v in json.loads((ROOT / f"src/data/vo-{VER}-cues.json").read_text(encoding="utf-8")).items() if not k.startswith("_")}
lens = json.loads((ROOT / f"src/data/vo-{VER}.json").read_text(encoding="utf-8"))

voice, sr = sf.read(sys.argv[1])
music, _ = sf.read(sys.argv[2])
n = min(len(voice), len(music))
voice, music = voice[:n], music[:n]
mix = voice + music
meter = pyln.Meter(sr, block_size=0.2)


def lufs(x):
    return meter.integrated_loudness(x) if len(x) > sr * 0.25 else float("nan")


ratios = []
for cid, cue in cues.items():
    at = cue["at"]
    a = int((at + 1) / FPS * sr)
    b = int((at + 1 + lens[cid]["speechFrames"]) / FPS * sr)
    v, m = lufs(voice[a:b]), lufs(music[a:b])
    ratios.append(v - m)
    print(f"{cid:<11} voice {v:6.1f} LUFS  bed {m:6.1f} LUFS  ratio {v - m:+5.1f} dB  peak {20 * np.log10(np.max(np.abs(mix[a:b]))):6.1f} dBFS")
print(f"ratio min/median/max: {min(ratios):+.1f} / {np.median(ratios):+.1f} / {max(ratios):+.1f} dB")
print(f"mix integrated {lufs(mix):.1f} LUFS, sample peak {20 * np.log10(np.max(np.abs(mix))):.1f} dBFS")
