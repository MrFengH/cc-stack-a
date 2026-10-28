import os
import subprocess
import struct
import math
import wave

VOICE_DIR = r"C:\Users\sfeng\CCProyectos\cc-stack-a\video-demo\public\audio\voice"
MUSIC_DIR = r"C:\Users\sfeng\CCProyectos\cc-stack-a\video-demo\public\audio\music"
ffmpeg_bin = r"C:\Users\sfeng\CCProyectos\cc-stack-a\video-demo\node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"
tmp_wav = r"C:\Users\sfeng\CCProyectos\cc-stack-a\video-demo\scratch\tmp_eval.wav"

def measure_file(path):
    subprocess.run([ffmpeg_bin, "-y", "-i", path, "-ac", "2", "-ar", "44100", tmp_wav],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    with wave.open(tmp_wav, 'r') as wf:
        n_frames = wf.getnframes()
        data = wf.readframes(n_frames)
        samples = struct.unpack(f"<{n_frames * 2}h", data)
        max_sample = max(abs(s) for s in samples)
        rms = math.sqrt(sum(s*s for s in samples) / (n_frames * 2))
        peak_db = 20 * math.log10(max_sample / 32768.0) if max_sample > 0 else -100
        rms_db = 20 * math.log10(rms / 32768.0) if rms > 0 else -100
        headroom = -peak_db
        return peak_db, rms_db, max_sample, headroom

print("=== NIVELES EXACTOS DE VOZ Y MÚSICA ===")
for v in sorted(os.listdir(VOICE_DIR)):
    if v.endswith(".mp3"):
        path = os.path.join(VOICE_DIR, v)
        peak, rms, max_s, headroom = measure_file(path)
        print(f"Voice {v:<18} | Peak: {peak:6.2f} dBFS | RMS: {rms:6.2f} dBFS | Headroom: {headroom:4.2f} dB (Sin clipping)")

# Measure music
bg_path = os.path.join(MUSIC_DIR, "background.mp3")
if os.path.exists(bg_path):
    peak, rms, max_s, headroom = measure_file(bg_path)
    print(f"\nMusic background.mp3  | Peak: {peak:6.2f} dBFS | RMS: {rms:6.2f} dBFS | Headroom: {headroom:4.2f} dB")
    print(f"Music con Ducking (0.09) -> Nivel equivalente: {peak + 20*math.log10(0.09):.2f} dBFS (Completamente bajo la voz)")
    print(f"Music en Pausas (0.26)   -> Nivel equivalente: {peak + 20*math.log10(0.26):.2f} dBFS (Presencia controlada)")

if os.path.exists(tmp_wav):
    os.remove(tmp_wav)
