"""Narration v2 — production render of every line with the voice chosen in the audition.

Engine "chatterbox" (chosen): Chatterbox Multilingual (Resemble AI, local GPU), built-in voice locked to one
of its own clean takes (setting D of the audition), per-chapter expressiveness. It is stochastic, so each
segment gets several seeded takes, screened automatically (ASR word errors, pace, phrase-final fall) and the
best take is kept; every take is saved for human review in public/audio/vo-v2-takes/.
Engine "edge" (fallback, the crafted Dalia candidate): per-chapter rate/pitch, deterministic.
Engine "elevenlabs" (narration v3): ElevenLabs eleven_v3, premade voice "Sarah", one request per line with
per-chapter performance tags (LINES_V3); same screening and full-line check. Writes the v3 folders/manifest
(vo-v3-dry, vo-v3-takes, src/data/vo-v3.json) so v2 stays reproducible. Needs ELEVENLABS_API_KEY.

Each line = segments + hand-set gaps -> trimmed, 40 ms lead, short tail, same speech loudness,
48 kHz 24-bit WAV in public/audio/vo-v2-dry/ (then mix_prep.py --voice -> public/audio/vo-v2/). Exact speech lengths -> src/data/vo-v2.json (read by Film.tsx).
Usage: .venv-tts\\Scripts\\python.exe scripts\\voice_v2.py [--engine edge|chatterbox|elevenlabs] [line-id ...]
"""
import itertools
import json
import re
import subprocess
import sys
import tempfile
import unicodedata
from pathlib import Path

import librosa
import numpy as np
import pyloudnorm as pyln
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio" / "vo-v2-dry"  # dry; scripts/mix_prep.py --voice writes the EQ'd vo-v2/
TAKES = ROOT / "public" / "audio" / "vo-v2-takes"
MANIFEST = ROOT / "src" / "data" / "vo-v2.json"
SR, FPS = 48000, 30
LEAD, TAIL = 0.04, 0.25
TARGET_LUFS = -21.0

# Performance per chapter. Salida curious and light, Corazón close and intimate, Fondo slow with weight,
# Firma the signature. edge: (rate, pitch); chatterbox: exaggeration + target pace (syllables/s);
# pace_el: target pace for the livelier v3 read.
PERF = {
    "salida": {"edge": ("-10%", "-3Hz"), "exaggeration": 0.55, "pace": 4.2, "pace_el": 4.8},
    "corazon": {"edge": ("-14%", "-5Hz"), "exaggeration": 0.5, "pace": 3.8, "pace_el": 4.2},
    "fondo": {"edge": ("-16%", "-6Hz"), "exaggeration": 0.45, "pace": 3.5, "pace_el": 4.0},
    "firma": {"edge": ("-18%", "-7Hz"), "exaggeration": 0.5, "pace": 3.0, "pace_el": 3.6},
}

# v3 (ElevenLabs): one request per line, eleven_v3 performance tags per chapter idea. Salida curious and
# bright (descubrir), Corazón warm with a smile on the coupon (elegir), Fondo confident and firm (lo que queda).
LINES_V3 = {
    "tres-notas": ("[curious] Todo perfume se cuenta en tres notas.", "salida"),
    "salida": ("[excited] La salida: descubrir.", "salida"),
    "familia": ("[curious] Por familia.", "salida"),
    "marca": ("[curious] Por marca.", "salida"),
    "nota": ("[curious] O por una sola… nota.", "salida"),
    "corazon": ("[warmly] El corazón: elegir bien.", "corazon"),
    "piramide": ("[warmly] Su pirámide.", "corazon"),
    "precio": ("[warmly] Su precio real.", "corazon"),
    "cupon": ("[cheerfully] Tu cupón, aplicado.", "corazon"),
    "yappy": ("[confident] Y pagas con Yappy.", "corazon"),
    "fondo": ("[confident] Y el fondo: lo que queda.", "fondo"),
    "pedido": ("[confident] Cada pedido, en camino.", "fondo"),
    "venta": ("[confident] Cada venta, a la vista.", "fondo"),
    "firma": ("[confident] Nota Alta.", "firma"),
    "cierre": ("[warmly] Perfumería online en Panamá.", "firma"),
}
# Short lines alone read as English to the ASR language check (an English-native voice without Spanish
# context). These pairs are generated as one Spanish sentence and split at their pause into two cue files.
PAIRS_V3 = {
    "familia": ("marca", "[curious] Por familia. Por marca."),
    "firma": ("cierre", "[confident] Nota Alta. [warmly] Perfumería online en Panamá."),
}
EL_VOICE, EL_MODEL = "EXAVITQu4vr4xnSDxMaL", "eleven_v3"  # premade "Sarah"; chosen in voice-tests-v3
EL_SETTINGS = {"stability": 0.5, "similarity_boost": 0.75}  # v3 "Natural"
TAG = re.compile(r"\[[^\]]*\]\s*")

