"""Voice audition v3 — ElevenLabs candidates (premade voices: the account cannot use Voice Library voices
via the API) on the same three phrases used in v2. Output: lossless pcm_24000 -> WAV.
Usage: .venv-tts\\Scripts\\python.exe scripts\\eleven_audition.py <round>
"""
import sys
import wave
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from eleven import tts  # noqa: E402

OUT = Path(__file__).resolve().parent.parent / "public" / "audio" / "voice-tests-v3"
PHRASES = {
    "1-apertura": "Todo perfume se cuenta en tres notas.",
    "2-centro": "El corazón: elegir bien.",
    "3-cierre": "Nota Alta. Perfumería online en Panamá.",
}
TAGGED = {  # identical words; only eleven_v3 performance tags added
    "1-apertura": "[curious] Todo perfume se cuenta en tres notas.",
    "2-centro": "[warmly] El corazón: elegir bien.",
    "3-cierre": "[confident] Nota Alta. [cheerfully] Perfumería online en Panamá.",
}
VOICES = {  # premade female voices (name: id); labels from GET /v2/voices
    "jessica": "cgSgspJ2msm6clMCkdW9",  # Playful, Bright, Warm (young)
    "bella": "hpp4J3VqNfWAUOO0d1Us",  # Professional, Bright, Warm
    "sarah": "EXAVITQu4vr4xnSDxMaL",  # Mature, Reassuring, Confident (young)
    "matilda": "XrExE9yKIg1WjnnlVkGX",  # Knowledgable, Professional (upbeat)
    "laura": "FGY2WhTYpPnrIDTdsKH5",  # Enthusiast, Quirky Attitude (young)
}
ROUNDS = {
    # eleven_v3, "Natural" stability (v3 accepts 0.0 / 0.5 / 1.0), no tags: the raw voice
    "a": [(v, "eleven_v3", {"stability": 0.5, "similarity_boost": 0.75}, {}) for v in VOICES],
    # b: same words, directed with v3 audio tags — a different colour per chapter idea
    "b": [(v, "eleven_v3", {"stability": 0.5, "similarity_boost": 0.75}, TAGGED) for v in ("bella", "laura", "matilda", "sarah")],
    # d: b without [cheerfully] on the tagline (it pushed pitch to ~300 Hz and flattened the ending)
    "d": [(v, "eleven_v3", {"stability": 0.5, "similarity_boost": 0.75}, {**TAGGED, "3-cierre": "[confident] Nota Alta. [warmly] Perfumería online en Panamá."}) for v in ("bella", "matilda", "sarah")],
    # c: multilingual v2 with style exaggeration and a touch more pace, for the two most promising voices
    "c": [(v, "eleven_multilingual_v2", {"stability": 0.35, "similarity_boost": 0.8, "style": 0.45, "use_speaker_boost": True, "speed": 1.05}, {}) for v in ("bella", "laura")],
}


def save(name, pcm):
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(24000)
        w.writeframes(pcm)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    chars = 0
    for voice, model, settings, tagged in ROUNDS[sys.argv[1]]:
        for key, text in PHRASES.items():
            text = tagged.get(key, text)
            cid = f"el-{voice}-{model.replace('eleven_', '')}-{sys.argv[1]}"
            save(f"{cid}__{key}", tts(VOICES[voice], text, model, settings, output_format="pcm_24000", seed=7))
            chars += len(text)
            print(cid, key, flush=True)
    print("characters sent:", chars)
