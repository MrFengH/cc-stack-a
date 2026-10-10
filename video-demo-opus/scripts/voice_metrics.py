"""Objective proxies for the voice audition (the author cannot listen; these do not replace a human ear).

Per sample: ASR round-trip (faster-whisper small, es) -> transcript, word error vs. the script, mean word
probability; F0 (librosa.pyin) -> median, range (p5-p95) and std in semitones, final-phrase fall;
pauses >= 150 ms inside the speech span; loudness dynamics (p90-p10 dB over voiced frames); speech rate (syllables/s, Spanish vowel-group estimate);
95% spectral roll-off (bandwidth proxy); integrated loudness.
Usage: .venv-tts\\Scripts\\python.exe scripts\\voice_metrics.py <folder> [--json out.json] [--no-asr]
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

import librosa
import numpy as np
import pyloudnorm as pyln

PHRASES = {
    "1-apertura": "Todo perfume se cuenta en tres notas.",
    "2-centro": "El corazón: elegir bien.",
    "3-cierre": "Nota Alta. Perfumería online en Panamá.",
}
SR = 24000


def norm_words(s: str) -> list[str]:
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.findall(r"[a-z0-9]+", s)


def wer(ref: list[str], hyp: list[str]) -> float:
    d = np.zeros((len(ref) + 1, len(hyp) + 1), dtype=int)
    d[:, 0] = range(len(ref) + 1)
    d[0, :] = range(len(hyp) + 1)
    for i in range(1, len(ref) + 1):
        for j in range(1, len(hyp) + 1):
            d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1, d[i - 1, j - 1] + (ref[i - 1] != hyp[j - 1]))
    return d[-1, -1] / max(1, len(ref))


def syllables(text: str) -> int:
    return len(re.findall(r"[aeiouáéíóúü]+", text.lower()))


def analyse(path: Path, asr) -> dict:
    y, _ = librosa.load(path, sr=SR, mono=True)
    key = path.stem.split("__")[1]
    text = PHRASES[key]
    intervals = librosa.effects.split(y, top_db=35, frame_length=1024, hop_length=256)
    start, end = intervals[0][0], intervals[-1][1]
    speech = (end - start) / SR
    gaps = [(intervals[i + 1][0] - intervals[i][1]) / SR for i in range(len(intervals) - 1)]
    pauses = [round(g, 2) for g in gaps if g >= 0.15]

    f0, voiced, _ = librosa.pyin(y[start:end], fmin=70, fmax=400, sr=SR, frame_length=1024, hop_length=256)
    f0 = f0[voiced & ~np.isnan(f0)]
    st = 12 * np.log2(f0 / np.median(f0)) if len(f0) else np.array([0.0])
    tail = st[-max(3, len(st) // 6):]
    fall = float(np.median(st[: len(st) // 3]) - np.median(tail)) if len(st) > 6 else 0.0

    # energy dynamics: spread (p90-p10) of frame loudness over voiced frames; flat delivery -> low
    rms = librosa.feature.rms(y=y[start:end], frame_length=1024, hop_length=256)[0]
    rdb = 20 * np.log10(rms[: len(voiced)][voiced[: len(rms)]] + 1e-9) if voiced.any() else np.array([0.0])
    dyn = float(np.percentile(rdb, 90) - np.percentile(rdb, 10))

    S = np.abs(librosa.stft(y[start:end], n_fft=2048))
    rolloff = float(np.median(librosa.feature.spectral_rolloff(S=S, sr=SR, roll_percent=0.95)))
    meter = pyln.Meter(SR)
    lufs = float(meter.integrated_loudness(y)) if len(y) > SR * 0.5 else float("nan")

    words = []
    if asr is not None:
        # decoded here: faster-whisper's own decoder breaks with PyAV 19
        segs, _ = asr.transcribe(librosa.load(path, sr=16000, mono=True)[0], language="es", word_timestamps=True, beam_size=5)
        words = [w for s in segs for w in (s.words or [])]
    hyp = "".join(w.word for w in words).strip()
    return {
        "file": path.name,
        "asr": hyp,
        "wer": round(wer(norm_words(text), norm_words(hyp)), 2) if asr is not None else None,
        "word_prob": round(float(np.mean([w.probability for w in words])) if words else 0.0, 3),
        "speech_s": round(speech, 2),
        "syl_per_s": round(syllables(text) / speech, 2),
        "pauses_s": pauses,
        "f0_median_hz": round(float(np.median(f0)), 1) if len(f0) else None,
        "f0_range_st": round(float(np.percentile(st, 95) - np.percentile(st, 5)), 1),
        "f0_std_st": round(float(np.std(st)), 2),
        "final_fall_st": round(fall, 1),
        "rolloff95_hz": round(rolloff),
        "dyn_db": round(dyn, 1),
        "lufs": round(lufs, 1),
    }


if __name__ == "__main__":
    folder = Path(sys.argv[1])
    asr = None
    if "--no-asr" not in sys.argv:
        from faster_whisper import WhisperModel

        # local copy if present (fetched with curl), CPU int8: no cuDNN dependency
        local = Path(__file__).resolve().parent.parent / ".venv-tts" / "models" / "faster-whisper-small"
        asr = WhisperModel(str(local) if (local / "model.bin").exists() else "small", device="cpu", compute_type="int8")
    rows = [analyse(p, asr) for p in sorted(folder.iterdir()) if p.suffix in (".wav", ".mp3") and "__" in p.stem]
    for r in rows:
        print(json.dumps(r, ensure_ascii=False))
    if "--json" in sys.argv:
        Path(sys.argv[sys.argv.index("--json") + 1]).write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")
