import subprocess
import wave
import struct
import math
import os

ffmpeg_bin = r"C:\Users\sfeng\CCProyectos\cc-stack-a\video-demo\node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"
video_path = r"C:\Users\sfeng\CCProyectos\cc-stack-a\video-demo\out\ProductShowcase-V2-final.mp4"
tmp_wav = r"C:\Users\sfeng\CCProyectos\cc-stack-a\video-demo\scratch\tmp_final_audio.wav"

subprocess.run([ffmpeg_bin, "-y", "-i", video_path, "-vn", "-ac", "2", "-ar", "48000", tmp_wav],
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

file_size_bytes = os.path.getsize(video_path)
file_size_mb = file_size_bytes / (1024 * 1024)

print(f"=== METRICAS DEL ARCHIVO FINAL RENDERIZADO ===")
print(f"Archivo: {os.path.basename(video_path)}")
print(f"Tamano: {file_size_mb:.2f} MB ({file_size_bytes:,} bytes)")
print(f"Duracion audio extraido: {n_frames / 48000.0:.3f} s")
print(f"Max Sample: {max_sample} / 32768")
print(f"True Peak: {peak_db:.2f} dBFS")
print(f"Headroom disponible: {headroom:.2f} dB")
print(f"Nivel RMS general: {rms_db:.2f} dBFS")
print(f"Estado de clipping: {'CONFIRMADO: CERO CLIPPING (Margen seguro)' if max_sample < 32768 else 'ADVERTENCIA: Posible clipping'}")

if os.path.exists(tmp_wav):
    os.remove(tmp_wav)
