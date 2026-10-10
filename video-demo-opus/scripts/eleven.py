"""Minimal ElevenLabs client (stdlib only). The API key is read from the ELEVENLABS_API_KEY environment
variable at call time; it is never printed, logged or written anywhere.
Usage:
  python scripts/eleven.py info                       # quota, TTS models, voices in the account
  python scripts/eleven.py shared [query]             # Voice Library: female Spanish voices
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.elevenlabs.io"


def call(method, path, body=None, query=None, raw=False):
    url = API + path + ("?" + urllib.parse.urlencode(query) if query else "")
    req = urllib.request.Request(url, method=method, data=json.dumps(body).encode() if body is not None else None)
    req.add_header("xi-api-key", os.environ["ELEVENLABS_API_KEY"])
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            data = r.read()
    except urllib.error.HTTPError as e:  # surface the API message, never the request headers
        raise RuntimeError(f"{method} {path} -> HTTP {e.code}: {e.read()[:400].decode(errors='replace')}") from None
    return data if raw else json.loads(data)


def tts(voice_id, text, model_id, settings, output_format="pcm_44100", seed=None):
    """Returns raw 16-bit mono PCM at 44.1 kHz (lossless; no MP3 generation loss before our own mix)."""
    body = {"text": text, "model_id": model_id, "voice_settings": settings, "language_code": "es"}
    if seed is not None:
        body["seed"] = seed
    return call("POST", f"/v1/text-to-speech/{voice_id}", body, {"output_format": output_format}, raw=True)


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "info":
        try:  # scoped keys may lack user_read; quota is informative only
            s = call("GET", "/v1/user/subscription")
            print(f"tier={s.get('tier')} characters {s.get('character_count')}/{s.get('character_limit')}")
        except RuntimeError as e:
            print("quota unavailable:", str(e)[:140])
        try:  # needs models_read; otherwise models are found by probing TTS (see eleven_audition.py)
            for m in call("GET", "/v1/models"):
                if m.get("can_do_text_to_speech"):
                    print(f"model {m['model_id']} | {m.get('description', '')[:90]}")
        except RuntimeError as e:
            print("models unavailable:", str(e)[:140])
        for v in call("GET", "/v2/voices", query={"page_size": 100})["voices"]:
            lab = v.get("labels") or {}
            print(f"voice {v['voice_id']} {v['name']:<28} cat={v.get('category')} {lab.get('gender', '')} {lab.get('age', '')} {lab.get('accent', '')} {lab.get('language', '')} | {(lab.get('descriptive') or lab.get('description') or '')}")
    elif cmd == "shared":
        q = {"page_size": 30, "gender": "female", "language": "es", "sort": "usage_character_count_1y"}
        if len(sys.argv) > 2:
            q["search"] = sys.argv[2]
        for v in call("GET", "/v1/shared-voices", query=q)["voices"]:
            print(f"shared {v['voice_id']} {v['name'][:30]:<30} {v.get('accent', '')}/{v.get('locale', '')} age={v.get('age')} use={v.get('use_case')} desc={v.get('descriptive')} | {(v.get('description') or '')[:80]}")
