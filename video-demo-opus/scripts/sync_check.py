"""Sync check: word-level timestamps of the rendered voice stem vs. the picture beats they must hit,
plus cue overlaps and the space left after the last word. Frames at 30 fps.
Usage: .venv-tts\\Scripts\\python.exe scripts\\sync_check.py scratch\\stem-voice.wav [v2|v3]
"""
import json
import sys
import unicodedata
from pathlib import Path

import librosa
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parent.parent
FPS, FILM_FRAMES = 30, 1872
# word -> (picture event, frame, tolerance in frames). Events from the scene code.
TARGETS = {
    "descubrir": ("'descubrir.' rises in the overture", 176, 12),
    "elegir": ("'elegir bien.' rises in ProductHero", 630, 12),
    "aplicado": ("coupon applied in the cart clip", 900, 12),
    "yappy": ("final Yappy selection in checkout", 1092, 10),
    "queda": ("'lo que queda.' rises at the Fondo door", 1192, 14),
    "alta": ("wordmark 'Nota Alta' on screen (bell at 1656)", 1700, 20),
    "perfumeria": ("tagline appears in the close", 1728, 12),
}


ALIASES = {"yappy": {"yappy", "yapi", "yappi"}}  # ASR spells the brand phonetically


def norm(w):
    w = unicodedata.normalize("NFD", w.lower().strip(" .,:;¿?¡!…"))
    return "".join(c for c in w if unicodedata.category(c) != "Mn")


y = librosa.load(sys.argv[1], sr=16000, mono=True)[0]
asr = WhisperModel(str(ROOT / ".venv-tts/models/faster-whisper-small"), device="cpu", compute_type="int8")
segs, _ = asr.transcribe(y, language="es", word_timestamps=True, beam_size=5)
words = [(norm(w.word), w.start * FPS, w.end * FPS) for s in segs for w in (s.words or [])]
print("transcript:", " ".join(w for w, _, _ in words))
for key, (event, frame, tol) in TARGETS.items():
    hits = [w for w in words if w[0] in ALIASES.get(key, {key})]
    if not hits:
        print(f"MISSING  {key:<11} ({event})")
        continue
    start = min(hits, key=lambda w: abs(w[1] - frame))[1]
    print(f"{'ok ' if abs(start - frame) <= tol else 'OFF'}  {key:<11} at {start:6.1f}  target {frame} ±{tol}  ({event})")

VER = sys.argv[2] if len(sys.argv) > 2 else "v2"
cues = {k: v for k, v in json.loads((ROOT / f"src/data/vo-{VER}-cues.json").read_text(encoding="utf-8")).items() if not k.startswith("_")}
lens = json.loads((ROOT / f"src/data/vo-{VER}.json").read_text(encoding="utf-8"))
spans = sorted((c["at"], c["at"] + lens[k]["speechFrames"] + 2, k) for k, c in cues.items())
for (a0, a1, ka), (b0, _, kb) in zip(spans, spans[1:]):
    if a1 > b0:
        print(f"OVERLAP {ka} ends {a1} > {kb} starts {b0}")
print(f"last word ends at {words[-1][2]:.0f}; {FILM_FRAMES - words[-1][2]:.0f} frames ({(FILM_FRAMES - words[-1][2]) / FPS:.1f}s) of close remain")