# id -> segments: (text, chapter, gap-after seconds). Splits sit where a speaker would breathe.
LINES = {
    "tres-notas": [("Todo perfume se cuenta en tres notas.", "salida", 0)],
    "salida": [("La salida:", "salida", 0.28), ("descubrir.", "salida", 0)],
    "familia": [("Por familia.", "salida", 0)],
    "marca": [("Por marca.", "salida", 0)],
    "nota": [("O por una sola…", "salida", 0.2), ("nota.", "salida", 0)],  # a beat before "nota", as the search types
    "corazon": [("El corazón:", "corazon", 0.32), ("elegir bien.", "corazon", 0)],
    "piramide": [("Su pirámide.", "corazon", 0)],
    "precio": [("Su precio real.", "corazon", 0)],
    "cupon": [("Tu cupón, aplicado.", "corazon", 0)],
    "yappy": [("Y pagas con Yappy.", "corazon", 0)],
    "fondo": [("Y el fondo:", "fondo", 0.36), ("lo que queda.", "fondo", 0)],
    "pedido": [("Cada pedido, en camino.", "fondo", 0)],
    "venta": [("Cada venta, a la vista.", "fondo", 0)],
    "firma": [("Nota Alta.", "firma", 0)],
    "cierre": [("Perfumería online en Panamá.", "firma", 0)],
}

# ---------------------------------------------------------------- edge (fallback) ----------
EDGE_TTS = ROOT / ".venv" / "Scripts" / "edge-tts.exe"
EDGE_VOICE = "es-MX-DaliaNeural"


def render_edge(text, chapter):
    rate, pitch = PERF[chapter]["edge"]
    with tempfile.TemporaryDirectory() as tmp:
        mp3 = Path(tmp) / "seg.mp3"
        subprocess.run([str(EDGE_TTS), "--voice", EDGE_VOICE, f"--rate={rate}", f"--pitch={pitch}", "--text", text, "--write-media", str(mp3)], check=True)
        y, _ = librosa.load(mp3, sr=SR, mono=True)
    return librosa.effects.trim(y, top_db=40)[0]


# ---------------------------------------------------------------- chatterbox (chosen) -------
SEEDS = range(1, 13)  # 6 takes; up to 12 when none of the first 6 passes
IDENTITY = ROOT / "public/audio/voice-tests-v2/chatterbox-takes/A-s2__1-apertura.wav"
_cb = {}


def words(s):
    s = unicodedata.normalize("NFD", s.lower())
    return re.findall(r"[a-z0-9]+", "".join(c for c in s if unicodedata.category(c) != "Mn"))


# ASR spells brand names phonetically. Only y-initial spellings pass: "japi" would mean a jota sound.
ALIASES = {"yappy": {"yappy", "yapi", "yappi"}}


def same_words(heard, script):
    return len(heard) == len(script) and all(h == w or h in ALIASES.get(w, ()) for h, w in zip(heard, script))


def syllables(s):
    # vowel groups, plus "y" as a vowel when it ends a word ("y", "Yappy")
    return max(1, len(re.findall(r"[aeiouáéíóúü]+|y\b", s.lower())))


def get_asr():
    if "asr" not in _cb:
        from faster_whisper import WhisperModel

        _cb["asr"] = WhisperModel(str(ROOT / ".venv-tts" / "models" / "faster-whisper-small"), device="cpu", compute_type="int8")
    return _cb["asr"]


def p_spanish(y, sr):
    return dict(get_asr().detect_language(librosa.resample(y, orig_sr=sr, target_sr=16000))[2]).get("es", 0.0)


