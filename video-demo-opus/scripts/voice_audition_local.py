"""Voice audition v2 — local engines (Kokoro ONNX, Chatterbox Multilingual by Resemble AI).

Same three phrases as the Edge candidates. Fixed seeds so a sample can be regenerated.
Usage: .venv-tts\\Scripts\\python.exe scripts\\voice_audition_local.py [kokoro|chatterbox ...]
Output: public/audio/voice-tests-v2/<candidate>__<phrase>.wav
"""
import sys
import urllib.request
from pathlib import Path

import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio" / "voice-tests-v2"
MODELS = ROOT / ".venv-tts" / "models"
OUT.mkdir(parents=True, exist_ok=True)
MODELS.mkdir(parents=True, exist_ok=True)

PHRASES = {
    "1-apertura": "Todo perfume se cuenta en tres notas.",
    "2-centro": "El corazón: elegir bien.",
    "3-cierre": "Nota Alta. Perfumería online en Panamá.",
}
want = set(sys.argv[1:]) or {"kokoro", "chatterbox"}


def fetch(url: str, name: str) -> Path:
    dest = MODELS / name
    if not dest.exists():
        print("downloading", name)
        urllib.request.urlretrieve(url, dest)
    return dest


if "kokoro" in want:
    from kokoro_onnx import Kokoro

    rel = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"
    kokoro = Kokoro(str(fetch(rel + "kokoro-v1.0.onnx", "kokoro-v1.0.onnx")), str(fetch(rel + "voices-v1.0.bin", "voices-v1.0.bin")))
    # Kokoro's Spanish set: ef_dora (female), em_alex / em_santa (male). No style control, only speed.
    for cid, voice, speed in [("kokoro-dora", "ef_dora", 0.9), ("kokoro-alex", "em_alex", 0.9)]:
        for key, text in PHRASES.items():
            samples, sr = kokoro.create(text, voice=voice, speed=speed, lang="es")
            sf.write(OUT / f"{cid}__{key}.wav", samples, sr)
            print(cid, key)

if "chatterbox" in want:
    import torch
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS

    device = "cuda" if torch.cuda.is_available() else "cpu"
    # weights fetched with resumable curl into .venv-tts/models/chatterbox (the HF client stalled on this network)
    local = MODELS / "chatterbox"
    model = ChatterboxMultilingualTTS.from_local(local, device) if (local / "t3_mtl23ls_v2.safetensors").exists() else ChatterboxMultilingualTTS.from_pretrained(device=device)
    # Built-in voice (no cloning). README guidance: lower cfg_weight = slower, more deliberate pacing;
    # higher exaggeration = more expressive. "directed" aims at intimate, unhurried delivery.
    settings = [
        ("chatterbox-default", dict(exaggeration=0.5, cfg_weight=0.5, temperature=0.8)),
        ("chatterbox-directed", dict(exaggeration=0.6, cfg_weight=0.3, temperature=0.7)),
    ]
    for cid, kw in settings:
        for key, text in PHRASES.items():
            torch.manual_seed(7)
            wav = model.generate(text, language_id="es", **kw)
            sf.write(OUT / f"{cid}__{key}.wav", wav.squeeze(0).cpu().numpy(), model.sr)
            print(cid, key)
