import math
import os
import struct
import wave

VOICE_DIR = r"C:\Users\sfeng\CCProyectos\cc-stack-a\video-demo\public\audio\voice"
SFX_DIR = r"C:\Users\sfeng\CCProyectos\cc-stack-a\video-demo\public\audio\sfx"

# Let's check max peak levels of all generated audio files
print("=== VERIFICACIÓN DE PICOS Y CLIPPING EN ASSETS DE AUDIO ===")

# Check SFX WAV files
for sfx in os.listdir(SFX_DIR):
    if sfx.endswith(".wav"):
        path = os.path.join(SFX_DIR, sfx)
        with wave.open(path, 'r') as wf:
            n_frames = wf.getnframes()
            data = wf.readframes(n_frames)
            samples = struct.unpack(f"<{n_frames * wf.getnchannels()}h", data)
            max_sample = max(abs(s) for s in samples)
            peak_db = 20 * math.log10(max_sample / 32768.0) if max_sample > 0 else -100
            print(f"SFX {sfx:<20} | Max sample: {max_sample:5d} / 32768 | Peak: {peak_db:6.2f} dBFS")

# Check voice files using ffmpeg volumedetect
ffmpeg_bin = r"C:\Users\sfeng\CCProyectos\cc-stack-a\video-demo\node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"
print("\n=== NIVELES DE VOZ (ffmpeg volumedetect) ===")
for v in sorted(os.listdir(VOICE_DIR)):
    if v.endswith(".mp3"):
        path = os.path.join(VOICE_DIR, v)
        cmd = f'"{ffmpeg_bin}" -i "{path}" -af "volumedetect" -f null NUL 2>&1'
        output = os.popen(cmd).read()
        max_vol = [line for line in output.splitlines() if "max_volume" in line]
        mean_vol = [line for line in output.splitlines() if "mean_volume" in line]
        max_str = max_vol[0].strip() if max_vol else "N/A"
        mean_str = mean_vol[0].strip() if mean_vol else "N/A"
        print(f"Voice {v:<18} | {max_str} | {mean_str}")