def screen(y, sr, text, chapter, terminal, pace_key="pace", min_es=None):
    """Score a take; None if it fails a hard guard (wrong/extra words, implausible length, not heard as Spanish)."""
    asr = get_asr()
    bonus = 0.0
    if min_es is not None:  # English-native voices: the take must be recognised as Spanish
        pes = p_spanish(y, sr)
        if pes < min_es:
            return None
        bonus = pes * 0.5
    segs, _ = asr.transcribe(librosa.resample(y, orig_sr=sr, target_sr=16000), language="es", word_timestamps=True, beam_size=5)
    ws = [w for s in segs for w in (s.words or [])]
    if not same_words(words("".join(w.word for w in ws)), words(text)):
        return None
    iv = librosa.effects.split(y, top_db=40, frame_length=1024, hop_length=256)
    if any((iv[i + 1][0] - iv[i][1]) / sr > 0.6 for i in range(len(iv) - 1)):
        return None  # dead air inside a phrase
    dur = (iv[-1][1] - iv[0][0]) / sr
    pace = syllables(text) / dur
    if not 2.4 <= pace <= 7.5:  # natural Spanish runs fast on short tags; ranking prefers the chapter pace
        return None
    f0, voiced, _ = librosa.pyin(y, fmin=70, fmax=400, sr=sr, frame_length=1024, hop_length=256)
    f0 = f0[voiced & ~np.isnan(f0)]
    if len(f0) < 8:
        return None
    st = 12 * np.log2(f0 / np.median(f0))
    st = st[np.abs(st) < 12]  # drop pitch-tracker octave errors (creaky phrase ends), not real rises
    if len(st) < 8:
        return None
    fall = np.median(st[: len(st) // 3]) - np.median(st[-max(3, len(st) // 6):])
    if terminal and fall < 0.3:  # statements must land, not rise into a question
        return None
    prob = float(np.mean([w.probability for w in ws]))
    # closer to the chapter's pace, more pitch life, more ASR confidence
    return prob * 2 - abs(pace - PERF[chapter][pace_key]) * 0.35 + min(float(np.std(st)), 6) * 0.08 + bonus


def render_chatterbox(text, chapter, lid, idx, terminal):
    if "model" not in _cb:
        import torch
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS

        _cb["torch"] = torch
        _cb["model"] = ChatterboxMultilingualTTS.from_local(ROOT / ".venv-tts" / "models" / "chatterbox", "cuda")
    model, torch = _cb["model"], _cb["torch"]
    (TAKES / lid).mkdir(parents=True, exist_ok=True)
    passing, log = [], []
    for seed in SEEDS:
        if seed > 6 and passing:
            break
        torch.manual_seed(seed)
        wav = model.generate(text, language_id="es", audio_prompt_path=str(IDENTITY), exaggeration=PERF[chapter]["exaggeration"], cfg_weight=0.4, temperature=0.55)
        y = wav.squeeze(0).cpu().numpy()
        sf.write(TAKES / lid / f"{idx}-s{seed}.wav", y, model.sr)
        score = screen(y, model.sr, text, chapter, terminal)
        log.append({"seed": seed, "score": None if score is None else round(score, 3)})
        if score is not None:
            passing.append((score, seed, librosa.effects.trim(librosa.resample(y, orig_sr=model.sr, target_sr=SR), top_db=40)[0]))
    if not passing:
        raise RuntimeError(f"no take of '{text}' passed screening: {log}")
    _cb.setdefault("log", {})[f"{lid}[{idx}]"] = {"text": text, "takes": log}
    return sorted(passing, key=lambda t: -t[0])


# ---------------------------------------------------------------- elevenlabs (v3) ----------
EL_SEEDS = range(1, 7)  # 2 takes per line (characters cost money); more only when neither passes


def render_eleven(tagged, chapter, lid, terminal=True):
    from eleven import tts

    text = TAG.sub("", tagged)
    (TAKES / lid).mkdir(parents=True, exist_ok=True)
    passing, log = [], []
    for seed in EL_SEEDS:
        if seed > 2 and passing:
            break
        pcm = tts(EL_VOICE, tagged, EL_MODEL, EL_SETTINGS, output_format="pcm_24000", seed=seed)
        y = np.frombuffer(pcm, dtype="<i2").astype(np.float32) / 32768
        sf.write(TAKES / lid / f"0-s{seed}.wav", y, 24000)
        score = screen(y, 24000, text, chapter, terminal, "pace_el", min_es=0.5)
        log.append({"seed": seed, "score": None if score is None else round(score, 3)})
        if score is not None:
            passing.append((score, seed, librosa.effects.trim(librosa.resample(y, orig_sr=24000, target_sr=SR), top_db=40)[0]))
    if not passing:
        raise RuntimeError(f"no take of {tagged!r} passed screening: {log}")
    _cb.setdefault("log", {})[f"{lid}[0]"] = {"text": tagged, "takes": log}
    return sorted(passing, key=lambda t: -t[0])


# ---------------------------------------------------------------- assembly -------------------
def join(takes, segs):
    parts = []
    for y, (_, _, gap) in zip(takes, segs):
        parts += [y, np.zeros(int(gap * SR))]
    return np.concatenate(parts)


def build(lid, engine):
    segs = LINES[lid]
    if engine == "edge":
        return join([render_edge(text, chapter) for text, chapter, _ in segs], segs)
    if engine == "elevenlabs":
        tagged, chapter = LINES_V3[lid]
        segs = [(TAG.sub("", tagged), chapter, 0)]
        ranked = [render_eleven(tagged, chapter, lid)]
    else:
        ranked = [render_chatterbox(text, chapter, lid, i, text.rstrip().endswith(".")) for i, (text, chapter, _) in enumerate(segs)]
    script = words(" ".join(t for t, _, _ in segs))
    # best-ranked combinations first; the joined line must also survive a full-line ASR check
    combos = sorted(itertools.product(*[range(min(3, len(r))) for r in ranked]), key=sum)
    for combo in combos:
        y = join([ranked[i][c][2] for i, c in enumerate(combo)], segs)
        segs16 = get_asr().transcribe(librosa.resample(y, orig_sr=SR, target_sr=16000), language="es", beam_size=5)[0]
        heard = words("".join(s.text for s in segs16))
        if same_words(heard, script):
            seeds = [ranked[i][c][1] for i, c in enumerate(combo)]
            _cb.setdefault("picks", {})[lid] = {"seeds": seeds, "heard": " ".join(heard)}
            print(f"  {lid}: seeds {seeds} -> " + " ".join(heard))
            return y
    raise RuntimeError(f"{lid}: no combination of passing takes survives the full-line check")


def build_pair(first):
    """v3 pairs: one Spanish sentence, split at its longest pause into the two cue lines (each ASR-checked)."""
    second, tagged = PAIRS_V3[first]
    texts = [TAG.sub("", LINES_V3[k][0]) for k in (first, second)]
    # "Por familia. Por marca." are non-final items of a list ("…o por una sola nota"): suspended endings are right
    for _, seed, y in render_eleven(tagged, LINES_V3[first][1], f"{first}+{second}", terminal=first != "familia"):
        iv = librosa.effects.split(y, top_db=40, frame_length=1024, hop_length=256)
        if len(iv) < 2:
            continue
        i = max(range(len(iv) - 1), key=lambda k: iv[k + 1][0] - iv[k][1])
        cut = (iv[i][1] + iv[i + 1][0]) // 2
        parts = [librosa.effects.trim(p, top_db=40)[0] for p in (y[:cut], y[cut:])]
        heard = [words("".join(s.text for s in get_asr().transcribe(librosa.resample(p, orig_sr=SR, target_sr=16000), language="es", beam_size=5)[0])) for p in parts]
        if all(same_words(h, words(t)) for h, t in zip(heard, texts)):
            _cb.setdefault("picks", {})[f"{first}+{second}"] = {"seeds": [seed], "heard": " | ".join(" ".join(h) for h in heard)}
            print(f"  {first}+{second}: seed {seed} -> " + " | ".join(" ".join(h) for h in heard))
            return dict(zip((first, second), parts))
    raise RuntimeError(f"{first}+{second}: no take splits into the two lines cleanly")


if __name__ == "__main__":
    args = sys.argv[1:]
    engine = "chatterbox"
    if "--engine" in args:
        engine = args[args.index("--engine") + 1]
        args = [a for a in args if a not in ("--engine", engine)]
    if engine == "elevenlabs":  # narration v3 lives next to v2, never over it
        sys.path.insert(0, str(Path(__file__).resolve().parent))
        OUT, TAKES, MANIFEST = ROOT / "public/audio/vo-v3-dry", ROOT / "public/audio/vo-v3-takes", ROOT / "src/data/vo-v3.json"
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    meter = pyln.Meter(SR)
    todo = {}
    for lid in args or LINES:
        if engine == "elevenlabs" and lid in PAIRS_V3:
            todo.update(build_pair(lid))
        elif not (engine == "elevenlabs" and lid in {s for s, _ in PAIRS_V3.values()}):
            todo[lid] = build(lid, engine)
    for lid, speech in todo.items():
        speech *= 10 ** ((TARGET_LUFS - meter.integrated_loudness(speech)) / 20)
        peak = np.max(np.abs(speech))
        if peak > 0.89:  # keep >= 1 dB headroom per line; the master limiter handles the rest
            speech *= 0.89 / peak
        y = np.concatenate([np.zeros(int(LEAD * SR)), speech, np.zeros(int(TAIL * SR))])
        sf.write(OUT / f"{lid}.wav", y, SR, subtype="PCM_24")
        manifest[lid] = {"speechFrames": int(np.ceil(len(speech) / SR * FPS)), "leadFrames": round(LEAD * FPS, 2), "engine": engine}
        print(lid, manifest[lid])
    MANIFEST.write_text(json.dumps(manifest, indent=1), encoding="utf-8")
    if "picks" in _cb:
        sel = TAKES / "selection.json"
        prev = json.loads(sel.read_text(encoding="utf-8")) if sel.exists() and len(args) < len(LINES) else {}
        prev.update({"picks": {**prev.get("picks", {}), **_cb["picks"]}, "takes": {**prev.get("takes", {}), **_cb.get("log", {})}})
        sel.write_text(json.dumps(prev, ensure_ascii=False, indent=1), encoding="utf-8")
