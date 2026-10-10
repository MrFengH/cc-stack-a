"""Validates a voice deliverable against the approved reference cut: picture unchanged (frame PSNR at sampled frames),
narration intelligible inside the final mix (ASR of the mixed track vs. the script), head/tail fades, peaks.
Usage: .venv-tts\\Scripts\\python.exe scripts\\v2_validate.py <reference.mp4> <candidate.mp4> <candidate-audio.wav> [v3]  (v3: per-phrase check)
(the WAV is the v2 audio track extracted with ffmpeg: librosa cannot decode MP4 here)
"""
import re
import sys
import unicodedata

import av
import librosa
import numpy as np
from faster_whisper import WhisperModel

SCRIPT = (
    "Todo perfume se cuenta en tres notas. La salida descubrir. Por familia. Por marca. O por una sola nota. "
    "El corazón elegir bien. Su pirámide. Su precio real. Tu cupón aplicado. Y pagas con Yappy. "
    "Y el fondo lo que queda. Cada pedido en camino. Cada venta a la vista. Nota Alta. Perfumería online en Panamá."
)


def words(s):
    s = unicodedata.normalize("NFD", s.lower())
    w = re.findall(r"[a-z0-9]+", "".join(c for c in s if unicodedata.category(c) != "Mn"))
    return ["yappy" if x in ("yapi", "yappi") else x for x in w]


def frames(path, picks):
    out = {}
    with av.open(path) as c:
        for i, f in enumerate(c.decode(video=0)):
            if i in picks:
                out[i] = f.to_ndarray(format="rgb24").astype(np.float64)
            if i > max(picks):
                break
    return out


v1, v2, v2wav = sys.argv[1], sys.argv[2], sys.argv[3]
picks = {0, 150, 300, 480, 600, 760, 900, 1050, 1200, 1400, 1550, 1700, 1860}
a, b = frames(v1, picks), frames(v2, picks)
psnr = []
for i in sorted(picks):
    mse = np.mean((a[i] - b[i]) ** 2)
    psnr.append(99.0 if mse == 0 else 10 * np.log10(255**2 / mse))
print(f"picture: PSNR reference vs candidate over {len(picks)} frames: min {min(psnr):.1f} dB, mean {np.mean(psnr):.1f} dB (>= 45 dB = visually identical)")

y, sr = librosa.load(v2wav, sr=16000, mono=True)
asr = WhisperModel(r".venv-tts\models\faster-whisper-small", device="cpu", compute_type="int8")
segs, _ = asr.transcribe(y, language="es", beam_size=5, vad_filter=True)  # VAD: no outro hallucinations ("suscríbete") over the music tail
heard, ref = words("".join(s.text for s in segs)), words(SCRIPT)
d = np.zeros((len(ref) + 1, len(heard) + 1), dtype=int)
d[:, 0], d[0, :] = range(len(ref) + 1), range(len(heard) + 1)
for i in range(1, len(ref) + 1):
    for j in range(1, len(heard) + 1):
        d[i, j] = min(d[i - 1, j] + 1, d[i, j - 1] + 1, d[i - 1, j - 1] + (ref[i - 1] != heard[j - 1]))
print(f"narration in the final mix: WER {d[-1, -1] / len(ref):.3f} ({d[-1, -1]} edits / {len(ref)} words)")
print("heard:", " ".join(heard))

# per phrase, as a listener hears it: each cue's window of the final mix vs. its own line (long-form ASR
# hallucinates over the music tail at the end of the file: "suscríbete", dropped close)
if len(sys.argv) > 4:
    import json
    from pathlib import Path

    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from voice_v2 import LINES_V3, TAG

    ver = sys.argv[4]
    cues = {k: c for k, c in json.loads(Path(f"src/data/vo-{ver}-cues.json").read_text(encoding="utf-8")).items() if not k.startswith("_")}
    lens = json.loads(Path(f"src/data/vo-{ver}.json").read_text(encoding="utf-8"))
    bad = 0
    for lid, c in cues.items():
        a, b = (c["at"] - 6) / 30, (c["at"] + lens[lid]["speechFrames"] + 12) / 30
        seg = y[int(a * sr) : int(b * sr)]
        got = words("".join(s.text for s in asr.transcribe(seg, language="es", beam_size=5)[0]))
        ok = got == words(TAG.sub("", LINES_V3[lid][0]))
        bad += not ok
        print(f"phrase {lid:<11} {'ok ' if ok else 'BAD'} [{a:5.2f}-{b:5.2f}s] {' '.join(got)}")
    print(f"phrases intelligible in the final mix: {len(cues) - bad}/{len(cues)}")

y48, sr48 = librosa.load(v2wav, sr=48000, mono=False)
mono = np.mean(y48, axis=0) if y48.ndim > 1 else y48
rms = lambda x: 20 * np.log10(np.sqrt(np.mean(x**2)) + 1e-12)
print(f"audio: sample peak {20 * np.log10(np.max(np.abs(y48))):.1f} dBFS; first 0.2 s {rms(mono[: int(0.2 * sr48)]):.1f} dB; "
      f"last 0.3 s {rms(mono[-int(0.3 * sr48):]):.1f} dB; seconds 58-60 {rms(mono[58 * sr48:60 * sr48]):.1f} dB (close, music tail)")
