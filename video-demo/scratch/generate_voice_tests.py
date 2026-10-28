import asyncio
import os
import edge_tts

SAMPLE_TEXT = "Descubre Nota Alta: una experiencia digital diseñada para encontrar tu fragancia ideal, con notas olfativas reales y entregas el mismo día en Panamá."

VOICES = [
    ("es-MX-DaliaNeural", "sample-dalia-es-MX.mp3"),
    ("es-US-PalomaNeural", "sample-paloma-es-US.mp3"),
    ("es-CO-SalomeNeural", "sample-salome-es-CO.mp3"),
    ("es-PA-MargaritaNeural", "sample-margarita-es-PA.mp3"),
]

async def generate():
    out_dir = os.path.abspath("video-demo/public/audio/voice-tests")
    os.makedirs(out_dir, exist_ok=True)
    
    for voice_name, filename in VOICES:
        out_path = os.path.join(out_dir, filename)
        print(f"Generating sample with {voice_name} -> {filename}...")
        communicate = edge_tts.Communicate(SAMPLE_TEXT, voice_name)
        await communicate.save(out_path)
        print(f"Saved: {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == '__main__':
    asyncio.run(generate())
