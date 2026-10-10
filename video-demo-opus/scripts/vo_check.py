"""Checks the assembled narration files: full-line ASR, speech span, internal pauses, head/tail silence, peak.
Usage: .venv-tts\\Scripts\\python.exe scripts\\vo_check.py <folder>
"""
import sys
from pathlib import Path

import librosa
import numpy as np
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parent.parent
asr = WhisperModel(str(ROOT / ".venv-tts" / "models" / "faster-whisper-small"), device="cpu", compute_type="int8")
for f in sorted(Path(sys.argv[1]).glob("*.wav")):
    y, sr = librosa.load(f, sr=None, mono=True)
    iv = librosa.effects.split(y, top_db=40, frame_length=1024, hop_length=256)
    gaps = [round((iv[i + 1][0] - iv[i][1]) / sr, 2) for i in range(len(iv) - 1)]
    segs, _ = asr.transcribe(librosa.resample(y, orig_sr=sr, target_sr=16000), language="es", beam_size=5)
    text = "".join(s.text for s in segs).strip()
    print(
        f"{f.stem:<11} speech {(iv[-1][1] - iv[0][0]) / sr:4.2f}s head {iv[0][0] / sr:4.2f}s tail {(len(y) - iv[-1][1]) / sr:4.2f}s "
        f"gaps {[g for g in gaps if g >= 0.12]!s:<18} peak {20 * np.log10(np.max(np.abs(y))):5.1f}dB | {text}"
    )
