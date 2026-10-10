"""Chatterbox Multilingual "session": several directed settings x seeds per phrase (it is stochastic, so
takes are generated and screened like a recording session). Built-in voice only, no cloning.
Usage: .venv-tts\\Scripts\\python.exe scripts\\voice_chatterbox_takes.py <out-folder> <lines.json> [settings...]
lines.json: {"<key>": "<text>", ...}; settings names from SETTINGS below (default: all).
Each take: <out>/<setting>-s<seed>__<key>.wav
"""
import json
import sys
from pathlib import Path

import soundfile as sf
import torch
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

ROOT = Path(__file__).resolve().parent.parent
SETTINGS = {
    # exaggeration: expressiveness; cfg_weight: lower = slower, more deliberate; temperature: variability
    "A": dict(exaggeration=0.5, cfg_weight=0.3, temperature=0.7),
    "B": dict(exaggeration=0.6, cfg_weight=0.3, temperature=0.7),
    "C": dict(exaggeration=0.7, cfg_weight=0.25, temperature=0.6),
    # D: identity locked to one of its own clean takes (self-reference: the built-in voice, no third party),
    # more text adherence and less randomness, to fight hallucinated tails and register drift.
    "D": dict(exaggeration=0.55, cfg_weight=0.4, temperature=0.55, audio_prompt_path=str(ROOT / "public/audio/voice-tests-v2/chatterbox-takes/A-s2__1-apertura.wav")),
    # v3 audition, more energy: E = built-in voice unlocked; F = female reference from Kokoro "ef_dora"
    # (Apache-2.0 synthetic voice, not a real person).
    "E": dict(exaggeration=0.75, cfg_weight=0.45, temperature=0.6),
    "F": dict(exaggeration=0.75, cfg_weight=0.45, temperature=0.6, audio_prompt_path=str(ROOT / "public/audio/voice-tests-v2/kokoro-dora__1-apertura.wav")),
}
SEEDS = [1, 2, 3]

if __name__ == "__main__":
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    lines = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8-sig"))  # tolerate a BOM
    names = sys.argv[3:] or list(SETTINGS)
    model = ChatterboxMultilingualTTS.from_local(ROOT / ".venv-tts" / "models" / "chatterbox", "cuda")
    for name in names:
        for seed in SEEDS:
            for key, text in lines.items():
                torch.manual_seed(seed)
                wav = model.generate(text, language_id="es", **SETTINGS[name])
                sf.write(out / f"{name}-s{seed}__{key}.wav", wav.squeeze(0).cpu().numpy(), model.sr)
                print(name, seed, key, flush=True)
