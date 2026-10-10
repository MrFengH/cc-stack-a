"""Suggests cue start frames so key words land on their picture beats: word onset inside each narration
file (ASR word timestamps on the isolated file, where they are accurate) -> at = target - onset.
Usage: .venv-tts\\Scripts\\python.exe scripts\\cue_anchor.py v3 [--write]
"""
import json
import sys
import unicodedata
from pathlib import Path

import librosa
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
# line -> (key word, frame it must start on, picture event)
ANCHORS = {
    "salida": ("descubrir", 178, "'descubrir.' rises in the overture (176)"),
    "nota": ("nota", 470, "lands as the search results appear (463-472); the line overlaps the typing"),
    "corazon": ("elegir", 631, "'elegir bien.' rises (630)"),
    "cupon": ("aplicado", 901, "coupon applied in the cart clip (900)"),
    "yappy": ("yappy", 1092, "final Yappy selection (1092)"),
    "fondo": ("lo", 1193, "'lo que queda.' rises (1192)"),
    "firma": ("nota", 1688, "after the bell's attack (1656)"),
    "cierre": ("perfumeria", 1729, "tagline appears (1728)"),
}
ALIASES = {"yappy": {"yappy", "yapi", "yappi"}}


def norm(w):
    w = unicodedata.normalize("NFD", w.lower().strip(" .,:;¿?¡!…"))
    return "".join(c for c in w if unicodedata.category(c) != "Mn")


ver = sys.argv[1]
cues_path = ROOT / f"src/data/vo-{ver}-cues.json"
cues = json.loads(cues_path.read_text(encoding="utf-8"))
asr = WhisperModel(str(ROOT / ".venv-tts/models/faster-whisper-small"), device="cpu", compute_type="int8")
for lid, (key, target, event) in ANCHORS.items():
    y = librosa.load(ROOT / f"public/audio/vo-{ver}/{lid}.wav", sr=16000)[0]
    segs, _ = asr.transcribe(y, language="es", word_timestamps=True, beam_size=5)
    ws = [(norm(w.word), w.start) for s in segs for w in (s.words or [])]
    hit = next((t for w, t in ws if w in ALIASES.get(key, {key})), None)
    if hit is None:
        print(f"{lid:<8} '{key}' not found in {[w for w, _ in ws]}")
        continue
    at = round(target - hit * FPS)
    print(f"{lid:<8} '{key}' at +{hit * FPS:5.1f} f in file -> at {at:5d} (was {cues[lid]['at']})  [{event}]")
    cues[lid]["at"] = at
if "--write" in sys.argv:
    cues_path.write_text(json.dumps(cues, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("written", cues_path.name)
